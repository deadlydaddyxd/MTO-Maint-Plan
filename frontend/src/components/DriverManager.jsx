import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DriverManager = ({ user }) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/drivers');
      setDrivers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length === 2) {
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await api.put(`/drivers/${editingDriver._id}`, formData);
        setSuccess('Driver updated successfully');
      } else {
        await api.post('/drivers', formData);
        setSuccess('Driver created successfully');
      }
      
      await fetchDrivers();
      resetForm();
      setIsFormOpen(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save driver');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      personalInfo: {
        firstName: driver.personalInfo?.firstName || '',
        lastName: driver.personalInfo?.lastName || '',
        contactNumber: driver.personalInfo?.contactNumber || '',
        email: driver.personalInfo?.email || ''
      },
      serviceInfo: {
        serviceNumber: driver.serviceInfo?.serviceNumber || '',
        rank: driver.serviceInfo?.rank || '',
        unit: driver.serviceInfo?.unit || ''
      },
      status: {
        currentStatus: driver.status?.currentStatus || 'Active'
      }
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return;
    }

    try {
      await api.delete(`/drivers/${driverId}`);
      setSuccess('Driver deleted successfully');
      await fetchDrivers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete driver');
      setTimeout(() => setError(''), 3000);
    }
  };

  const resetForm = () => {
    setFormData({
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
    });
    setEditingDriver(null);
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = 
      driver.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.serviceInfo?.serviceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.serviceInfo?.rank?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || driver.status?.currentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const canManageDrivers = ['CO', 'Transport Officer'].includes(user?.role);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading drivers...</p>
      </div>
    );
  }

  return (
    <div className="manager-container">
      <div className="manager-header">
        <div className="header-content">
          <h2>🚗 Driver Management</h2>
          <p>Manage military drivers and personnel</p>
        </div>
        {canManageDrivers && (
          <button 
            className="btn btn-primary"
            onClick={() => setIsFormOpen(true)}
          >
            ➕ Add New Driver
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Search and Filter Controls */}
      <div className="search-controls">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search drivers (name, service number, rank)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Training">Training</option>
            <option value="Transferred">Transferred</option>
          </select>
        </div>
      </div>

      {/* Driver Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => setIsFormOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="driver-form">
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input
                      type="text"
                      name="personalInfo.firstName"
                      value={formData.personalInfo.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      name="personalInfo.lastName"
                      value={formData.personalInfo.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Number *</label>
                    <input
                      type="tel"
                      name="personalInfo.contactNumber"
                      value={formData.personalInfo.contactNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="personalInfo.email"
                      value={formData.personalInfo.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Service Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Service Number *</label>
                    <input
                      type="text"
                      name="serviceInfo.serviceNumber"
                      value={formData.serviceInfo.serviceNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rank *</label>
                    <select
                      name="serviceInfo.rank"
                      value={formData.serviceInfo.rank}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Rank</option>
                      <option value="Lieutenant Colonel">Lieutenant Colonel</option>
                      <option value="Major">Major</option>
                      <option value="Captain">Captain</option>
                      <option value="Lieutenant">Lieutenant</option>
                      <option value="2nd Lieutenant">2nd Lieutenant</option>
                      <option value="Subedar Major">Subedar Major</option>
                      <option value="Subedar">Subedar</option>
                      <option value="Naib Subedar">Naib Subedar</option>
                      <option value="Havildar">Havildar</option>
                      <option value="Naik">Naik</option>
                      <option value="Lance Naik">Lance Naik</option>
                      <option value="Sepoy">Sepoy</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Unit *</label>
                    <input
                      type="text"
                      name="serviceInfo.unit"
                      value={formData.serviceInfo.unit}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 1 AK Regiment, EME Battalion"
                    />
                  </div>
                  <div className="form-group">
                    <label>Current Status</label>
                    <select
                      name="status.currentStatus"
                      value={formData.status.currentStatus}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Training">Training</option>
                      <option value="Transferred">Transferred</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDriver ? 'Update Driver' : 'Create Driver'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drivers Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Service Number</th>
              <th>Name</th>
              <th>Rank</th>
              <th>Unit</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Created</th>
              {canManageDrivers && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td colSpan={canManageDrivers ? 8 : 7} className="no-data">
                  {searchTerm || statusFilter ? 'No drivers match your search criteria' : 'No drivers found'}
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver._id}>
                  <td className="font-mono">{driver.serviceInfo?.serviceNumber}</td>
                  <td>
                    <div className="driver-name">
                      <strong>
                        {driver.personalInfo?.firstName} {driver.personalInfo?.lastName}
                      </strong>
                    </div>
                  </td>
                  <td>{driver.serviceInfo?.rank}</td>
                  <td>{driver.serviceInfo?.unit}</td>
                  <td>
                    <div className="contact-info">
                      <div>{driver.personalInfo?.contactNumber}</div>
                      {driver.personalInfo?.email && (
                        <div className="text-sm text-gray-600">{driver.personalInfo.email}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${driver.status?.currentStatus?.toLowerCase().replace(' ', '-')}`}>
                      {driver.status?.currentStatus || 'Unknown'}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </td>
                  {canManageDrivers && (
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(driver)}
                          className="btn btn-sm btn-secondary"
                          title="Edit Driver"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(driver._id)}
                          className="btn btn-sm btn-danger"
                          title="Delete Driver"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h4>Driver Summary</h4>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Drivers:</span>
              <span className="summary-value">{drivers.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active:</span>
              <span className="summary-value text-green">
                {drivers.filter(d => d.status?.currentStatus === 'Active').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">On Leave:</span>
              <span className="summary-value text-orange">
                {drivers.filter(d => d.status?.currentStatus === 'On Leave').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Training:</span>
              <span className="summary-value text-blue">
                {drivers.filter(d => d.status?.currentStatus === 'Training').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverManager