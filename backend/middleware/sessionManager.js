const crypto = require('crypto');
const User = require('../models/user.model');

class SessionManager {
  // Generate a unique session ID
  static generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create a new session for a user
  static async createSession(userId, deviceInfo = {}) {
    try {
      const sessionId = this.generateSessionId();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Clean up expired sessions
      await this.cleanupExpiredSessions(userId);

      // Add new session
      user.sessions.push({
        sessionId,
        deviceInfo,
        createdAt: new Date(),
        lastActivity: new Date(),
        isActive: true,
        expiresAt
      });

      await user.save();

      return {
        sessionId,
        expiresAt,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        }
      };
    } catch (error) {
      throw new Error(`Session creation failed: ${error.message}`);
    }
  }

  // Validate and refresh session
  static async validateSession(sessionId) {
    try {
      const user = await User.findOne({
        'sessions.sessionId': sessionId,
        'sessions.isActive': true,
        'sessions.expiresAt': { $gt: new Date() }
      });

      if (!user) {
        return null;
      }

      // Find the specific session
      const session = user.sessions.find(s => 
        s.sessionId === sessionId && s.isActive && s.expiresAt > new Date()
      );

      if (!session) {
        return null;
      }

      // Update last activity
      session.lastActivity = new Date();
      await user.save();

      return {
        sessionId,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.getPermissions()
        }
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  // Invalidate a specific session
  static async invalidateSession(sessionId) {
    try {
      const user = await User.findOne({ 'sessions.sessionId': sessionId });
      if (!user) {
        return false;
      }

      const session = user.sessions.find(s => s.sessionId === sessionId);
      if (session) {
        session.isActive = false;
        await user.save();
      }

      return true;
    } catch (error) {
      console.error('Session invalidation error:', error);
      return false;
    }
  }

  // Invalidate all sessions for a user
  static async invalidateAllSessions(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }

      user.sessions.forEach(session => {
        session.isActive = false;
      });

      await user.save();
      return true;
    } catch (error) {
      console.error('All sessions invalidation error:', error);
      return false;
    }
  }

  // Clean up expired sessions
  static async cleanupExpiredSessions(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return;
      }

      const now = new Date();
      user.sessions = user.sessions.filter(session => 
        session.expiresAt > now && session.isActive
      );

      await user.save();
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }

  // Get user's active sessions
  static async getUserSessions(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return [];
      }

      const now = new Date();
      return user.sessions.filter(session => 
        session.isActive && session.expiresAt > now
      ).map(session => ({
        sessionId: session.sessionId,
        deviceInfo: session.deviceInfo,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        expiresAt: session.expiresAt
      }));
    } catch (error) {
      console.error('Get user sessions error:', error);
      return [];
    }
  }
}

module.exports = SessionManager;