const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import your vehicle data
const { vehicleData, generateMaintenanceTasks } = require('../frontend/src/data/vehicleData');

// Import models
const Equipment = require('./models/equipment.model');
const Driver = require('./models/driver.model');
const Maintenance = require('./models/maintenance.model');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = process.env.ATLAS_URI || 'mongodb://localhost:27017/mto_maintenance';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Sample data population
const populateDatabase = async () => {
  try {
    console.log('🚀 Starting database population...');
    
    // Clear existing data
    await Equipment.deleteMany({});
    await Driver.deleteMany({});
    await Maintenance.deleteMany({});
    console.log('✅ Cleared existing data');

    // Add all vehicles from your spreadsheet
    const allVehicles = [
      ...vehicleData.plantEquipment,
      ...vehicleData.bVehicles,
      ...vehicleData.aVehicles,
      ...vehicleData.generatorSets,
      ...vehicleData.trailers
    ];

    const equipmentPromises = allVehicles.map(vehicle => {
      return new Equipment({
        name: `${vehicle.name} (${vehicle.id})`,
        category: vehicle.category,
        location: vehicle.location,
        year: vehicle.year,
        vehicleId: vehicle.id
      }).save();
    });

    await Promise.all(equipmentPromises);
    console.log(`✅ Added ${allVehicles.length} vehicles to database`);

    // Add sample drivers
    const driverNames = [
      'Sergeant Ahmed Hassan',
      'Corporal James Wilson', 
      'Private Muhammad Ali',
      'Sergeant Sarah Johnson',
      'Corporal David Brown',
      'Private Michael Davis',
      'Sergeant Lisa Anderson',
      'Corporal Robert Garcia'
    ];

    const driverPromises = driverNames.map(name => {
      return new Driver({ name }).save();
    });

    await Promise.all(driverPromises);
    console.log(`✅ Added ${driverNames.length} drivers to database`);

    // Generate and add maintenance tasks
    const tasks = generateMaintenanceTasks();
    const equipment = await Equipment.find();
    const drivers = await Driver.find();

    const maintenancePromises = tasks.slice(0, 100).map(task => { // Limit to 100 tasks for demo
      const equipmentItem = equipment.find(e => e.vehicleId === task.vehicleId);
      const randomDriver = drivers[Math.floor(Math.random() * drivers.length)];

      if (equipmentItem) {
        return new Maintenance({
          equipment: equipmentItem._id,
          driver: Math.random() > 0.3 ? randomDriver._id : null, // 70% chance of having a driver
          task: task.task,
          frequency: task.frequency,
          dueDate: new Date(task.dueDate),
          isCompleted: task.isCompleted,
          priority: task.priority,
          lastMaintenance: new Date(task.lastMaintenance)
        }).save();
      }
    });

    const validPromises = maintenancePromises.filter(p => p !== undefined);
    await Promise.all(validPromises);
    console.log(`✅ Added ${validPromises.length} maintenance tasks to database`);

    console.log('🎉 Database population completed successfully!');
    console.log(`
📊 Summary:
- ${allVehicles.length} Vehicles added
- ${driverNames.length} Drivers added  
- ${validPromises.length} Maintenance tasks created

🚀 Your MTO Maintenance Dashboard is now ready with real data from your spreadsheet!
    `);

  } catch (error) {
    console.error('❌ Error populating database:', error);
  }
};

// Routes
app.get('/populate', async (req, res) => {
  try {
    await populateDatabase();
    res.json({ message: 'Database populated successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const equipmentCount = await Equipment.countDocuments();
    const driversCount = await Driver.countDocuments();
    const maintenanceCount = await Maintenance.countDocuments();
    
    res.json({
      equipment: equipmentCount,
      drivers: driversCount,
      maintenanceTasks: maintenanceCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Import your existing routes
const equipmentRouter = require('./routes/equipment');
const maintenanceRouter = require('./routes/maintenance');
const driversRouter = require('./routes/drivers');

app.use('/equipment', equipmentRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/drivers', driversRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`
🚀 MTO Maintenance Dashboard Server running on port: ${port}

📊 To populate database with your vehicle data:
   GET http://localhost:${port}/populate

📈 To check database stats:
   GET http://localhost:${port}/stats

💻 Frontend running on: http://localhost:5173
    `);
});

module.exports = app;