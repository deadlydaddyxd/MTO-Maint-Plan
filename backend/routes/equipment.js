const express = require('express');
const { authenticateSession } = require('../middleware/auth');
// Import vehicle data instead of Equipment model since we're using static data
const { vehicleData } = require('../data/vehicleData');

const router = express.Router();

// Get all vehicles/equipment
router.get('/', authenticateSession, async (req, res) => {
  try {
    // Return static vehicle data from vehicleData.js
    const allVehicles = [
      ...vehicleData.aVehicles.map(v => ({ ...v, type: 'A Vehicle' })),
      ...vehicleData.bVehicles.map(v => ({ ...v, type: 'B Vehicle' })),
      ...vehicleData.plantEquipment.map(v => ({ ...v, type: 'C Vehicle - Plant' })),
      ...vehicleData.generatorSets.map(v => ({ ...v, type: 'C Vehicle - Generator' }))
    ];
    
    res.json({
      success: true,
      equipment: allVehicles,
      totalCount: allVehicles.length
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get equipment',
      error: error.message
    });
  }
});

// Get vehicle by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const allVehicles = [
      ...vehicleData.aVehicles,
      ...vehicleData.bVehicles,
      ...vehicleData.plantEquipment,
      ...vehicleData.generatorSets
    ];
    
    const vehicle = allVehicles.find(v => v.id === req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }
    
    res.json({
      success: true,
      vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vehicle',
      error: error.message
    });
  }
});

module.exports = router;
