const router = require('express').Router();
let Maintenance = require('../models/maintenance.model');

router.route('/').get((req, res) => {
  Maintenance.find()
    .then(maintenance => res.json(maintenance))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { equipmentId, driverId, date, type } = req.body;
  const newMaintenance = new Maintenance({
    equipmentId,
    driverId,
    date,
    type,
  });

  newMaintenance.save()
    .then(() => res.json('Maintenance record added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
