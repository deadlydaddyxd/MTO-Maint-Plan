const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const technicianSchema = new Schema({
  // Basic Information
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    photo: { type: String },
    contactNumber: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: 'Pakistan' }
    }
  },
  
  // Service Information
  serviceInfo: {
    serviceNumber: { type: String, required: true, unique: true },
    rank: { type: String, required: true },
    unit: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    currentPosting: { type: String },
    previousPostings: [{
      unit: { type: String },
      location: { type: String },
      fromDate: { type: Date },
      toDate: { type: Date }
    }]
  },
  
  // Technical Qualifications
  qualifications: {
    militaryTraining: [{
      course: { type: String },
      institution: { type: String },
      completionDate: { type: Date },
      grade: { type: String },
      certificateNumber: { type: String }
    }],
    civilianQualifications: [{
      degree: { type: String },
      institution: { type: String },
      year: { type: Number },
      specialization: { type: String }
    }],
    technicalCertifications: [{
      certification: { type: String },
      issuingAuthority: { type: String },
      issueDate: { type: Date },
      expiryDate: { type: Date },
      certificateNumber: { type: String }
    }]
  },
  
  // Specializations
  specializations: {
    vehicleTypes: [{
      type: String,
      enum: ['A Vehicle', 'B Vehicle', 'C Vehicle', 'All Types']
    }],
    systemExpertise: [{
      type: String,
      enum: [
        'Engine Systems',
        'Transmission Systems',
        'Electrical Systems',
        'Hydraulic Systems',
        'Brake Systems',
        'Fuel Systems',
        'Cooling Systems',
        'Suspension Systems',
        'Communication Systems',
        'Weapon Systems',
        'Generator Systems',
        'Air Conditioning',
        'Power Take-Off',
        'Diagnostic Systems'
      ]
    }],
    maintenanceLevels: [{
      type: String,
      enum: ['First Line', 'Second Line', 'Third Line', 'Fourth Line']
    }]
  },
  
  // Performance Tracking
  performance: {
    totalTasksCompleted: { type: Number, default: 0 },
    tasksThisMonth: { type: Number, default: 0 },
    averageCompletionTime: { type: Number }, // in hours
    qualityRating: { type: Number, min: 1, max: 5, default: 3 },
    onTimeCompletionRate: { type: Number, default: 0 }, // percentage
    customerSatisfactionScore: { type: Number, min: 1, max: 5 },
    
    monthlyStats: [{
      month: { type: Number, min: 1, max: 12 },
      year: { type: Number },
      tasksCompleted: { type: Number, default: 0 },
      averageTime: { type: Number },
      qualityScore: { type: Number }
    }]
  },
  
  // Current Status
  status: {
    currentStatus: { 
      type: String, 
      enum: ['Available', 'On Task', 'On Leave', 'Training', 'Sick', 'Transferred'], 
      default: 'Available' 
    },
    currentTask: { type: Schema.Types.ObjectId, ref: 'TaskOrder' },
    availableFrom: { type: Date },
    shiftPattern: { 
      type: String, 
      enum: ['Day Shift', 'Night Shift', '24/7 Available', 'Flexible'],
      default: 'Day Shift'
    },
    workLocation: { type: String }
  },
  
  // Equipment and Tools
  equipment: {
    assignedTools: [{
      toolName: { type: String },
      toolSerialNumber: { type: String },
      assignedDate: { type: Date },
      condition: { type: String, enum: ['Good', 'Fair', 'Needs Repair'] }
    }],
    authorizedEquipment: [{ type: String }],
    vehiclesAuthorized: [{
      vehicleType: { type: String },
      authorizationLevel: { type: String, enum: ['Operate', 'Maintain', 'Repair'] }
    }]
  },
  
  // Training and Development
  training: {
    lastTrainingDate: { type: Date },
    upcomingTraining: [{
      course: { type: String },
      scheduledDate: { type: Date },
      duration: { type: String },
      venue: { type: String }
    }],
    trainingNeeds: [{ type: String }],
    annualTrainingCompleted: { type: Boolean, default: false },
    safetyTrainingCurrent: { type: Boolean, default: false }
  },
  
  // Work History
  workHistory: [{
    taskOrderId: { type: Schema.Types.ObjectId, ref: 'TaskOrder' },
    vehicleId: { type: String },
    workDescription: { type: String },
    startDate: { type: Date },
    completionDate: { type: Date },
    hoursWorked: { type: Number },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String }
  }],
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phoneNumber: { type: String },
    alternatePhone: { type: String },
    address: { type: String }
  },
  
  // Administrative
  administrative: {
    securityClearance: { 
      type: String, 
      enum: ['Unclassified', 'Confidential', 'Secret', 'Top Secret'] 
    },
    medicalCategory: { type: String },
    lastMedicalCheckup: { type: Date },
    nextMedicalDue: { type: Date },
    insuranceDetails: {
      policyNumber: { type: String },
      provider: { type: String },
      expiryDate: { type: Date }
    }
  }
}, {
  timestamps: true,
});

// Virtual for full name
technicianSchema.virtual('fullName').get(function() {
  const { firstName, middleName, lastName } = this.personalInfo;
  return middleName 
    ? `${firstName} ${middleName} ${lastName}`
    : `${firstName} ${lastName}`;
});

// Indexes
technicianSchema.index({ 'serviceInfo.serviceNumber': 1 });
technicianSchema.index({ 'personalInfo.firstName': 1, 'personalInfo.lastName': 1 });
technicianSchema.index({ 'status.currentStatus': 1 });
technicianSchema.index({ 'specializations.vehicleTypes': 1 });

const Technician = mongoose.model('Technician', technicianSchema);

module.exports = Technician;