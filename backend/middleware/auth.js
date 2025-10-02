const SessionManager = require('./sessionManager');

// Session-based authentication middleware
const authenticateSession = async (req, res, next) => {
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

    // Attach user data to request
    req.user = sessionData.user;
    req.sessionId = sessionId;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Permission-based authorization middleware
const authorizePermission = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const permissions = req.user.permissions || {};
    const modulePermissions = permissions[module] || [];

    if (!modulePermissions.includes(action)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${action} on ${module}`
      });
    }

    next();
  };
};

// Extract device info from request
const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Simple device detection
  let deviceType = 'unknown';
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet/i.test(userAgent)) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }

  // Simple browser detection
  let browser = 'unknown';
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  }

  return {
    userAgent,
    ip,
    deviceType,
    browser
  };
};

module.exports = {
  authenticateSession,
  authorizeRole,
  authorizePermission,
  getDeviceInfo
};