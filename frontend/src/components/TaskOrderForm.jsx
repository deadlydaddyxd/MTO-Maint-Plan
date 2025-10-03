import React, { useState, useEffect } from 'react';
import { taskOrderService, driverService, vehicleService } from '../services/api';

const TaskOrderForm = ({ onTaskCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    issueDescription: '',
    priority: 'Medium',
    urgency: 'Normal',
    vehicleType: '',
    vehicleId: '',
    driverId: '',
    issueCategory: '',
    symptomsObserved: '',
    whenIssueOccurred: '',
    estimatedDuration: '',
    estimatedCost: ''
  });

  const [vehicleDetails, setVehicleDetails] = useState({});
  const [photos, setPhotos] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load drivers and vehicles on component mount
  useEffect(() => {
    loadDrivers();
    loadVehicles();
  }, []);

  const loadDrivers = async () => {
    try {
      const result = await driverService.getAll();
      if (result.success) {
        setDrivers(result.drivers || []);
      }
    } catch (error) {
      console.error('Failed to load drivers:', error);
    }
  };

  const loadVehicles = async () => {
    try {
      const result = await vehicleService.getAll();
      if (result.success) {
        setVehicles(result.vehicles || result.equipment || []);
      }
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-populate vehicle details when vehicle is selected
    if (name === 'vehicleId' && value) {
      const selectedVehicle = vehicles.find(v => v._id === value || v.id === value);
      if (selectedVehicle) {
        setVehicleDetails({
          name: selectedVehicle.name || selectedVehicle.vehicleType,
          location: selectedVehicle.location || 'Not specified',
          currentStatus: selectedVehicle.status || 'Active'
        });
      }
    }

    setError(''); // Clear error when user types
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size must be less than 10MB');
        return false;
      }
      return true;
    });

    setPhotos(validFiles);
    setError('');
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getVehiclesByType = (type) => {
    if (!vehicles || vehicles.length === 0) return [];
    
    return vehicles.filter(vehicle => {
      const vehicleCategory = vehicle.category || vehicle.type;
      switch (type) {
        case 'A Vehicle':
          return vehicleCategory === 'A Vehicle';
        case 'B Vehicle':
          return vehicleCategory === 'B Vehicle';
        case 'C Vehicle':
          return vehicleCategory === 'Plant' || vehicleCategory === 'Generator Set' || vehicleCategory === 'C Vehicle';
        default:
          return false;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add vehicle details
      submitData.append('vehicleDetails', JSON.stringify(vehicleDetails));

      // Add photos
      photos.forEach(photo => {
        submitData.append('photos', photo);
      });

      const result = await taskOrderService.create(submitData);
      
      if (result.success) {
        onTaskCreated(result.taskOrder);
      }
    } catch (error) {
      setError(error.message || 'Failed to create task order');
    } finally {
      setLoading(false);
    }
  };

  const issueCategories = [
    'Engine Problem',
    'Transmission Issue',
    'Electrical Fault',
    'Hydraulic System',
    'Brake System',
    'Fuel System',
    'Cooling System',
    'Exhaust System',
    'Suspension',
    'Body/Structural',
    'Safety Equipment',
    'Communication System',
    'Weapon System',
    'Specialized Equipment',
    'Other'
  ];

  return (
    <div className="task-order-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>🚨 Create New Task Order</h2>
          <p>Report vehicle issue and create maintenance request</p>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="form-section">
            <h3>📝 Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the issue"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="priority">Priority Level *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="issueDescription">Issue Description *</label>
              <textarea
                id="issueDescription"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Detailed description of the problem..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="form-section">
            <h3>🚗 Vehicle Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type *</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="A Vehicle">A Vehicle (Combat)</option>
                  <option value="B Vehicle">B Vehicle (Transport)</option>
                  <option value="C Vehicle">C Vehicle (Plant/Generator)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="vehicleId">Vehicle ID *</label>
                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  required
                  disabled={loading || !formData.vehicleType}
                >
                  <option value="">Select Vehicle</option>
                  {getVehiclesByType(formData.vehicleType).map(vehicle => (
                    <option key={vehicle._id || vehicle.id} value={vehicle._id || vehicle.id}>
                      {vehicle.vehicleId || vehicle.unNumber || vehicle.id} - {vehicle.name || vehicle.vehicleType}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {vehicleDetails.name && (
              <div className="vehicle-info">
                <h4>Selected Vehicle Details:</h4>
                <p><strong>Name:</strong> {vehicleDetails.name}</p>
                <p><strong>Location:</strong> {vehicleDetails.location}</p>
                <p><strong>Status:</strong> {vehicleDetails.currentStatus}</p>
              </div>
            )}
          </div>

          {/* Issue Details */}
          <div className="form-section">
            <h3>🔧 Issue Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="issueCategory">Issue Category *</label>
                <select
                  id="issueCategory"
                  name="issueCategory"
                  value={formData.issueCategory}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Category</option>
                  {issueCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="driverId">Identified By (Driver) *</label>
                <select
                  id="driverId"
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.personalInfo?.firstName} {driver.personalInfo?.lastName} 
                      ({driver.serviceInfo?.serviceNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="symptomsObserved">Symptoms Observed</label>
              <textarea
                id="symptomsObserved"
                name="symptomsObserved"
                value={formData.symptomsObserved}
                onChange={handleChange}
                rows="3"
                placeholder="What symptoms were noticed? (sounds, vibrations, etc.)"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="whenIssueOccurred">When Issue Occurred</label>
                <input
                  type="datetime-local"
                  id="whenIssueOccurred"
                  name="whenIssueOccurred"
                  value={formData.whenIssueOccurred}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="urgency">Urgency</label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Routine">Routine</option>
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="form-section">
            <h3>📷 Vehicle Photos</h3>
            <p className="section-description">
              Upload photos showing the issue (Max 5 photos, 10MB each)
            </p>
            
            <div className="form-group">
              <label htmlFor="photos">Upload Photos</label>
              <input
                type="file"
                id="photos"
                name="photos"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={loading}
              />
            </div>

            {photos.length > 0 && (
              <div className="photo-preview">
                <h4>Selected Photos:</h4>
                <div className="photo-grid">
                  {photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Issue photo ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="remove-photo"
                        disabled={loading}
                      >
                        ✕
                      </button>
                      <p>{photo.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Estimates */}
          <div className="form-section">
            <h3>💰 Estimates (Optional)</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="estimatedDuration">Estimated Duration (hours)</label>
                <input
                  type="number"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estimatedCost">Estimated Cost (PKR)</label>
                <input
                  type="number"
                  id="estimatedCost"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 5000"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Task Order'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .task-order-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .form-header {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }

        .form-header h2 {
          margin: 0 0 10px;
          font-size: 24px;
        }

        .form-header p {
          margin: 0;
          opacity: 0.9;
        }

        .task-form {
          padding: 30px;
        }

        .form-section {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .form-section:last-of-type {
          border-bottom: none;
        }

        .form-section h3 {
          margin: 0 0 15px;
          color: #2c3e50;
          font-size: 18px;
        }

        .section-description {
          color: #7f8c8d;
          font-size: 14px;
          margin: 0 0 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e6ed;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
        }

        .vehicle-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
        }

        .vehicle-info h4 {
          margin: 0 0 10px;
          color: #2c3e50;
        }

        .vehicle-info p {
          margin: 5px 0;
          font-size: 14px;
        }

        .photo-preview {
          margin-top: 20px;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }

        .photo-item {
          position: relative;
          text-align: center;
        }

        .photo-item img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #e0e6ed;
        }

        .remove-photo {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #e74c3c;
          color: white;
          border: none;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          cursor: pointer;
          font-size: 12px;
        }

        .photo-item p {
          margin: 5px 0 0;
          font-size: 12px;
          color: #7f8c8d;
          word-break: break-all;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c0392b;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .cancel-button,
        .submit-button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cancel-button {
          background: #95a5a6;
          color: white;
        }

        .cancel-button:hover {
          background: #7f8c8d;
        }

        .submit-button {
          background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
          color: white;
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #229954 0%, #1e8449 100%);
        }

        .submit-button:disabled,
        .cancel-button:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
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
      `}</style>
    </div>
  );
};

export default TaskOrderForm;

// Image display component for completed task orders
export const TaskOrderImages = ({ taskOrder }) => {
  if (!taskOrder?.issuePhotos || taskOrder.issuePhotos.length === 0) {
    return null;
  }

  return (
    <div className="task-order-images">
      <h4>Issue Photos:</h4>
      <div className="images-grid">
        {taskOrder.issuePhotos.map((photo, index) => (
          <div key={index} className="image-item">
            <img
              src={photo.url || photo}
              alt={`Issue photo ${index + 1}`}
              className="task-image"
              onError={(e) => {
                e.target.src = '/placeholder-image.png'; // Fallback image
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};