import { useState } from 'react'
import axios from 'axios'

const EquipmentManager = ({ equipment, onUpdate }) => {
  const [newEquipment, setNewEquipment] = useState({ name: '', category: 'B Vehicle' })
  const [isAdding, setIsAdding] = useState(false)

  const categories = ['B Vehicle', 'C Vehicle', 'Plant', 'Generator Set']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newEquipment.name.trim()) return

    try {
      await axios.post('http://localhost:5000/equipment/add', newEquipment)
      setNewEquipment({ name: '', category: 'B Vehicle' })
      setIsAdding(false)
      onUpdate()
    } catch (error) {
      console.error('Error adding equipment:', error)
      alert('Error adding equipment. Please try again.')
    }
  }

  const groupedEquipment = equipment.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <div className="equipment-manager">
      <div className="section-header">
        <h2>Equipment Management</h2>
        <button 
          className="add-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : 'Add Equipment'}
        </button>
      </div>

      {isAdding && (
        <div className="add-form">
          <h3>Add New Equipment</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="equipment-name">Equipment Name:</label>
              <input
                id="equipment-name"
                type="text"
                value={newEquipment.name}
                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                placeholder="Enter equipment name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="equipment-category">Category:</label>
              <select
                id="equipment-category"
                value={newEquipment.category}
                onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Add Equipment</button>
              <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="equipment-grid">
        {categories.map(category => (
          <div key={category} className="equipment-category-section">
            <h3>{category}</h3>
            <div className="equipment-list">
              {groupedEquipment[category]?.length > 0 ? (
                groupedEquipment[category].map(item => (
                  <div key={item._id} className="equipment-item">
                    <span className="equipment-name">{item.name}</span>
                    <span className="equipment-id">ID: {item._id.slice(-6)}</span>
                  </div>
                ))
              ) : (
                <p className="no-equipment">No equipment in this category</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EquipmentManager