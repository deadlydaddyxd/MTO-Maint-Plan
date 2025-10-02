const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// B Vehicles (Trucks, Jeeps, Utility Vehicles)
const bVehicleSchema = new Schema({
  vehicleId: { type: String, required: true, unique: true, trim: true },
  unNumber: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true }, // 'Truck', 'Jeep', 'Ambulance', etc.
  subType: { type: String, trim: true }, // 'Water Bowzer', 'Fuel Bowzer', 'Dump', etc.
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['Operational', 'Under Maintenance', 'Out of Service', 'For Overhaul', 'Mission Ready'], 
    default: 'Operational' 
  },
  
  // B Vehicle specific fields
  engineType: { type: String, trim: true },
  transmission: { type: String, enum: ['Manual', 'Automatic'], default: 'Manual' },
  driveType: { type: String, enum: ['2WD', '4WD', '6WD'], default: '2WD' },
  fuelType: { type: String, enum: ['Diesel', 'Petrol', 'Hybrid'], default: 'Diesel' },
  fuelCapacity: { type: Number }, // in liters
  payloadCapacity: { type: Number }, // in kg/tons
  
  // Specialized equipment (for bowzers, ambulances, etc.)
  specializedEquipment: [{
    type: { type: String }, // 'Water Tank', 'Fuel Tank', 'Medical Equipment'
    capacity: { type: Number },
    unit: { type: String }, // 'liters', 'kg', etc.
    status: { type: String, enum: ['Working', 'Defective', 'Under Repair'] }
  }],
  
  // Trailer information (if applicable)
  canTowTrailer: { type: Boolean, default: false },
  maxTowingCapacity: { type: Number }, // in kg
  
  // Maintenance tracking
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  totalRunningHours: { type: Number, default: 0 },
  mileage: { type: Number, default: 0 }, // in km
  lastServiceMileage: { type: Number },
  
  // Performance metrics
  averageFuelConsumption: { type: Number }, // km per liter
  maxSpeed: { type: Number }, // km/h
  
  // Administrative
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  technician: { type: Schema.Types.ObjectId, ref: 'Technician' },
  remarks: { type: String },
  
  // Documentation
  documents: [{
    type: { type: String }, // 'manual', 'registration', 'insurance'
    url: { type: String },
    expiryDate: { type: Date },
    uploadDate: { type: Date, default: Date.now }
  }],
  
  // Inspection records
  lastInspectionDate: { type: Date },
  nextInspectionDate: { type: Date },
  inspectionStatus: { 
    type: String, 
    enum: ['Due', 'Overdue', 'Completed', 'Not Required'], 
    default: 'Not Required' 
  }
}, {
  timestamps: true,
});

const BVehicle = mongoose.model('BVehicle', bVehicleSchema);

module.exports = BVehicle;