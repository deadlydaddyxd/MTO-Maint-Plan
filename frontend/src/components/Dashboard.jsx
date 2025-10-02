import { useState, useMemo, useEffect } from 'react'
import { vehicleData, generateMaintenanceTasks } from '../data/vehicleData'

const Dashboard = ({ maintenanceTasks, equipment }) => {
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [smartTasks, setSmartTasks] = useState([])
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week')

  useEffect(() => {
    // Generate intelligent maintenance tasks from vehicle data
    const generatedTasks = generateMaintenanceTasks()
    setSmartTasks(generatedTasks)
  }, [])

  // Combine all vehicles from different categories
  const allVehicles = useMemo(() => {
    return [
      ...vehicleData.plantEquipment,
      ...vehicleData.bVehicles,
      ...vehicleData.aVehicles,
      ...vehicleData.generatorSets,
      ...vehicleData.trailers
    ]
  }, [])

  const stats = useMemo(() => {
    const total = smartTasks.length
    const overdue = smartTasks.filter(task => 
      new Date(task.dueDate) < new Date() && !task.isCompleted
    ).length
    
    const today = new Date()
    const dueThisWeek = smartTasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      return dueDate >= today && dueDate <= nextWeek && !task.isCompleted
    }).length
    
    const completed = smartTasks.filter(task => task.isCompleted).length
    const critical = smartTasks.filter(task => 
      task.priority === 'Critical' && !task.isCompleted
    ).length
    const high = smartTasks.filter(task => 
      task.priority === 'High' && !task.isCompleted
    ).length

    return { total, overdue, dueThisWeek, completed, critical, high }
  }, [smartTasks])

  const locationStats = useMemo(() => {
    const locations = {}
    allVehicles.forEach(vehicle => {
      if (!locations[vehicle.location]) {
        locations[vehicle.location] = { total: 0, categories: {} }
      }
      locations[vehicle.location].total++
      
      if (!locations[vehicle.location].categories[vehicle.category]) {
        locations[vehicle.location].categories[vehicle.category] = 0
      }
      locations[vehicle.location].categories[vehicle.category]++
    })
    return locations
  }, [allVehicles])

  const equipmentByCategory = useMemo(() => {
    const categories = {}
    allVehicles.forEach(vehicle => {
      if (!categories[vehicle.category]) {
        categories[vehicle.category] = 0
      }
      categories[vehicle.category]++
    })
    return categories
  }, [allVehicles])

  const filteredTasks = useMemo(() => {
    let filtered = smartTasks

    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => task.vehicleCategory === filterCategory)
    }
    
    if (filterLocation !== 'all') {
      filtered = filtered.filter(task => task.location === filterLocation)
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    // Sort by priority and due date
    return filtered.sort((a, b) => {
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  }, [smartTasks, filterCategory, filterLocation, filterPriority])

  const getMaintenanceStatus = (task) => {
    const today = new Date()
    const dueDate = new Date(task.dueDate)
    const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    
    if (task.isCompleted) return 'completed'
    if (daysDiff < 0) return 'overdue'
    if (daysDiff <= 3) return 'critical'
    if (daysDiff <= 7) return 'warning'
    return 'normal'
  }

  const calculateMaintenanceCycleProgress = (task) => {
    const today = new Date()
    const lastMaintenance = task.lastMaintenance ? new Date(task.lastMaintenance) : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const dueDate = new Date(task.dueDate)
    
    // Calculate cycle duration in days
    const cycleDays = {
      'Weekly': 7,
      'Fortnightly': 14,
      'Monthly': 30,
      'Quarterly': 90
    }[task.frequency] || 30
    
    const daysSinceLastMaintenance = Math.ceil((today - lastMaintenance) / (1000 * 60 * 60 * 24))
    const progress = Math.min((daysSinceLastMaintenance / cycleDays) * 100, 100)
    
    let status = 'on-track'
    if (task.isCompleted) {
      status = 'completed'
    } else if (daysSinceLastMaintenance > cycleDays) {
      status = 'overdue'
    } else if (progress >= 85) {
      status = 'due-soon'
    }
    
    return {
      progress: Math.round(progress),
      daysSinceLastMaintenance,
      cycleDays,
      status,
      nextDue: new Date(lastMaintenance.getTime() + cycleDays * 24 * 60 * 60 * 1000)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#ef4444'
      case 'High': return '#f59e0b'
      case 'Medium': return '#3b82f6'
      case 'Low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getVehicleAge = (year) => {
    return new Date().getFullYear() - year
  }

  return (
    <div className="enhanced-dashboard">
      {/* Header Stats */}
      <div className="dashboard-header">
        <h1>MTO Equipment Maintenance Dashboard</h1>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-label">Total Vehicles</span>
            <span className="stat-value">{allVehicles.length}</span>
          </div>
          <div className="header-stat">
            <span className="stat-label">Active Tasks</span>
            <span className="stat-value">{stats.total - stats.completed}</span>
          </div>
          <div className="header-stat critical">
            <span className="stat-label">Critical Tasks</span>
            <span className="stat-value">{stats.critical}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid-enhanced">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <span className="stat-number">{stats.total}</span>
            <span className="stat-trend">+{Math.round((stats.total / allVehicles.length) * 10) / 10} per vehicle</span>
          </div>
        </div>
        
        <div className="stat-card overdue">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <span className="stat-number">{stats.overdue}</span>
            <span className="stat-trend">{((stats.overdue / stats.total) * 100).toFixed(1)}% of total</span>
          </div>
        </div>
        
        <div className="stat-card due-soon">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Due This Week</h3>
            <span className="stat-number">{stats.dueThisWeek}</span>
            <span className="stat-trend">Requires attention</span>
          </div>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-trend">{((stats.completed / stats.total) * 100).toFixed(1)}% completion</span>
          </div>
        </div>
        
        <div className="stat-card high-priority">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>High Priority</h3>
            <span className="stat-number">{stats.high}</span>
            <span className="stat-trend">Needs immediate action</span>
          </div>
        </div>
        
        <div className="stat-card critical-priority">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Critical</h3>
            <span className="stat-number">{stats.critical}</span>
            <span className="stat-trend">Mission critical</span>
          </div>
        </div>
      </div>

      {/* Maintenance Cycle Summary */}
      <div className="maintenance-cycle-summary">
        <h2>Maintenance Cycle Analysis</h2>
        <div className="cycle-summary-grid">
          <div className="cycle-summary-card">
            <h3>Weekly Maintenance</h3>
            <div className="cycle-stats">
              <div className="cycle-stat">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Weekly').length}</span>
                <span className="cycle-label">Total Tasks</span>
              </div>
              <div className="cycle-stat overdue">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Weekly' && calculateMaintenanceCycleProgress(t).status === 'overdue').length}</span>
                <span className="cycle-label">Overdue</span>
              </div>
            </div>
          </div>
          
          <div className="cycle-summary-card">
            <h3>Fortnightly Maintenance</h3>
            <div className="cycle-stats">
              <div className="cycle-stat">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Fortnightly').length}</span>
                <span className="cycle-label">Total Tasks</span>
              </div>
              <div className="cycle-stat overdue">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Fortnightly' && calculateMaintenanceCycleProgress(t).status === 'overdue').length}</span>
                <span className="cycle-label">Overdue</span>
              </div>
            </div>
          </div>
          
          <div className="cycle-summary-card">
            <h3>Monthly Maintenance</h3>
            <div className="cycle-stats">
              <div className="cycle-stat">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Monthly').length}</span>
                <span className="cycle-label">Total Tasks</span>
              </div>
              <div className="cycle-stat overdue">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Monthly' && calculateMaintenanceCycleProgress(t).status === 'overdue').length}</span>
                <span className="cycle-label">Overdue</span>
              </div>
            </div>
          </div>
          
          <div className="cycle-summary-card">
            <h3>Quarterly Maintenance</h3>
            <div className="cycle-stats">
              <div className="cycle-stat">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Quarterly').length}</span>
                <span className="cycle-label">Total Tasks</span>
              </div>
              <div className="cycle-stat overdue">
                <span className="cycle-number">{smartTasks.filter(t => t.frequency === 'Quarterly' && calculateMaintenanceCycleProgress(t).status === 'overdue').length}</span>
                <span className="cycle-label">Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Overview */}
      <div className="equipment-overview-enhanced">
        <h2>Equipment Fleet Overview</h2>
        <div className="overview-grid">
          <div className="category-breakdown">
            <h3>By Category</h3>
            <div className="category-stats">
              {Object.entries(equipmentByCategory).map(([category, count]) => (
                <div key={category} className="category-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{count} units</span>
                  </div>
                  <div className="category-bar">
                    <div 
                      className="category-fill" 
                      style={{ 
                        width: `${(count / allVehicles.length) * 100}%`,
                        background: category === 'A Vehicle' ? '#ef4444' :
                                  category === 'B Vehicle' ? '#3b82f6' :
                                  category === 'Plant' ? '#f59e0b' :
                                  category === 'Generator Set' ? '#10b981' : '#6b7280'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="location-breakdown">
            <h3>By Location</h3>
            <div className="location-stats">
              {Object.entries(locationStats).slice(0, 6).map(([location, data]) => (
                <div key={location} className="location-item">
                  <div className="location-header">
                    <span className="location-name">{location}</span>
                    <span className="location-total">{data.total} vehicles</span>
                  </div>
                  <div className="location-categories">
                    {Object.entries(data.categories).map(([cat, count]) => (
                      <span key={cat} className="location-category">{cat}: {count}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Management Section */}
      <div className="task-management">
        <div className="task-header">
          <h2>Maintenance Task Tracker</h2>
          <div className="task-filters">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="A Vehicle">A Vehicles</option>
              <option value="B Vehicle">B Vehicles</option>
              <option value="Plant">Plant Equipment</option>
              <option value="Generator Set">Generator Sets</option>
            </select>
            
            <select 
              value={filterLocation} 
              onChange={(e) => setFilterLocation(e.target.value)}
            >
              <option value="all">All Locations</option>
              {Object.keys(locationStats).map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="task-list-enhanced">
          {filteredTasks.slice(0, 20).map((task, index) => {
            const status = getMaintenanceStatus(task)
            const vehicle = allVehicles.find(v => v.id === task.vehicleId)
            const vehicleAge = vehicle ? getVehicleAge(vehicle.year) : 0
            
            const cycleProgress = calculateMaintenanceCycleProgress(task)
            
            return (
              <div key={`${task.vehicleId}-${task.task}-${index}`} className={`task-card-enhanced ${status}`}>
                <div className="task-priority-indicator" style={{ backgroundColor: getPriorityColor(task.priority) }}></div>
                
                <div className="task-main-content">
                  <div className="task-header-info">
                    <h4>{task.task}</h4>
                    <div className="task-badges">
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <span className={`frequency-badge`}>
                        {task.frequency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="task-details-grid">
                    <div className="task-detail">
                      <strong>Vehicle:</strong> 
                      <span>{task.vehicleName}</span>
                      <span className="vehicle-id">({task.vehicleId})</span>
                    </div>
                    
                    <div className="task-detail">
                      <strong>Category:</strong> 
                      <span>{task.vehicleCategory}</span>
                    </div>
                    
                    <div className="task-detail">
                      <strong>Location:</strong> 
                      <span>{task.location}</span>
                    </div>
                    
                    <div className="task-detail">
                      <strong>Age:</strong> 
                      <span className={vehicleAge > 15 ? 'age-critical' : vehicleAge > 10 ? 'age-warning' : 'age-good'}>
                        {vehicleAge} years
                      </span>
                    </div>
                    
                    <div className="task-detail">
                      <strong>Due Date:</strong> 
                      <span className={`due-date ${status}`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="task-detail">
                      <strong>Last Service:</strong> 
                      <span>{task.lastMaintenance ? new Date(task.lastMaintenance).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  
                  {/* Maintenance Cycle Progress Visualization */}
                  <div className="maintenance-progress">
                    <div className="progress-label">
                      Maintenance Cycle Progress ({task.frequency})
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill progress-${cycleProgress.status}`}
                        style={{ width: `${cycleProgress.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {cycleProgress.daysSinceLastMaintenance} of {cycleProgress.cycleDays} days 
                      ({cycleProgress.progress}% of cycle)
                    </div>
                    
                    <div className="maintenance-cycle-info">
                      <div className="cycle-item">
                        <span>Last Maintenance:</span>
                        <strong>{task.lastMaintenance ? new Date(task.lastMaintenance).toLocaleDateString() : 'N/A'}</strong>
                      </div>
                      <div className="cycle-item">
                        <span>Next Due:</span>
                        <strong>{cycleProgress.nextDue.toLocaleDateString()}</strong>
                      </div>
                      <div className="cycle-item">
                        <span>Days Overdue:</span>
                        <strong className={cycleProgress.daysSinceLastMaintenance > cycleProgress.cycleDays ? 'age-critical' : 'age-good'}>
                          {Math.max(0, cycleProgress.daysSinceLastMaintenance - cycleProgress.cycleDays)}
                        </strong>
                      </div>
                      <div className="cycle-item">
                        <span>Status:</span>
                        <strong className={
                          cycleProgress.status === 'overdue' ? 'age-critical' :
                          cycleProgress.status === 'due-soon' ? 'age-warning' :
                          cycleProgress.status === 'completed' ? 'age-good' : ''
                        }>
                          {cycleProgress.status === 'completed' ? 'Completed' :
                           cycleProgress.status === 'overdue' ? 'Overdue' :
                           cycleProgress.status === 'due-soon' ? 'Due Soon' : 'On Track'}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="task-actions">
                  <div className={`task-status-indicator ${status}`}>
                    {status === 'completed' && '✓'}
                    {status === 'overdue' && '🚨'}
                    {status === 'critical' && '⚠️'}
                    {status === 'warning' && '⏰'}
                    {status === 'normal' && '📅'}
                  </div>
                  
                  <div className="status-text">
                    {task.isCompleted ? 'Completed' : 
                     cycleProgress.status === 'overdue' ? 'Overdue' :
                     cycleProgress.status === 'due-soon' ? 'Due Soon' :
                     status === 'warning' ? 'Due This Week' : 'On Schedule'}
                  </div>
                  
                  {/* Cycle completion percentage */}
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: cycleProgress.status === 'overdue' ? '#ef4444' :
                           cycleProgress.status === 'due-soon' ? '#f59e0b' :
                           cycleProgress.status === 'completed' ? '#10b981' : '#3b82f6'
                  }}>
                    {cycleProgress.progress}%
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="no-tasks">
            <p>No maintenance tasks found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard