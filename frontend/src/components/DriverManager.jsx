import { useState } from 'react'
import axios from 'axios'

const DriverManager = ({ drivers, onUpdate }) => {
  const [newDriver, setNewDriver] = useState({ name: '' })
  const [isAdding, setIsAdding] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newDriver.name.trim()) return

    try {
      await axios.post('http://localhost:5000/drivers/add', newDriver)
      setNewDriver({ name: '' })
      setIsAdding(false)
      onUpdate()
    } catch (error) {
      console.error('Error adding driver:', error)
      alert('Error adding driver. Please try again.')
    }
  }

  return (
    <div className="driver-manager">
      <div className="section-header">
        <h2>Driver Management</h2>
        <button 
          className="add-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : 'Add Driver'}
        </button>
      </div>

      {isAdding && (
        <div className="add-form">
          <h3>Add New Driver</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="driver-name">Driver Name:</label>
              <input
                id="driver-name"
                type="text"
                value={newDriver.name}
                onChange={(e) => setNewDriver({ name: e.target.value })}
                placeholder="Enter driver name"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Driver</button>
              <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="drivers-list">
        <h3>Available Drivers ({drivers.length})</h3>
        {drivers.length > 0 ? (
          <div className="driver-grid">
            {drivers.map(driver => (
              <div key={driver._id} className="driver-item">
                <div className="driver-info">
                  <span className="driver-name">{driver.name}</span>
                  <span className="driver-id">ID: {driver._id.slice(-6)}</span>
                </div>
                <div className="driver-actions">
                  <span className="status active">Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-drivers">No drivers added yet</p>
        )}
      </div>
    </div>
  )
}

export default DriverManager