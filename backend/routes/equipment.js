const router = require('express').Router();
let Equipment = require('../models/equipment.model');

router.route('/').get((req, res) => {
  Equipment.find()
    .then(equipment => res.json(equipment))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const { name, type, maintenanceSchedule } = req.body;
  const newEquipment = new Equipment({
    name,
    type,
    maintenanceSchedule,
  });

  newEquipment.save()
    .then(() => res.json('Equipment added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
