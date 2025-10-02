const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const driverSchema = new Schema({
  // Personal Information
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true }
  },
  
  // Service Information
  serviceInfo: {
    serviceNumber: { type: String, required: true, unique: true },
    rank: { type: String, required: true },
    unit: { type: String, required: true }
  },
  
  // Status
  status: {
    currentStatus: { 
      type: String, 
      enum: ['Active', 'On Leave', 'Training', 'Transferred'], 
      default: 'Active' 
    }
  }
}, {
  timestamps: true,
});

// Virtual for full name
driverSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
