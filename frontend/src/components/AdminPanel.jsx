import React, { useState, useEffect } from 'react';
import { vehicleService, driverService, maintenanceService, taskOrderService, authService } from '../services/api';

const AdminPanel = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  // Data states
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [taskOrders, setTaskOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formType, setFormType] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardStats();
    } else {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, driversRes, maintenanceRes, taskOrdersRes] = await Promise.all([
        vehicleService.getAll(),
        driverService.getAll(),
        maintenanceService.getAll(),
        taskOrderService.getAll()
      ]);

      setStats({
        vehicles: vehiclesRes.success ? (vehiclesRes.equipment || vehiclesRes.vehicles || []).length : 0,
        drivers: driversRes.success ? (driversRes.drivers || []).length : 0,
        maintenance: maintenanceRes.success ? (maintenanceRes.maintenance || []).length : 0,
        taskOrders: taskOrdersRes.success ? (taskOrdersRes.taskOrders || []).length : 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTabData = async (tab) => {
    try {
      setLoading(true);
      switch (tab) {
        case 'vehicles':
          const vehiclesRes = await vehicleService.getAll();
          if (vehiclesRes.success) {
            setVehicles(vehiclesRes.equipment || vehiclesRes.vehicles || []);
          }
          break;
        case 'drivers':
          const driversRes = await driverService.getAll();
          if (driversRes.success) {
            setDrivers(driversRes.drivers || []);
          }
          break;
        case 'maintenance':
          const maintenanceRes = await maintenanceService.getAll();
          if (maintenanceRes.success) {
            setMaintenance(maintenanceRes.maintenance || []);
          }
          break;
        case 'tasks':
          const taskOrdersRes = await taskOrderService.getAll();
          if (taskOrdersRes.success) {
            setTaskOrders(taskOrdersRes.taskOrders || []);
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to load ${tab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      switch (type) {
        case 'vehicle':
          await vehicleService.delete(id);
          setVehicles(prev => prev.filter(item => item._id !== id));
          break;
        case 'driver':
          await driverService.delete(id);
          setDrivers(prev => prev.filter(item => item._id !== id));
          break;
        case 'maintenance':
          await maintenanceService.delete(id);
          setMaintenance(prev => prev.filter(item => item._id !== id));
          break;
      }
      alert(`${type} deleted successfully!`);
    } catch (error) {
      alert(`Failed to delete ${type}: ${error.message}`);
    }
  };

  const handleAddNew = (type) => {
    setFormType(type);
    setEditingItem(null);
    setShowAddForm(true);
  };

  const handleEdit = (item, type) => {
    setFormType(type);
    setEditingItem(item);
    setShowAddForm(true);
  };

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <h2>System Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Vehicles</h3>
          <div className="stat-number">{stats.vehicles || 0}</div>
          <button onClick={() => setActiveTab('vehicles')}>Manage</button>
        </div>
        <div className="stat-card">
          <h3>Drivers</h3>
          <div className="stat-number">{stats.drivers || 0}</div>
          <button onClick={() => setActiveTab('drivers')}>Manage</button>
        </div>
        <div className="stat-card">
          <h3>Maintenance Tasks</h3>
          <div className="stat-number">{stats.maintenance || 0}</div>
          <button onClick={() => setActiveTab('maintenance')}>Manage</button>
        </div>
        <div className="stat-card">
          <h3>Task Orders</h3>
          <div className="stat-number">{stats.taskOrders || 0}</div>
          <button onClick={() => setActiveTab('tasks')}>Manage</button>
        </div>
      </div>
    </div>
  );

  const renderDataTable = (data, type) => {
    const getDisplayFields = () => {
      switch (type) {
        case 'vehicles':
          return ['vehicleId', 'name', 'category', 'location', 'status'];
        case 'drivers':
          return ['personalInfo.firstName', 'personalInfo.lastName', 'serviceInfo.serviceNumber', 'status.currentStatus'];
        case 'maintenance':
          return ['task', 'frequency', 'priority', 'dueDate', 'isCompleted'];
        case 'tasks':
          return ['title', 'priority', 'status', 'createdAt'];
        default:
          return [];
      }
    };

    const fields = getDisplayFields();

    return (
      <div className="data-management">
        <div className="section-header">
          <h2>Manage {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <button onClick={() => handleAddNew(type)} className="add-btn">
            Add New {type.slice(0, -1)}
          </button>
        </div>
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  {fields.map(field => (
                    <th key={field}>{field.split('.').pop()}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item._id}>
                    {fields.map(field => (
                      <td key={field}>
                        {field.includes('.') 
                          ? field.split('.').reduce((obj, key) => obj?.[key], item)
                          : item[field]
                        }
                      </td>
                    ))}
                    <td className="actions">
                      <button onClick={() => handleEdit(item, type.slice(0, -1))}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(item._id, type.slice(0, -1))}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderAddForm = () => {
    if (!showAddForm) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{editingItem ? 'Edit' : 'Add New'} {formType}</h3>
            <button onClick={() => setShowAddForm(false)}>×</button>
          </div>
          <div className="modal-body">
            <QuickAddForm 
              type={formType} 
              item={editingItem}
              onSave={(savedItem) => {
                // Refresh the data
                loadTabData(activeTab);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="admin-tabs">
        {['dashboard', 'vehicles', 'drivers', 'maintenance', 'tasks'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'vehicles' && renderDataTable(vehicles, 'vehicles')}
        {activeTab === 'drivers' && renderDataTable(drivers, 'drivers')}
        {activeTab === 'maintenance' && renderDataTable(maintenance, 'maintenance')}
        {activeTab === 'tasks' && renderDataTable(taskOrders, 'tasks')}
      </div>

      {renderAddForm()}
    </div>
  );
};

// Quick Add Form Component
const QuickAddForm = ({ type, item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      // Set default values based on type
      const defaults = getDefaultValues(type);
      setFormData(defaults);
    }
  }, [item, type]);

  const getDefaultValues = (type) => {
    switch (type) {
      case 'vehicle':
        return {
          vehicleId: '',
          name: '',
          category: 'B Vehicle',
          location: '',
          year: new Date().getFullYear(),
          status: 'Operational'
        };
      case 'driver':
        return {
          personalInfo: {
            firstName: '',
            lastName: '',
            contactNumber: '',
            email: ''
          },
          serviceInfo: {
            serviceNumber: '',
            rank: '',
            unit: ''
          },
          status: {
            currentStatus: 'Active'
          }
        };
      case 'maintenance':
        return {
          task: '',
          frequency: 'Monthly',
          priority: 'Medium',
          dueDate: new Date().toISOString().split('T')[0]
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (item) {
        // Update existing
        switch (type) {
          case 'vehicle':
            response = await vehicleService.update(item._id, formData);
            break;
          case 'driver':
            response = await driverService.update(item._id, formData);
            break;
          case 'maintenance':
            response = await maintenanceService.update(item._id, formData);
            break;
        }
      } else {
        // Create new
        switch (type) {
          case 'vehicle':
            response = await vehicleService.create(formData);
            break;
          case 'driver':
            response = await driverService.create(formData);
            break;
          case 'maintenance':
            response = await maintenanceService.create(formData);
            break;
        }
      }

      if (response.success) {
        onSave(response.data);
        alert(`${type} ${item ? 'updated' : 'created'} successfully!`);
      }
    } catch (error) {
      alert(`Failed to ${item ? 'update' : 'create'} ${type}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'vehicle':
        return (
          <>
            <input name="vehicleId" placeholder="Vehicle ID" value={formData.vehicleId || ''} onChange={handleInputChange} required />
            <input name="name" placeholder="Vehicle Name" value={formData.name || ''} onChange={handleInputChange} required />
            <select name="category" value={formData.category || ''} onChange={handleInputChange}>
              <option value="A Vehicle">A Vehicle</option>
              <option value="B Vehicle">B Vehicle</option>
              <option value="Plant">Plant</option>
              <option value="Generator Set">Generator Set</option>
            </select>
            <input name="location" placeholder="Location" value={formData.location || ''} onChange={handleInputChange} />
            <input type="number" name="year" placeholder="Year" value={formData.year || ''} onChange={handleInputChange} />
            <select name="status" value={formData.status || ''} onChange={handleInputChange}>
              <option value="Operational">Operational</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </>
        );
      case 'driver':
        return (
          <>
            <input name="personalInfo.firstName" placeholder="First Name" value={formData.personalInfo?.firstName || ''} onChange={handleInputChange} required />
            <input name="personalInfo.lastName" placeholder="Last Name" value={formData.personalInfo?.lastName || ''} onChange={handleInputChange} required />
            <input name="personalInfo.contactNumber" placeholder="Contact Number" value={formData.personalInfo?.contactNumber || ''} onChange={handleInputChange} />
            <input name="personalInfo.email" placeholder="Email" value={formData.personalInfo?.email || ''} onChange={handleInputChange} />
            <input name="serviceInfo.serviceNumber" placeholder="Service Number" value={formData.serviceInfo?.serviceNumber || ''} onChange={handleInputChange} />
            <input name="serviceInfo.rank" placeholder="Rank" value={formData.serviceInfo?.rank || ''} onChange={handleInputChange} />
            <input name="serviceInfo.unit" placeholder="Unit" value={formData.serviceInfo?.unit || ''} onChange={handleInputChange} />
          </>
        );
      case 'maintenance':
        return (
          <>
            <input name="task" placeholder="Maintenance Task" value={formData.task || ''} onChange={handleInputChange} required />
            <select name="frequency" value={formData.frequency || ''} onChange={handleInputChange}>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
            <select name="priority" value={formData.priority || ''} onChange={handleInputChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
            <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleInputChange} />
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="quick-form">
      {renderFields()}
      <div className="form-actions">
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default AdminPanel;