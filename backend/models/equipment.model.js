const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['B Vehicle', 'C Vehicle', 'Plant', 'Generator Set'] },
  maintenanceSchedule: { type: String, required: true, enum: ['weekly', 'fortnightly', 'monthly', 'quarterly'] },
}, {
  timestamps: true,
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;
