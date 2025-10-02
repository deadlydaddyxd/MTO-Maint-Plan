const express = require('express');
const Driver = require('../models/driver.model');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

// Get all drivers
router.get('/', authenticateSession, async (req, res) => {
  try {
    const drivers = await Driver.find({}).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ message: 'Failed to get drivers', error: error.message });
  }
});

// Get driver by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(driver);
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({ message: 'Failed to get driver', error: error.message });
  }
});

// Create new driver
router.post('/', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to create drivers
    if (!['CO', 'Transport Officer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if service number already exists
    const existingDriver = await Driver.findOne({ 
      'serviceInfo.serviceNumber': req.body.serviceInfo.serviceNumber 
    });
    
    if (existingDriver) {
      return res.status(400).json({ message: 'Driver with this service number already exists' });
    }

    const driver = new Driver(req.body);
    const savedDriver = await driver.save();
    
    res.status(201).json(savedDriver);
  } catch (error) {
    console.error('Error creating driver:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error creating driver', error: error.message });
  }
});

// Update driver
router.put('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to update drivers
    if (!['CO', 'Transport Officer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if service number is being changed and if it conflicts
    if (req.body.serviceInfo?.serviceNumber) {
      const existingDriver = await Driver.findOne({ 
        'serviceInfo.serviceNumber': req.body.serviceInfo.serviceNumber,
        _id: { $ne: req.params.id }
      });
      
      if (existingDriver) {
        return res.status(400).json({ message: 'Another driver with this service number already exists' });
      }
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json(driver);
  } catch (error) {
    console.error('Error updating driver:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error updating driver', error: error.message });
  }
});

// Delete driver
router.delete('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to delete drivers
    if (!['CO', 'Transport Officer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ message: 'Error deleting driver', error: error.message });
  }
});

// Get available drivers (Active status)
router.get('/available/list', authenticateSession, async (req, res) => {
  try {
    const availableDrivers = await Driver.find({ 
      'status.currentStatus': 'Active' 
    }).sort({ 'personalInfo.firstName': 1 });
    
    res.json(availableDrivers);
  } catch (error) {
    console.error('Error fetching available drivers:', error);
    res.status(500).json({ message: 'Error fetching available drivers', error: error.message });
  }
});

module.exports = router;
