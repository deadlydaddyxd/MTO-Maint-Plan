const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// C Vehicles (Plant Equipment, Generators, Construction Equipment)
const cVehicleSchema = new Schema({
  vehicleId: { type: String, required: true, unique: true, trim: true },
  unNumber: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Plant Equipment', 'Generator Set', 'Construction Equipment', 'Support Equipment'] 
  },
  type: { type: String, required: true, trim: true }, // 'Crane', 'Excavator', 'Generator', etc.
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['Operational', 'Under Maintenance', 'Out of Service', 'For Overhaul', 'Standby'], 
    default: 'Operational' 
  },
  
  // Generator specific fields
  kvaRating: { type: Number }, // for generators
  voltageOutput: { type: String }, // '220V', '440V', etc.
  frequency: { type: Number, default: 50 }, // Hz
  fuelType: { type: String, enum: ['Diesel', 'Gas', 'Hybrid'] },
  fuelConsumption: { type: Number }, // liters per hour at full load
  
  // Construction equipment specific
  operatingWeight: { type: Number }, // in kg/tons
  maxReach: { type: Number }, // for cranes, excavators (in meters)
  liftingCapacity: { type: Number }, // for cranes, lifters (in tons)
  bucketCapacity: { type: Number }, // for excavators, loaders (in cubic meters)
  
  // Engine and mechanical
  engineType: { type: String, trim: true },
  enginePower: { type: Number }, // in HP or kW
  hydraulicSystem: {
    type: { type: String },
    pressure: { type: Number }, // in PSI or Bar
    fluidCapacity: { type: Number } // in liters
  },
  
  // Operational parameters
  maxOperatingHours: { type: Number }, // hours per day
  currentRunningHours: { type: Number, default: 0 },
  totalRunningHours: { type: Number, default: 0 },
  
  // Maintenance tracking
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  maintenanceInterval: { type: Number, default: 250 }, // hours
  lastServiceHours: { type: Number },
  
  // Performance tracking
  averageUtilization: { type: Number }, // percentage
  downtimeHours: { type: Number, default: 0 },
  
  // Specialized attachments/accessories
  attachments: [{
    name: { type: String },
    type: { type: String },
    serialNumber: { type: String },
    status: { type: String, enum: ['Working', 'Defective', 'Under Repair'] },
    lastInspectionDate: { type: Date }
  }],
  
  // Safety and compliance
  safetyInspectionDate: { type: Date },
  nextSafetyInspection: { type: Date },
  certifications: [{
    type: { type: String }, // 'Operating Certificate', 'Safety Certificate'
    number: { type: String },
    issuedDate: { type: Date },
    expiryDate: { type: Date },
    issuedBy: { type: String }
  }],
  
  // Administrative
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  operator: { type: Schema.Types.ObjectId, ref: 'Driver' }, // Equipment operator
  technician: { type: Schema.Types.ObjectId, ref: 'Technician' },
  remarks: { type: String },
  
  // Documentation and manuals
  documents: [{
    type: { type: String }, // 'manual', 'certificate', 'inspection', 'warranty'
    url: { type: String },
    description: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Location and deployment
  deploymentHistory: [{
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    purpose: { type: String }
  }]
}, {
  timestamps: true,
});

const CVehicle = mongoose.model('CVehicle', cVehicleSchema);

module.exports = CVehicle;