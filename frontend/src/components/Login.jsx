import React, { useState, useEffect } from 'react';
import { authService, SessionManager } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (SessionManager.isSessionValid()) {
      const user = SessionManager.getUser();
      if (user) {
        onLoginSuccess(user);
      }
    }
  }, [onLoginSuccess]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(formData);
      if (result.success) {
        onLoginSuccess(result.user);
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🚗 MTO Maintenance Plan</h1>
          <h2>Military Transport Operations</h2>
          <p>Please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              required
              placeholder="Enter your username or email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Authorized Personnel Only</p>
          <p className="version">Version 2.0 | Session-Based Authentication</p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 400px;
          overflow: hidden;
        }

        .login-header {
          background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
          color: white;
          padding: 40px 30px 30px;
          text-align: center;
        }

        .login-header h1 {
          margin: 0 0 10px;
          font-size: 24px;
          font-weight: bold;
        }

        .login-header h2 {
          margin: 0 0 10px;
          font-size: 16px;
          opacity: 0.9;
        }

        .login-header p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }

        .login-form {
          padding: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .form-group input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
        }

        .login-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .login-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff40;
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 20px;
          color: #c0392b;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .login-footer {
          background: #f8f9fa;
          padding: 20px 30px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }

        .login-footer p {
          margin: 0;
          font-size: 12px;
          color: #6c757d;
        }

        .version {
          margin-top: 5px !important;
          font-weight: 600;
          color: #3498db !important;
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 10px;
          }

          .login-header {
            padding: 30px 20px 20px;
          }

          .login-form {
            padding: 20px;
          }

          .login-footer {
            padding: 15px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;