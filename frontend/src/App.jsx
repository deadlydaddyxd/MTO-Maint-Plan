import React, { useState, useEffect } from 'react';
import { SessionManager, authService } from './services/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskOrderForm from './components/TaskOrderForm';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      try {
        if (SessionManager.isSessionValid()) {
          const sessionUser = SessionManager.getUser();
          if (sessionUser) {
            // Validate session with server
            await authService.validateSession();
            setUser(sessionUser);
          }
        }
      } catch (error) {
        console.log('Session validation failed:', error);
        SessionManager.clearSession();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setCurrentView('dashboard');
    }
  };

  const handleTaskCreated = (taskOrder) => {
    setCurrentView('dashboard');
    // You can add notification here
    alert(`Task Order ${taskOrder.unId} created successfully!`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading MTO Maintenance Plan...</p>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
          }
          
          .spinner-large {
            width: 50px;
            height: 50px;
            border: 4px solid #ffffff40;
            border-top: 4px solid #ffffff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <nav className="app-nav">
        <div className="nav-brand">
          <h1>🚗 MTO Maintenance Plan</h1>
          <span className="nav-subtitle">Military Transport Operations</span>
        </div>
        
        <div className="nav-menu">
          <button 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          
          {(user.role === 'Transport JCO' || user.role === 'Transport Officer' || user.role === 'Commanding Officer') && (
            <button 
              className={`nav-btn ${currentView === 'create-task' ? 'active' : ''}`}
              onClick={() => setCurrentView('create-task')}
            >
              ➕ New Task Order
            </button>
          )}
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user.firstName} {user.lastName}</span>
            <span className="user-role">{user.role}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      <main className="app-main">
        {currentView === 'dashboard' && (
          <Dashboard user={user} />
        )}
        
        {currentView === 'create-task' && (
          <TaskOrderForm 
            onTaskCreated={handleTaskCreated}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}
      </main>

      <style jsx>{`
        .app {
          min-height: 100vh;
          background: #f5f7fa;
        }

        .app-nav {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 15px 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          flex-wrap: wrap;
          gap: 20px;
        }

        .nav-brand h1 {
          margin: 0;
          font-size: 20px;
          font-weight: bold;
        }

        .nav-subtitle {
          font-size: 12px;
          opacity: 0.8;
          display: block;
        }

        .nav-menu {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nav-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .nav-btn.active {
          background: rgba(255, 255, 255, 0.3);
          font-weight: 600;
        }

        .nav-user {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          display: block;
          font-weight: 600;
          font-size: 14px;
        }

        .user-role {
          display: block;
          font-size: 12px;
          opacity: 0.8;
        }

        .logout-btn {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .logout-btn:hover {
          background: #c0392b;
        }

        .app-main {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .app-nav {
            padding: 15px 20px;
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-menu {
            width: 100%;
            justify-content: flex-start;
          }

          .nav-user {
            width: 100%;
            justify-content: space-between;
          }

          .app-main {
            padding: 15px;
          }
        }

        @media (max-width: 480px) {
          .nav-btn {
            padding: 8px 12px;
            font-size: 13px;
          }

          .nav-brand h1 {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
