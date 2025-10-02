const express = require('express');
const Technician = require('../models/technician.model');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

// Get all technicians
router.get('/', authenticateSession, async (req, res) => {
  try {
    const technicians = await Technician.find({}).sort({ createdAt: -1 });
    res.json(technicians);
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({ message: 'Failed to get technicians', error: error.message });
  }
});

// Get technician by ID
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    
    res.json(technician);
  } catch (error) {
    console.error('Get technician error:', error);
    res.status(500).json({ message: 'Failed to get technician', error: error.message });
  }
});

// Create new technician
router.post('/', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to create technicians
    if (!['CO', 'Maintenance Officer', 'Maintenance JCO'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if service number already exists
    const existingTechnician = await Technician.findOne({ 
      'serviceInfo.serviceNumber': req.body.serviceInfo.serviceNumber 
    });
    
    if (existingTechnician) {
      return res.status(400).json({ message: 'Technician with this service number already exists' });
    }

    const technician = new Technician(req.body);
    const savedTechnician = await technician.save();
    
    res.status(201).json(savedTechnician);
  } catch (error) {
    console.error('Error creating technician:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error creating technician', error: error.message });
  }
});

// Update technician
router.put('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to update technicians
    if (!['CO', 'Maintenance Officer', 'Maintenance JCO'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if service number is being changed and if it conflicts
    if (req.body.serviceInfo?.serviceNumber) {
      const existingTechnician = await Technician.findOne({ 
        'serviceInfo.serviceNumber': req.body.serviceInfo.serviceNumber,
        _id: { $ne: req.params.id }
      });
      
      if (existingTechnician) {
        return res.status(400).json({ message: 'Another technician with this service number already exists' });
      }
    }

    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    
    res.json(technician);
  } catch (error) {
    console.error('Error updating technician:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }
    res.status(500).json({ message: 'Error updating technician', error: error.message });
  }
});

// Delete technician
router.delete('/:id', authenticateSession, async (req, res) => {
  try {
    // Check if user has permission to delete technicians
    if (!['CO', 'Maintenance Officer'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const technician = await Technician.findByIdAndDelete(req.params.id);
    
    if (!technician) {
      return res.status(404).json({ message: 'Technician not found' });
    }
    
    res.json({ message: 'Technician deleted successfully' });
  } catch (error) {
    console.error('Error deleting technician:', error);
    res.status(500).json({ message: 'Error deleting technician', error: error.message });
  }
});

// Get available technicians
router.get('/available/list', authenticateSession, async (req, res) => {
  try {
    const availableTechnicians = await Technician.find({ 
      'status.currentStatus': 'Available' 
    }).sort({ 'personalInfo.firstName': 1 });
    
    res.json(availableTechnicians);
  } catch (error) {
    console.error('Error fetching available technicians:', error);
    res.status(500).json({ message: 'Error fetching available technicians', error: error.message });
  }
});

// Get technicians by specialization
router.get('/specialization/:vehicleType', authenticateSession, async (req, res) => {
  try {
    const technicians = await Technician.find({ 
      'specializations.vehicleTypes': { $in: [req.params.vehicleType, 'All Types'] },
      'status.currentStatus': 'Available'
    }).sort({ 'personalInfo.firstName': 1 });
    
    res.json(technicians);
  } catch (error) {
    console.error('Error fetching specialized technicians:', error);
    res.status(500).json({ message: 'Error fetching specialized technicians', error: error.message });
  }
});

module.exports = router;