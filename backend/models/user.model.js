const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  rank: { type: String, required: true, trim: true },
  serviceNumber: { type: String, required: true, unique: true, trim: true },
  role: { 
    type: String, 
    required: true,
    enum: [
      'Commanding Officer',
      'Transport Officer', 
      'Maintenance Officer',
      'Transport JCO',
      'Maintenance JCO'
    ]
  },
  unit: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  phoneNumber: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  permissions: [{
    module: { type: String, required: true }, // 'vehicles', 'maintenance', 'reports', etc.
    actions: [{ type: String }] // 'read', 'write', 'approve', 'delete'
  }],
  profilePicture: { type: String }, // URL to profile image
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Session Management
  sessions: [{
    sessionId: { type: String, required: true },
    deviceInfo: {
      userAgent: { type: String },
      ip: { type: String },
      deviceType: { type: String },
      browser: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) } // 24 hours
  }]
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get user permissions
userSchema.methods.getPermissions = function() {
  const rolePermissions = {
    'Commanding Officer': {
      vehicles: ['read', 'write', 'approve', 'delete'],
      maintenance: ['read', 'write', 'approve', 'delete'],
      reports: ['read', 'write', 'approve', 'delete'],
      users: ['read', 'write', 'approve', 'delete'],
      taskOrders: ['read', 'write', 'approve', 'delete']
    },
    'Transport Officer': {
      vehicles: ['read', 'write', 'approve'],
      maintenance: ['read'],
      reports: ['read', 'write'],
      taskOrders: ['read', 'approve']
    },
    'Maintenance Officer': {
      vehicles: ['read'],
      maintenance: ['read', 'write', 'approve'],
      reports: ['read', 'write', 'approve'],
      taskOrders: ['read']
    },
    'Transport JCO': {
      vehicles: ['read'],
      maintenance: ['read'],
      reports: ['read'],
      taskOrders: ['read', 'write']
    },
    'Maintenance JCO': {
      vehicles: ['read'],
      maintenance: ['read', 'write'],
      reports: ['read', 'write'],
      taskOrders: ['read']
    }
  };
  
  return rolePermissions[this.role] || {};
};

const User = mongoose.model('User', userSchema);

module.exports = User;