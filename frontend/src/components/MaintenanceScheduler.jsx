import { useState } from 'react'
import axios from 'axios'

const MaintenanceScheduler = ({ maintenanceTasks, equipment, drivers, onUpdate }) => {
  const [newTask, setNewTask] = useState({
    equipment: '',
    driver: '',
    task: '',
    frequency: 'Monthly',
    dueDate: ''
  })
  const [isAdding, setIsAdding] = useState(false)
  const [filter, setFilter] = useState('all')

  const frequencies = ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newTask.equipment || !newTask.task || !newTask.dueDate) return

    try {
      await axios.post('http://localhost:5000/maintenance/add', newTask)
      setNewTask({
        equipment: '',
        driver: '',
        task: '',
        frequency: 'Monthly',
        dueDate: ''
      })
      setIsAdding(false)
      onUpdate()
    } catch (error) {
      console.error('Error adding maintenance task:', error)
      alert('Error adding maintenance task. Please try again.')
    }
  }

  const handleStatusToggle = async (taskId, currentStatus) => {
    try {
      const task = maintenanceTasks.find(t => t._id === taskId)
      await axios.post(`http://localhost:5000/maintenance/update/${taskId}`, {
        ...task,
        isCompleted: !currentStatus
      })
      onUpdate()
    } catch (error) {
      console.error('Error updating task status:', error)
      alert('Error updating task status. Please try again.')
    }
  }

  const filteredTasks = maintenanceTasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.isCompleted
    if (filter === 'pending') return !task.isCompleted
    if (filter === 'overdue') {
      return new Date(task.dueDate) < new Date() && !task.isCompleted
    }
    return true
  })

  return (
    <div className="maintenance-scheduler">
      <div className="section-header">
        <h2>Maintenance Schedule</h2>
        <button 
          className="add-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? 'Cancel' : 'Schedule Maintenance'}
        </button>
      </div>

      {isAdding && (
        <div className="add-form">
          <h3>Schedule New Maintenance Task</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-equipment">Equipment:</label>
                <select
                  id="task-equipment"
                  value={newTask.equipment}
                  onChange={(e) => setNewTask({ ...newTask, equipment: e.target.value })}
                  required
                >
                  <option value="">Select Equipment</option>
                  {equipment.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-driver">Driver (Optional):</label>
                <select
                  id="task-driver"
                  value={newTask.driver}
                  onChange={(e) => setNewTask({ ...newTask, driver: e.target.value })}
                >
                  <option value="">No Driver Assigned</option>
                  {drivers.map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-frequency">Frequency:</label>
                <select
                  id="task-frequency"
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value })}
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-due-date">Due Date:</label>
                <input
                  id="task-due-date"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="task-description">Maintenance Task:</label>
              <textarea
                id="task-description"
                value={newTask.task}
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                placeholder="Describe the maintenance task to be performed..."
                rows="3"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Schedule Task</button>
              <button type="button" onClick={() => setIsAdding(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-section">
        <div className="filter-bar">
          <label htmlFor="task-filter">Filter Tasks:</label>
          <select 
            id="task-filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <span className="task-count">({filteredTasks.length} tasks)</span>
        </div>

        <div className="tasks-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task._id} className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
                <div className="task-header">
                  <h4>{task.task}</h4>
                  <button
                    className={`status-btn ${task.isCompleted ? 'completed' : 'pending'}`}
                    onClick={() => handleStatusToggle(task._id, task.isCompleted)}
                  >
                    {task.isCompleted ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
                <div className="task-details">
                  <div className="detail-item">
                    <strong>Equipment:</strong> {task.equipment?.name || 'Unknown'} 
                    <span className="category">({task.equipment?.category || 'Unknown'})</span>
                  </div>
                  <div className="detail-item">
                    <strong>Driver:</strong> {task.driver?.name || 'Unassigned'}
                  </div>
                  <div className="detail-item">
                    <strong>Frequency:</strong> {task.frequency}
                  </div>
                  <div className="detail-item">
                    <strong>Due Date:</strong> 
                    <span className={`due-date ${new Date(task.dueDate) < new Date() && !task.isCompleted ? 'overdue' : ''}`}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-tasks">No maintenance tasks found for the selected filter.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MaintenanceScheduler