const express = require('express');
const { body, validationResult } = require('express-validator');
const TaskOrder = require('../models/taskOrder.model');
const Driver = require('../models/driver.model');
const User = require('../models/user.model');
const { authenticateSession, authorizeRole } = require('../middleware/auth');
const cloudStorageService = require('../services/cloudStorageService');
const emailService = require('../services/emailService');
const pdfService = require('../services/pdfService');
const whatsappService = require('../services/whatsappService');

const router = express.Router();

// Create new task order
router.post('/', [
  authenticateSession,
  authorizeRole(['Transport JCO', 'Transport Officer', 'Commanding Officer']),
  cloudStorageService.getMultipleUploadMiddleware(5),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('issueDescription').trim().notEmpty().withMessage('Issue description is required'),
  body('priority').isIn(['Critical', 'High', 'Medium', 'Low']).withMessage('Valid priority is required'),
  body('vehicleType').isIn(['A Vehicle', 'B Vehicle', 'C Vehicle']).withMessage('Valid vehicle type is required'),
  body('vehicleId').trim().notEmpty().withMessage('Vehicle ID is required'),
  body('driverId').isMongoId().withMessage('Valid driver ID is required'),
  body('issueCategory').trim().notEmpty().withMessage('Issue category is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      issueDescription,
      priority,
      urgency,
      vehicleType,
      vehicleId,
      vehicleDetails,
      driverId,
      issueCategory,
      symptomsObserved,
      whenIssueOccurred,
      partsRequired,
      toolsRequired,
      estimatedDuration,
      estimatedCost
    } = req.body;

    // Get driver information
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(400).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Create task order
    const taskOrder = new TaskOrder({
      title,
      issueDescription,
      priority,
      urgency,
      vehicleType,
      vehicleId,
      vehicleDetails: vehicleDetails ? JSON.parse(vehicleDetails) : {},
      identifiedBy: {
        driverId: driver._id,
        driverName: driver.personalInfo.firstName + ' ' + driver.personalInfo.lastName,
        driverServiceNumber: driver.serviceInfo.serviceNumber,
        driverContact: driver.personalInfo.contactNumber
      },
      issueCategory,
      symptomsObserved,
      whenIssueOccurred: whenIssueOccurred ? new Date(whenIssueOccurred) : null,
      partsRequired: partsRequired ? JSON.parse(partsRequired) : [],
      toolsRequired: toolsRequired ? JSON.parse(toolsRequired) : [],
      estimatedDuration: estimatedDuration ? Number(estimatedDuration) : null,
      estimatedCost: estimatedCost ? Number(estimatedCost) : null,
      requestedBy: req.user.id,
      vehiclePhotos: []
    });

    // Handle photo uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudStorageService.uploadVehiclePhoto(file, taskOrder._id);
          if (uploadResult.success) {
            taskOrder.vehiclePhotos.push({
              filename: uploadResult.originalName,
              originalName: uploadResult.originalName,
              cloudUrl: uploadResult.url,
              publicId: uploadResult.publicId,
              size: uploadResult.size,
              uploadedBy: req.user.id,
              description: `Issue photo for ${vehicleType} ${vehicleId}`
            });
          }
        } catch (uploadError) {
          console.error('Photo upload error:', uploadError);
        }
      }
    }

    await taskOrder.save();

    // Send email notifications
    try {
      const recipients = await getNotificationRecipients('task_created', taskOrder);
      if (recipients.length > 0) {
        const emailResult = await emailService.sendTaskCreationNotification(taskOrder, recipients);
        
        taskOrder.emailNotifications.taskCreated = {
          sent: emailResult.success,
          sentDate: emailResult.success ? new Date() : null,
          recipients: recipients
        };
        
        await taskOrder.save();
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    // Populate task order for response
    await taskOrder.populate([
      { path: 'requestedBy', select: 'firstName lastName rank role' },
      { path: 'identifiedBy.driverId', select: 'personalInfo.firstName personalInfo.lastName serviceInfo.serviceNumber' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Task order created successfully',
      taskOrder
    });

  } catch (error) {
    console.error('Create task order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task order',
      error: error.message
    });
  }
});

// Get all task orders with filtering and pagination
router.get('/', authenticateSession, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      vehicleType,
      assignedTo,
      createdBy,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.workStatus = status;
    if (priority) filter.priority = priority;
    if (vehicleType) filter.vehicleType = vehicleType;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (createdBy) filter.requestedBy = createdBy;

    // Role-based filtering
    if (req.user.role === 'Transport JCO') {
      filter.requestedBy = req.user.id;
    } else if (req.user.role === 'Maintenance JCO') {
      filter.assignedTo = req.user.id;
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const taskOrders = await TaskOrder.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate([
        { path: 'requestedBy', select: 'firstName lastName rank role' },
        { path: 'assignedTo', select: 'firstName lastName rank role' },
        { path: 'approvedBy', select: 'firstName lastName rank role' },
        { path: 'finalApprovedBy', select: 'firstName lastName rank role' }
      ]);

    const totalTaskOrders = await TaskOrder.countDocuments(filter);
    const totalPages = Math.ceil(totalTaskOrders / parseInt(limit));

    res.json({
      success: true,
      taskOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalTaskOrders,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get task orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task orders',
      error: error.message
    });
  }
});

// Get task order by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const taskOrder = await TaskOrder.findById(req.params.id)
      .populate([
        { path: 'requestedBy', select: 'firstName lastName rank role serviceNumber' },
        { path: 'assignedTo', select: 'firstName lastName rank role serviceNumber' },
        { path: 'assignedTechnician', select: 'personalInfo specializations performance' },
        { path: 'assignedDriver', select: 'personalInfo vehicleExperience' },
        { path: 'approvedBy', select: 'firstName lastName rank role' },
        { path: 'finalApprovedBy', select: 'firstName lastName rank role' }
      ]);

    if (!taskOrder) {
      return res.status(404).json({
        success: false,
        message: 'Task order not found'
      });
    }

    res.json({
      success: true,
      taskOrder
    });

  } catch (error) {
    console.error('Get task order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get task order',
      error: error.message
    });
  }
});

// Approve task order
router.patch('/:id/approve', [
  authenticateSession,
  authorizeRole(['Transport Officer', 'Maintenance Officer', 'Commanding Officer'])
], async (req, res) => {
  try {
    const { approvalComments } = req.body;

    const taskOrder = await TaskOrder.findById(req.params.id);
    if (!taskOrder) {
      return res.status(404).json({
        success: false,
        message: 'Task order not found'
      });
    }

    if (taskOrder.approvalStatus !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Task order is already processed'
      });
    }

    taskOrder.approvalStatus = 'Approved';
    taskOrder.approvedBy = req.user.id;
    taskOrder.approvalDate = new Date();
    taskOrder.approvalComments = approvalComments;

    await taskOrder.save();

    res.json({
      success: true,
      message: 'Task order approved successfully',
      taskOrder
    });

  } catch (error) {
    console.error('Approve task order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve task order',
      error: error.message
    });
  }
});

// Complete task order
router.patch('/:id/complete', [
  authenticateSession,
  authorizeRole(['Maintenance JCO', 'Maintenance Officer', 'Commanding Officer']),
  cloudStorageService.getMultipleUploadMiddleware(5),
  body('workCompleted').trim().notEmpty().withMessage('Work completed description is required'),
  body('qualityCheck').isIn(['Passed', 'Failed']).withMessage('Quality check result is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      workCompleted,
      partsUsed,
      testResults,
      qualityCheck,
      technicianNotes,
      recommendedActions,
      nextMaintenanceDate,
      actualDuration,
      actualCost
    } = req.body;

    const taskOrder = await TaskOrder.findById(req.params.id);
    if (!taskOrder) {
      return res.status(404).json({
        success: false,
        message: 'Task order not found'
      });
    }

    // Handle completion photos
    const completionPhotos = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResult = await cloudStorageService.uploadCompletionPhoto(file, taskOrder._id);
          if (uploadResult.success) {
            completionPhotos.push({
              filename: uploadResult.originalName,
              path: uploadResult.url,
              description: `Completion photo for task ${taskOrder.unId}`
            });
          }
        } catch (uploadError) {
          console.error('Completion photo upload error:', uploadError);
        }
      }
    }

    // Update completion report
    taskOrder.completionReport = {
      workCompleted,
      partsUsed: partsUsed ? JSON.parse(partsUsed) : [],
      testResults,
      qualityCheck,
      completionPhotos,
      technicianNotes,
      recommendedActions,
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
      completedBy: req.user.id,
      completionDate: new Date()
    };

    taskOrder.workStatus = 'Completed';
    taskOrder.workCompletionDate = new Date();
    taskOrder.actualDuration = actualDuration ? Number(actualDuration) : null;
    taskOrder.actualCost = actualCost ? Number(actualCost) : null;

    await taskOrder.save();

    // Generate PDF report
    try {
      const pdfResult = await pdfService.generateCompletionReportPDF(taskOrder);
      if (pdfResult.success) {
        taskOrder.completionReportPdf = {
          generated: true,
          pdfUrl: pdfResult.pdfUrl,
          generatedDate: new Date()
        };
        await taskOrder.save();

        // Send completion notifications
        const emailRecipients = await getNotificationRecipients('task_completed', taskOrder);
        if (emailRecipients.length > 0) {
          await emailService.sendTaskCompletionNotification(taskOrder, emailRecipients);
        }

        // Send WhatsApp with PDF
        const whatsappRecipients = await getWhatsAppRecipients(taskOrder);
        if (whatsappRecipients.length > 0) {
          await whatsappService.sendBulkMessages(whatsappRecipients, taskOrder, pdfResult.pdfUrl);
        }
      }
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
    }

    res.json({
      success: true,
      message: 'Task order completed successfully',
      taskOrder
    });

  } catch (error) {
    console.error('Complete task order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete task order',
      error: error.message
    });
  }
});

// Helper function to get notification recipients
async function getNotificationRecipients(type, taskOrder) {
  const recipients = [];
  
  try {
    if (type === 'task_created') {
      // Notify Transport Officer and Maintenance JCO
      const users = await User.find({
        $or: [
          { role: 'Transport Officer' },
          { role: 'Maintenance JCO' },
          { role: 'Commanding Officer' }
        ],
        isActive: true
      }).select('email');
      
      recipients.push(...users.map(user => user.email));
    } else if (type === 'task_completed') {
      // Notify requestor and commanding officer
      const requestor = await User.findById(taskOrder.requestedBy).select('email');
      const co = await User.findOne({ role: 'Commanding Officer', isActive: true }).select('email');
      
      if (requestor) recipients.push(requestor.email);
      if (co) recipients.push(co.email);
    }
  } catch (error) {
    console.error('Error getting notification recipients:', error);
  }
  
  return recipients.filter(email => email); // Remove null/undefined emails
}

// Helper function to get WhatsApp recipients
async function getWhatsAppRecipients(taskOrder) {
  const recipients = [];
  
  try {
    // Get driver's phone number
    if (taskOrder.identifiedBy.driverContact) {
      recipients.push(taskOrder.identifiedBy.driverContact);
    }
    
    // Get requestor's phone number
    const requestor = await User.findById(taskOrder.requestedBy).select('phoneNumber');
    if (requestor && requestor.phoneNumber) {
      recipients.push(requestor.phoneNumber);
    }
    
    // Get commanding officer's phone number
    const co = await User.findOne({ role: 'Commanding Officer', isActive: true }).select('phoneNumber');
    if (co && co.phoneNumber) {
      recipients.push(co.phoneNumber);
    }
  } catch (error) {
    console.error('Error getting WhatsApp recipients:', error);
  }
  
  return recipients.filter(phone => phone); // Remove null/undefined phone numbers
}

module.exports = router;