import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/api';

const EquipmentManager = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [editingVehicle, setEditingVehicle] = useState(null);

  // Form state for adding/editing vehicles
  const [formData, setFormData] = useState({
    vehicleId: '',
    unNumber: '',
    vehicleType: '',
    name: '',
    category: '',
    location: '',
    year: '',
    status: 'Operational',
    manufacturer: '',
    kva: '',
    remarks: '',
    lastMaintenanceDoneDate: '',
    lastOilChangeDate: '',
    lastMajorFaultDate: '',
    lastMajorFaultType: ''
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getAll();
      if (response.success) {
        setVehicles(response.vehicles || []);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        const response = await vehicleService.update(editingVehicle._id, formData);
        if (response.success) {
          alert('Vehicle updated successfully!');
        }
      } else {
        const response = await vehicleService.create(formData);
        if (response.success) {
          alert('Vehicle added successfully!');
        }
      }
      await loadVehicles();
      cancelForm();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      alert('Failed to save vehicle: ' + error.message);
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleId: vehicle.vehicleId || '',
      unNumber: vehicle.unNumber || '',
      vehicleType: vehicle.vehicleType || vehicle.name || '',
      name: vehicle.name || '',
      category: vehicle.category || '',
      location: vehicle.location || '',
      year: vehicle.year || '',
      status: vehicle.status || 'Operational',
      manufacturer: vehicle.manufacturer || '',
      kva: vehicle.kva || '',
      remarks: vehicle.remarks || '',
      lastMaintenanceDoneDate: vehicle.lastMaintenanceDoneDate ? new Date(vehicle.lastMaintenanceDoneDate).toISOString().split('T')[0] : '',
      lastOilChangeDate: vehicle.lastOilChangeDate ? new Date(vehicle.lastOilChangeDate).toISOString().split('T')[0] : '',
      lastMajorFaultDate: vehicle.lastMajorFaultDate ? new Date(vehicle.lastMajorFaultDate).toISOString().split('T')[0] : '',
      lastMajorFaultType: vehicle.lastMajorFaultType || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleService.delete(vehicleId);
        await loadVehicles();
        alert('Vehicle deleted successfully!');
      } catch (error) {
        console.error('Failed to delete vehicle:', error);
        alert('Failed to delete vehicle: ' + error.message);
      }
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingVehicle(null);
    setFormData({
      vehicleId: '',
      unNumber: '',
      vehicleType: '',
      baNumber: '',
      category: '',
      type: '',
      model: '',
      year: '',
      location: '',
      status: 'active',
      remarks: '',
      lastMaintenanceDoneDate: '',
      lastOilChangeDate: '',
      lastMajorFaultDate: '',
      lastMajorFaultType: ''
    });
  };

  // Get unique values for filters
  const categories = [...new Set(vehicles.map(v => v.category).filter(Boolean))];
  const locations = [...new Set(vehicles.map(v => v.location).filter(Boolean))];

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    if (filterCategory !== 'all' && vehicle.category !== filterCategory) return false;
    if (filterLocation !== 'all' && vehicle.location !== filterLocation) return false;
    return true;
  });

  // Group vehicles by category
  const groupedVehicles = filteredVehicles.reduce((acc, vehicle) => {
    const category = vehicle.category || 'Uncategorized';
    if (!acc[category]) acc[category] = [];
    acc[category].push(vehicle);
    return acc;
  }, {});

  const canEdit = ['Commanding Officer', 'Transport Officer', 'Maintenance Officer'].includes(user.role);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading equipment...</p>
      </div>
    );
  }

  return (
    <div className="equipment-manager">
      <div className="section-header">
        <h2>🚗 Equipment Management</h2>
        {canEdit && (
          <button 
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '❌ Cancel' : '➕ Add Vehicle'}
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showAddForm && canEdit && (
        <div className="add-form">
          <h3>{editingVehicle ? '✏️ Edit Vehicle' : '➕ Add New Vehicle'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleId">Vehicle ID</label>
                <input
                  type="text"
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  placeholder="e.g., VH-001, VH-002"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="unNumber">UN Number *</label>
                <input
                  type="text"
                  id="unNumber"
                  name="unNumber"
                  value={formData.unNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., UN-20250"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="baNumber">BA Number</label>
                <input
                  type="text"
                  id="baNumber"
                  name="baNumber"
                  value={formData.baNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 20AT0461"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <input
                  type="text"
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  placeholder="e.g., Pickup, APC, Generator"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="A Vehicle">A Vehicle</option>
                  <option value="B Vehicle">B Vehicle</option>
                  <option value="C Vehicle">C Vehicle</option>
                  <option value="Plant Equipment">Plant Equipment</option>
                  <option value="Generator Set">Generator Set</option>
                  <option value="Trailer">Trailer</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Type/Make *</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota Hilux Pickup, APC PUMA"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="year">Model Year</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1980"
                  max="2030"
                  placeholder="e.g., 2020"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Location</option>
                  <option value="KB">KB</option>
                  <option value="Grimari">Grimari</option>
                  <option value="Sibut">Sibut</option>
                  <option value="Batangafo">Batangafo</option>
                  <option value="N'DELE">N'DELE</option>
                  <option value="Bangui">Bangui</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="repair">Under Repair</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., Hilux, Landcruiser"
                />
              </div>
            </div>

            {/* Maintenance Tracking Section */}
            <div className="form-section">
              <h4>🔧 Maintenance Tracking</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastMaintenanceDoneDate">Last Maintenance Date</label>
                  <input
                    type="date"
                    id="lastMaintenanceDoneDate"
                    name="lastMaintenanceDoneDate"
                    value={formData.lastMaintenanceDoneDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastOilChangeDate">Last Oil Change Date</label>
                  <input
                    type="date"
                    id="lastOilChangeDate"
                    name="lastOilChangeDate"
                    value={formData.lastOilChangeDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lastMajorFaultDate">Last Major Fault Date</label>
                  <input
                    type="date"
                    id="lastMajorFaultDate"
                    name="lastMajorFaultDate"
                    value={formData.lastMajorFaultDate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastMajorFaultType">Last Major Fault Type</label>
                  <input
                    type="text"
                    id="lastMajorFaultType"
                    name="lastMajorFaultType"
                    value={formData.lastMajorFaultType}
                    onChange={handleInputChange}
                    placeholder="e.g., Engine failure, Transmission issue"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="remarks">Remarks</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  placeholder="Additional notes or remarks"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingVehicle ? '💾 Update Vehicle' : '✅ Add Vehicle'}
              </button>
              <button type="button" className="cancel-btn" onClick={cancelForm}>
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <div className="task-filters">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select 
            value={filterLocation} 
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="all">All Locations</option>
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
        
        <div className="task-count">
          Total: {filteredVehicles.length} vehicles
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="equipment-grid">
        {Object.entries(groupedVehicles).map(([category, categoryVehicles]) => (
          <div key={category} className="equipment-category-section">
            <h3>{category} ({categoryVehicles.length})</h3>
            <div className="equipment-list">
              {categoryVehicles.map((vehicle) => (
                <div key={vehicle._id || vehicle.unNumber} className="equipment-item">
                  <div className="equipment-info">
                    <div className="equipment-name">{vehicle.type}</div>
                    <div className="equipment-details">
                      <span className="equipment-id">{vehicle.unNumber}</span>
                      {vehicle.baNumber && <span className="equipment-id">{vehicle.baNumber}</span>}
                      {vehicle.year && <span className="vehicle-year">{vehicle.year}</span>}
                      <span className="vehicle-location">📍 {vehicle.location}</span>
                    </div>
                    <div className="equipment-status">
                      <span className={`status ${vehicle.status || 'active'}`}>
                        {vehicle.status === 'active' ? '🟢 Active' : 
                         vehicle.status === 'maintenance' ? '🟡 Maintenance' :
                         vehicle.status === 'repair' ? '🔴 Repair' : '⚫ Inactive'}
                      </span>
                      {vehicle.vehicleType && (
                        <span className="vehicle-type-badge">🚗 {vehicle.vehicleType}</span>
                      )}
                    </div>
                    
                    {/* Maintenance Information */}
                    <div className="maintenance-info">
                      {vehicle.lastMaintenanceDoneDate && (
                        <div className="maintenance-item">
                          🔧 Last Maint: {new Date(vehicle.lastMaintenanceDoneDate).toLocaleDateString()}
                        </div>
                      )}
                      {vehicle.lastOilChangeDate && (
                        <div className="maintenance-item">
                          🛢️ Oil Change: {new Date(vehicle.lastOilChangeDate).toLocaleDateString()}
                        </div>
                      )}
                      {vehicle.lastMajorFaultDate && (
                        <div className="maintenance-item fault">
                          ⚠️ Last Fault: {new Date(vehicle.lastMajorFaultDate).toLocaleDateString()}
                          {vehicle.lastMajorFaultType && <span className="fault-type"> - {vehicle.lastMajorFaultType}</span>}
                        </div>
                      )}
                    </div>
                    
                    {vehicle.remarks && (
                      <div className="equipment-remarks">📝 {vehicle.remarks}</div>
                    )}
                  </div>
                  
                  {canEdit && (
                    <div className="equipment-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(vehicle)}
                        title="Edit Vehicle"
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(vehicle._id)}
                        title="Delete Vehicle"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="no-equipment">
          <p>No equipment found for the selected filters.</p>
          {canEdit && (
            <p>Click "Add Vehicle" to add your first piece of equipment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentManager;