const express = require('express');
const Driver = require('../models/driver.model');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

// Get all drivers
router.get('/', authenticateSession, async (req, res) => {
  try {
    const drivers = await Driver.find({}).select('personalInfo serviceInfo status');
    res.json({
      success: true,
      drivers
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get drivers',
      error: error.message
    });
  }
});

// Get driver by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      driver
    });
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get driver',
      error: error.message
    });
  }
});

module.exports = router;
