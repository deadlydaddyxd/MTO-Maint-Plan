const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const maintenanceSchema = new Schema({
  equipment: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
  
  // Assignment Information
  assignedDriver: { 
    type: Schema.Types.ObjectId, 
    ref: 'Driver',
    required: true // Driver nominated for task
  },
  assignedLADRep: { 
    type: Schema.Types.ObjectId, 
    ref: 'Technician',
    required: true // LAD rep nominated for task
  },
  
  // Task Details
  task: { type: String, required: true },
  frequency: { type: String, required: true, enum: ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly'] },
  priority: { type: String, required: true, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  dueDate: { type: Date, required: true },
  completedDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  lastMaintenanceDate: { type: Date },
  estimatedDuration: { type: Number }, // in hours
  actualDuration: { type: Number }, // in hours
  cost: { type: Number }, // maintenance cost
  notes: { type: String },
  
  // Parts and Resources
  partsUsed: [{ 
    partName: String, 
    partNumber: String, 
    quantity: Number, 
    cost: Number 
  }],
  technicianNotes: { type: String },
  nextScheduledDate: { type: Date },
  maintenanceType: { 
    type: String, 
    enum: ['Preventive', 'Corrective', 'Emergency', 'Overhaul'], 
    default: 'Preventive' 
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Overdue'],
    default: 'Scheduled'
  },
  
  // Created by
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvalDate: { type: Date }
}, {
  timestamps: true,
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
