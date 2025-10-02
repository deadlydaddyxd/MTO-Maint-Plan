const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskOrderSchema = new Schema({
  taskOrderNumber: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
      return 'TO-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  
  // Basic Information
  unId: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, '0');
      const random = Math.random().toString(36).substr(2, 6).toUpperCase();
      return `UN-${year}${month}-${random}`;
    }
  },
  title: { type: String, required: true, trim: true },
  issueDescription: { type: String, required: true },
  priority: { 
    type: String, 
    required: true, 
    enum: ['Critical', 'High', 'Medium', 'Low'], 
    default: 'Medium' 
  },
  urgency: { 
    type: String, 
    enum: ['Emergency', 'Urgent', 'Normal', 'Routine'], 
    default: 'Normal' 
  },
  
  // Vehicle Information
  vehicleType: { 
    type: String, 
    required: true, 
    enum: ['A Vehicle', 'B Vehicle', 'C Vehicle'] 
  },
  vehicleId: { type: String, required: true },
  vehicleDetails: {
    name: { type: String },
    location: { type: String },
    currentStatus: { type: String }
  },
  
  // Issue Details
  issueCategory: { 
    type: String, 
    enum: [
      'Engine Problem', 
      'Transmission Issue', 
      'Electrical Fault', 
      'Hydraulic System', 
      'Brake System', 
      'Fuel System',
      'Cooling System',
      'Exhaust System',
      'Suspension',
      'Body/Structural',
      'Safety Equipment',
      'Communication System',
      'Weapon System', // for A vehicles
      'Specialized Equipment', // for C vehicles
      'Other'
    ],
    required: true
  },
  issueDescription: { type: String, required: true },
  symptomsObserved: { type: String },
  whenIssueOccurred: { type: Date },
  
  // Driver who identified the issue
  identifiedBy: {
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    driverName: { type: String, required: true },
    driverServiceNumber: { type: String, required: true },
    identificationDate: { type: Date, default: Date.now },
    driverContact: { type: String }
  },
  
  // Photos and Documentation (Cloud Storage)
  vehiclePhotos: [{
    filename: { type: String },
    originalName: { type: String },
    cloudUrl: { type: String }, // Cloudinary/AWS S3 URL
    publicId: { type: String }, // For cloud deletion
    size: { type: Number },
    uploadDate: { type: Date, default: Date.now },
    deleteAfter: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }, // 7 days
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    description: { type: String }
  }],
  
  // Requestor Information
  requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requestedDate: { type: Date, default: Date.now },
  contactInfo: {
    phone: { type: String },
    email: { type: String },
    location: { type: String }
  },
  
  // Approval Workflow
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], 
    default: 'Pending' 
  },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvalDate: { type: Date },
  approvalComments: { type: String },
  rejectionReason: { type: String },
  
  // Assignment
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }, // Maintenance JCO
  assignedTechnician: { type: Schema.Types.ObjectId, ref: 'Technician' },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver' }, // Assistant
  assignmentDate: { type: Date },
  
  // Work Details
  workStatus: { 
    type: String, 
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold', 'Cancelled'], 
    default: 'Not Started' 
  },
  workStartDate: { type: Date },
  workCompletionDate: { type: Date },
  estimatedDuration: { type: Number }, // in hours
  actualDuration: { type: Number }, // in hours
  
  // Resources Required
  partsRequired: [{
    partName: { type: String },
    partNumber: { type: String },
    quantity: { type: Number },
    estimatedCost: { type: Number },
    supplier: { type: String },
    availability: { type: String, enum: ['Available', 'To Order', 'Back Order'] }
  }],
  toolsRequired: [{ type: String }],
  specialEquipmentNeeded: [{ type: String }],
  
  // Cost Information
  estimatedCost: { type: Number },
  actualCost: { type: Number },
  laborCost: { type: Number },
  partsCost: { type: Number },
  
  // Progress Updates
  workLog: [{
    date: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String },
    notes: { type: String },
    hoursWorked: { type: Number },
    workPhotos: [{
      filename: { type: String },
      path: { type: String },
      description: { type: String }
    }]
  }],
  
  // Completion Report
  completionReport: {
    workCompleted: { type: String },
    partsUsed: [{
      partName: { type: String },
      partNumber: { type: String },
      quantity: { type: Number },
      actualCost: { type: Number }
    }],
    testResults: { type: String },
    qualityCheck: { 
      type: String, 
      enum: ['Passed', 'Failed', 'Pending'] 
    },
    completionPhotos: [{
      filename: { type: String },
      path: { type: String },
      description: { type: String }
    }],
    technicianNotes: { type: String },
    recommendedActions: { type: String },
    nextMaintenanceDate: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completionDate: { type: Date }
  },
  
  // Final Approval
  finalApprovalStatus: { 
    type: String, 
    enum: ['Pending Review', 'Approved', 'Rejected', 'Needs Rework'], 
    default: 'Pending Review' 
  },
  finalApprovedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Maintenance Officer
  finalApprovalDate: { type: Date },
  finalApprovalComments: { type: String },
  
  // Email Notifications
  emailNotifications: {
    taskCreated: {
      sent: { type: Boolean, default: false },
      sentDate: { type: Date },
      recipients: [{ type: String }] // email addresses
    },
    taskCompleted: {
      sent: { type: Boolean, default: false },
      sentDate: { type: Date },
      recipients: [{ type: String }]
    },
    taskApproved: {
      sent: { type: Boolean, default: false },
      sentDate: { type: Date },
      recipients: [{ type: String }]
    }
  },
  
  // PDF Completion Report
  completionReportPdf: {
    generated: { type: Boolean, default: false },
    pdfUrl: { type: String }, // Cloud storage URL
    generatedDate: { type: Date },
    manualDistributionRequired: { type: Boolean, default: true },
    distributionInfo: {
      recipients: [{
        name: { type: String },
        phone: { type: String },
        role: { type: String }
      }],
      message: { type: String },
      instructions: { type: String }
    }
  },
  
  // Notifications
  notifications: [{
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    sentDate: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['email', 'sms', 'whatsapp', 'system'] }
  }]
}, {
  timestamps: true,
});

// Indexes for better performance
taskOrderSchema.index({ taskOrderNumber: 1 });
taskOrderSchema.index({ vehicleId: 1 });
taskOrderSchema.index({ requestedBy: 1 });
taskOrderSchema.index({ approvalStatus: 1 });
taskOrderSchema.index({ workStatus: 1 });
taskOrderSchema.index({ createdAt: -1 });

const TaskOrder = mongoose.model('TaskOrder', taskOrderSchema);

module.exports = TaskOrder;