const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['A Vehicle', 'B Vehicle', 'Plant', 'Generator Set'] 
  },
  vehicleId: { type: String, required: true, unique: true, trim: true },
  unNumber: { type: String, required: true, unique: true, trim: true }, // UN Number from CSV
  vehicleType: { type: String, required: true, trim: true }, // Vehicle Type from CSV
  location: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  kva: { type: Number }, // For generator sets
  remarks: { type: String, trim: true },
  status: { 
    type: String, 
    enum: ['Operational', 'Under Maintenance', 'Out of Service', 'For Overhaul'], 
    default: 'Operational' 
  },
  lastMaintenanceDate: { type: Date },
  lastMaintenanceDoneDate: { type: Date }, // Last Maintenance Done Date
  lastOilChangeDate: { type: Date }, // Last Oil Change Date
  lastMajorFaultDate: { type: Date }, // Last Major Fault Date
  lastMajorFaultType: { type: String, trim: true }, // Last Major Fault Type
  totalRunningHours: { type: Number, default: 0 },
  fuelCapacity: { type: Number }, // For vehicles with fuel systems
  manufacturer: { type: String, trim: true },
  maintenanceSchedule: { type: String, enum: ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly'], default: 'Monthly' }
}, {
  timestamps: true,
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
