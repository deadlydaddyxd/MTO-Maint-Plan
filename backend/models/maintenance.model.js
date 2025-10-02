const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const maintenanceSchema = new Schema({
  equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
  date: { type: Date, required: true },
  type: { type: String, required: true },
}, {
  timestamps: true,
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
