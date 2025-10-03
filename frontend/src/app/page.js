'use client';

import React, { useState, useEffect } from 'react';
import { SessionManager, authService } from '../services/api';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import TaskOrderForm from '../components/TaskOrderForm';
import EquipmentManager from '../components/EquipmentManager';
import DriverManager from '../components/DriverManager';
import MaintenanceScheduler from '../components/MaintenanceScheduler';

export default function Home() {
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} onViewChange={setCurrentView} />;
      case 'equipment':
        return <EquipmentManager user={user} />;
      case 'drivers':
        return <DriverManager user={user} />;
      case 'maintenance':
        return <MaintenanceScheduler user={user} />;
      case 'create-task':
        return (
          <TaskOrderForm 
            onTaskCreated={handleTaskCreated}
            onCancel={() => setCurrentView('dashboard')}
          />
        );
      default:
        return <Dashboard user={user} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚗 MTO Maintenance Plan</h1>
        <nav className="nav-tabs">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            📊 Dashboard
          </button>
          
          <button 
            className={currentView === 'equipment' ? 'active' : ''}
            onClick={() => setCurrentView('equipment')}
          >
            🚗 Equipment
          </button>
          
          <button 
            className={currentView === 'drivers' ? 'active' : ''}
            onClick={() => setCurrentView('drivers')}
          >
            👥 Drivers
          </button>
          
          <button 
            className={currentView === 'maintenance' ? 'active' : ''}
            onClick={() => setCurrentView('maintenance')}
          >
            🔧 Maintenance
          </button>
          
          {(user.role === 'Transport JCO' || user.role === 'Transport Officer' || user.role === 'Commanding Officer') && (
            <button 
              className={currentView === 'create-task' ? 'active' : ''}
              onClick={() => setCurrentView('create-task')}
            >
              ➕ New Task Order
            </button>
          )}

          <div className="user-info">
            <span>{user.firstName} {user.lastName} ({user.role})</span>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="app-main">
        {renderCurrentView()}
      </main>
    </div>
  );
}