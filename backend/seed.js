const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./models/user.model');
const Driver = require('./models/driver.model');

const sampleUsers = [
  {
    username: 'admin.co',
    email: 'co@mto.mil.pk',
    password: 'admin123',
    firstName: 'Ahmed',
    lastName: 'Khan',
    rank: 'Colonel',
    serviceNumber: 'PA-12345',
    role: 'Commanding Officer',
    unit: 'MTO Battalion',
    location: 'Rawalpindi',
    phoneNumber: '+92300-1234567'
  },
  {
    username: 'transport.officer',
    email: 'transport@mto.mil.pk', 
    password: 'admin123',
    firstName: 'Muhammad',
    lastName: 'Ali',
    rank: 'Major',
    serviceNumber: 'PA-23456',
    role: 'Transport Officer',
    unit: 'MTO Battalion',
    location: 'Rawalpindi',
    phoneNumber: '+92300-2345678'
  },
  {
    username: 'maintenance.officer',
    email: 'maintenance@mto.mil.pk',
    password: 'admin123', 
    firstName: 'Asif',
    lastName: 'Ahmad',
    rank: 'Major',
    serviceNumber: 'PA-34567',
    role: 'Maintenance Officer',
    unit: 'MTO Battalion',
    location: 'Rawalpindi',
    phoneNumber: '+92300-3456789'
  },
  {
    username: 'transport.jco',
    email: 'tjco@mto.mil.pk',
    password: 'admin123',
    firstName: 'Tariq',
    lastName: 'Mahmood', 
    rank: 'Subedar',
    serviceNumber: 'PA-45678',
    role: 'Transport JCO',
    unit: 'MTO Battalion',
    location: 'Rawalpindi',
    phoneNumber: '+92300-4567890'
  },
  {
    username: 'maintenance.jco',
    email: 'mjco@mto.mil.pk',
    password: 'admin123',
    firstName: 'Qamar',
    lastName: 'Hussain',
    rank: 'Subedar',
    serviceNumber: 'PA-56789',
    role: 'Maintenance JCO', 
    unit: 'MTO Battalion',
    location: 'Rawalpindi',
    phoneNumber: '+92300-5678901'
  }
];

const sampleDrivers = [
  {
    personalInfo: {
      firstName: 'Muhammad',
      lastName: 'Rashid',
      contactNumber: '+92300-7777777',
      email: 'rashid@mto.mil.pk'
    },
    serviceInfo: {
      serviceNumber: 'DR-001',
      rank: 'Sepoy',
      unit: 'MTO Battalion'
    }
  },
  {
    personalInfo: {
      firstName: 'Ahmad',
      lastName: 'Hassan',
      contactNumber: '+92300-8888888',
      email: 'hassan@mto.mil.pk'
    },
    serviceInfo: {
      serviceNumber: 'DR-002',
      rank: 'Lance Corporal',
      unit: 'MTO Battalion'
    }
  },
  {
    personalInfo: {
      firstName: 'Ali',
      lastName: 'Raza',
      contactNumber: '+92300-9999999',
      email: 'raza@mto.mil.pk'
    },
    serviceInfo: {
      serviceNumber: 'DR-003', 
      rank: 'Corporal',
      unit: 'MTO Battalion'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.ATLAS_URI || 'mongodb://localhost:27017/mto-maintenance');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Driver.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.username}`);
    }

    // Create drivers  
    for (const driverData of sampleDrivers) {
      const driver = new Driver(driverData);
      await driver.save();
      console.log(`Created driver: ${driver.personalInfo.firstName} ${driver.personalInfo.lastName}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Test Users Created:');
    console.log('Username: admin.co | Password: admin123 | Role: Commanding Officer');
    console.log('Username: transport.officer | Password: admin123 | Role: Transport Officer');
    console.log('Username: maintenance.officer | Password: admin123 | Role: Maintenance Officer'); 
    console.log('Username: transport.jco | Password: admin123 | Role: Transport JCO');
    console.log('Username: maintenance.jco | Password: admin123 | Role: Maintenance JCO');
    console.log('\n🚗 Test Drivers Created:');
    console.log('DR-001: Muhammad Rashid (Sepoy)');
    console.log('DR-002: Ahmad Hassan (Lance Corporal)');
    console.log('DR-003: Ali Raza (Corporal)');

  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };