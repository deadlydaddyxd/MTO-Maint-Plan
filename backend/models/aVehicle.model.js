const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// A Vehicles (Armored Personnel Carriers, MRAPs)
const aVehicleSchema = new Schema({
  vehicleId: { type: String, required: true, unique: true, trim: true },
  unNumber: { type: String, trim: true },
  baNumber: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true }, // 'APC', 'MRAP', etc.
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  location: { type: String, required: true, trim: true },
  status: { 
    type: String, 
    enum: ['Operational', 'Under Maintenance', 'Out of Service', 'For Overhaul', 'Mission Ready'], 
    default: 'Operational' 
  },
  // A Vehicle specific fields
  armorClass: { type: String, trim: true }, // Class I, II, etc.
  weaponSystems: [{ 
    type: { type: String },
    caliber: { type: String },
    quantity: { type: Number }
  }],
  communicationSystems: [{ 
    type: { type: String },
    frequency: { type: String },
    status: { type: String, enum: ['Working', 'Defective', 'Under Repair'] }
  }],
  nbcProtection: { type: Boolean, default: false },
  engineType: { type: String, trim: true },
  fuelCapacity: { type: Number }, // in liters
  maxSpeed: { type: Number }, // km/h
  range: { type: Number }, // km
  crew: { type: Number }, // number of crew members
  passengers: { type: Number }, // passenger capacity
  
  // Maintenance tracking
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  totalRunningHours: { type: Number, default: 0 },
  mileage: { type: Number, default: 0 }, // in km
  
  // Administrative
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  driver: { type: Schema.Types.ObjectId, ref: 'Driver' },
  technician: { type: Schema.Types.ObjectId, ref: 'Technician' },
  remarks: { type: String },
  documents: [{
    type: { type: String }, // 'manual', 'certificate', 'inspection'
    url: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
});

const AVehicle = mongoose.model('AVehicle', aVehicleSchema);

module.exports = AVehicle;