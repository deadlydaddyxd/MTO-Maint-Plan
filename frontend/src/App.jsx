import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Components
import Dashboard from './components/Dashboard'
import EquipmentManager from './components/EquipmentManager'
import DriverManager from './components/DriverManager'
import MaintenanceScheduler from './components/MaintenanceScheduler'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [equipment, setEquipment] = useState([])
  const [drivers, setDrivers] = useState([])
  const [maintenanceTasks, setMaintenanceTasks] = useState([])

  const API_BASE_URL = 'http://localhost:5000'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [equipmentRes, driversRes, maintenanceRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/equipment`),
        axios.get(`${API_BASE_URL}/drivers`),
        axios.get(`${API_BASE_URL}/maintenance`)
      ])
      setEquipment(equipmentRes.data)
      setDrivers(driversRes.data)
      setMaintenanceTasks(maintenanceRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard maintenanceTasks={maintenanceTasks} equipment={equipment} />
      case 'equipment':
        return <EquipmentManager equipment={equipment} onUpdate={fetchData} />
      case 'drivers':
        return <DriverManager drivers={drivers} onUpdate={fetchData} />
      case 'maintenance':
        return <MaintenanceScheduler 
          maintenanceTasks={maintenanceTasks} 
          equipment={equipment} 
          drivers={drivers} 
          onUpdate={fetchData} 
        />
      default:
        return <Dashboard maintenanceTasks={maintenanceTasks} equipment={equipment} />
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>MTO Maintenance Plan Dashboard</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'equipment' ? 'active' : ''}
            onClick={() => setActiveTab('equipment')}
          >
            Equipment
          </button>
          <button 
            className={activeTab === 'drivers' ? 'active' : ''}
            onClick={() => setActiveTab('drivers')}
          >
            Drivers
          </button>
          <button 
            className={activeTab === 'maintenance' ? 'active' : ''}
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance Schedule
          </button>
        </nav>
      </header>
      <main className="app-main">
        {renderActiveTab()}
      </main>
    </div>
  )
}

export default App
