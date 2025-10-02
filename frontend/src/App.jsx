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
          
          <button 
            className={`nav-btn ${currentView === 'equipment' ? 'active' : ''}`}
            onClick={() => setCurrentView('equipment')}
          >
            🚗 Equipment
          </button>
          
          <button 
            className={`nav-btn ${currentView === 'drivers' ? 'active' : ''}`}
            onClick={() => setCurrentView('drivers')}
          >
            👥 Drivers
          </button>
          
          <button 
            className={`nav-btn ${currentView === 'maintenance' ? 'active' : ''}`}
            onClick={() => setCurrentView('maintenance')}
          >
            🔧 Maintenance
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


    </div>
  );
}

export default App;
