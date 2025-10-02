const express = require('express');
const Maintenance = require('../models/maintenance.model');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

// Get all maintenance tasks
router.get('/', authenticateSession, async (req, res) => {
  try {
    const maintenanceTasks = await Maintenance.find({})
      .populate('equipment', 'name vehicleId category location')
      .populate('assignedDriver', 'personalInfo serviceInfo')
      .populate('assignedLADRep', 'personalInfo serviceInfo')
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });
    
    res.json(maintenanceTasks);
  } catch (error) {
    console.error('Get maintenance tasks error:', error);
    res.status(500).json({ message: 'Failed to get maintenance tasks', error: error.message });
  }
});

// Get maintenance task by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const maintenanceTask = await Maintenance.findById(req.params.id)
      .populate('equipment', 'name vehicleId category location')
      .populate('assignedDriver', 'personalInfo serviceInfo')
      .populate('assignedLADRep', 'personalInfo serviceInfo')
      .populate('createdBy', 'username role');
    
    if (!maintenanceTask) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    res.json(maintenanceTask);
  } catch (error) {
    console.error('Get maintenance task error:', error);
    res.status(500).json({ message: 'Failed to get maintenance task', error: error.message });
  }
});

// Create new maintenance task
router.post('/', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to create maintenance tasks
    if (!['CO', 'Maintenance Officer', 'Maintenance JCO'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const maintenanceTask = new Maintenance({
      ...req.body,
      createdBy: req.user.id
    });
    
    const savedTask = await maintenanceTask.save();
    
    // Populate the saved task before sending response
    const populatedTask = await Maintenance.findById(savedTask._id)
      .populate('equipment', 'name vehicleId category location')
      .populate('assignedDriver', 'personalInfo serviceInfo')
      .populate('assignedLADRep', 'personalInfo serviceInfo')
      .populate('createdBy', 'username role');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating maintenance task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error creating maintenance task', error: error.message });
  }
});

// Update maintenance task
router.put('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to update maintenance tasks
    if (!['CO', 'Maintenance Officer', 'Maintenance JCO'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const maintenanceTask = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('equipment', 'name vehicleId category location')
    .populate('assignedDriver', 'personalInfo serviceInfo')
    .populate('assignedLADRep', 'personalInfo serviceInfo')
    .populate('createdBy', 'username role');
    
    if (!maintenanceTask) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    res.json(maintenanceTask);
  } catch (error) {
    console.error('Error updating maintenance task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error updating maintenance task', error: error.message });
  }
});

// Delete maintenance task
router.delete('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to delete maintenance tasks
    if (!['CO', 'Maintenance Officer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const maintenanceTask = await Maintenance.findByIdAndDelete(req.params.id);
    
    if (!maintenanceTask) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    res.json({ message: 'Maintenance task deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance task:', error);
    res.status(500).json({ message: 'Error deleting maintenance task', error: error.message });
  }
});

// Get maintenance tasks by equipment
router.get('/equipment/:equipmentId', authenticateSession, async (req, res) => {
  try {
    const maintenanceTasks = await Maintenance.find({ equipment: req.params.equipmentId })
      .populate('assignedDriver', 'personalInfo serviceInfo')
      .populate('assignedLADRep', 'personalInfo serviceInfo')
      .populate('createdBy', 'username role')
      .sort({ createdAt: -1 });
    
    res.json(maintenanceTasks);
  } catch (error) {
    console.error('Error fetching maintenance tasks by equipment:', error);
    res.status(500).json({ message: 'Error fetching maintenance tasks', error: error.message });
  }
});

// Get maintenance tasks by status
router.get('/status/:status', authenticateSession, async (req, res) => {
  try {
    const maintenanceTasks = await Maintenance.find({ status: req.params.status })
      .populate('equipment', 'name vehicleId category location')
      .populate('assignedDriver', 'personalInfo serviceInfo')
      .populate('assignedLADRep', 'personalInfo serviceInfo')
      .sort({ dueDate: 1 });
    
    res.json(maintenanceTasks);
  } catch (error) {
    console.error('Error fetching maintenance tasks by status:', error);
    res.status(500).json({ message: 'Error fetching maintenance tasks', error: error.message });
  }
});

// Get overdue maintenance tasks
router.get('/overdue/list', authenticateSession, async (req, res) => {
  try {
    const currentDate = new Date();
    const overdueTasks = await Maintenance.find({ 
      dueDate: { $lt: currentDate },
      isCompleted: false
    })
    .populate('equipment', 'name vehicleId category location')
    .populate('assignedDriver', 'personalInfo serviceInfo')
    .populate('assignedLADRep', 'personalInfo serviceInfo')
    .sort({ dueDate: 1 });
    
    res.json(overdueTasks);
  } catch (error) {
    console.error('Error fetching overdue tasks:', error);
    res.status(500).json({ message: 'Error fetching overdue tasks', error: error.message });
  }
});

// Mark task as completed
router.patch('/:id/complete', authenticateSession, async (req, res) => {
  try {
    const maintenanceTask = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { 
        isCompleted: true, 
        completedDate: new Date(),
        status: 'Completed'
      },
      { new: true }
    )
    .populate('equipment', 'name vehicleId category location')
    .populate('assignedDriver', 'personalInfo serviceInfo')
    .populate('assignedLADRep', 'personalInfo serviceInfo');
    
    if (!maintenanceTask) {
      return res.status(404).json({ message: 'Maintenance task not found' });
    }
    
    res.json(maintenanceTask);
  } catch (error) {
    console.error('Error completing maintenance task:', error);
    res.status(500).json({ message: 'Error completing maintenance task', error: error.message });
  }
});

module.exports = router;
