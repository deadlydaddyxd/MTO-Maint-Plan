const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const SessionManager = require('../middleware/sessionManager');
const { authenticateSession, getDeviceInfo } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('rank').trim().notEmpty().withMessage('Rank is required'),
  body('serviceNumber').trim().notEmpty().withMessage('Service number is required'),
  body('role').isIn([
    'Commanding Officer',
    'Transport Officer', 
    'Maintenance Officer',
    'Transport JCO',
    'Maintenance JCO'
  ]).withMessage('Valid role is required'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('location').trim().notEmpty().withMessage('Location is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      username,
      email,
      password,
      firstName,
      lastName,
      rank,
      serviceNumber,
      role,
      unit,
      location,
      phoneNumber
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
        { serviceNumber }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email, username, or service number already exists'
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password, // Will be hashed by the pre-save middleware
      firstName,
      lastName,
      rank,
      serviceNumber,
      role,
      unit,
      location,
      phoneNumber,
      isActive: true
    });

    await newUser.save();

    // Create session
    const deviceInfo = getDeviceInfo(req);
    const sessionData = await SessionManager.createSession(newUser._id, deviceInfo);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      sessionId: sessionData.sessionId,
      user: sessionData.user,
      expiresAt: sessionData.expiresAt
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Login user
router.post('/login', [
  body('identifier').trim().notEmpty().withMessage('Username/Email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create session
    const deviceInfo = getDeviceInfo(req);
    const sessionData = await SessionManager.createSession(user._id, deviceInfo);

    res.json({
      success: true,
      message: 'Login successful',
      sessionId: sessionData.sessionId,
      user: sessionData.user,
      expiresAt: sessionData.expiresAt
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Logout user
router.post('/logout', authenticateSession, async (req, res) => {
  try {
    const sessionId = req.sessionId;
    
    await SessionManager.invalidateSession(sessionId);

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

// Logout from all devices
router.post('/logout-all', authenticateSession, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await SessionManager.invalidateAllSessions(userId);

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout from all devices failed',
      error: error.message
    });
  }
});

// Validate current session
router.get('/validate', async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'No session ID provided'
      });
    }

    const sessionData = await SessionManager.validateSession(sessionId);
    
    if (!sessionData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session'
      });
    }

    res.json({
      success: true,
      message: 'Session valid',
      user: sessionData.user
    });

  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Session validation failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -sessions');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Get active sessions
router.get('/sessions', authenticateSession, async (req, res) => {
  try {
    const sessions = await SessionManager.getUserSessions(req.user.id);

    res.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user sessions',
      error: error.message
    });
  }
});

module.exports = router;