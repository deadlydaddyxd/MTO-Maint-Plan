const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
require('dotenv').config();

// Default users with role-based accounts
const defaultUsers = [
  {
    username: 'co_admin',
    email: 'co@mto.mil',
    password: 'CO@2024!',
    firstName: 'John',
    lastName: 'Commander',
    rank: 'Colonel',
    serviceNumber: 'MTO001',
    role: 'Commanding Officer',
    unit: 'MTO Headquarters',
    location: 'Main Base',
    phoneNumber: '+1-555-0001',
    isActive: true
  },
  {
    username: 'transport_officer',
    email: 'transport.officer@mto.mil',
    password: 'TO@2024!',
    firstName: 'Michael',
    lastName: 'Transport',
    rank: 'Major',
    serviceNumber: 'MTO002',
    role: 'Transport Officer',
    unit: 'Transport Division',
    location: 'Transport Base',
    phoneNumber: '+1-555-0002',
    isActive: true
  },
  {
    username: 'maint_officer',
    email: 'maint.officer@mto.mil',
    password: 'MO@2024!',
    firstName: 'David',
    lastName: 'Maintenance',
    rank: 'Major',
    serviceNumber: 'MTO003',
    role: 'Maintenance Officer',
    unit: 'Maintenance Division',
    location: 'Workshop Area',
    phoneNumber: '+1-555-0003',
    isActive: true
  },
  {
    username: 'transport_jco',
    email: 'transport.jco@mto.mil',
    password: 'TJCO@2024!',
    firstName: 'Robert',
    lastName: 'TransJCO',
    rank: 'Warrant Officer',
    serviceNumber: 'MTO004',
    role: 'Transport JCO',
    unit: 'Transport Division',
    location: 'Transport Base',
    phoneNumber: '+1-555-0004',
    isActive: true
  },
  {
    username: 'maint_jco',
    email: 'maint.jco@mto.mil',
    password: 'MJCO@2024!',
    firstName: 'James',
    lastName: 'MaintJCO',
    rank: 'Warrant Officer',
    serviceNumber: 'MTO005',
    role: 'Maintenance JCO',
    unit: 'Maintenance Division',
    location: 'Workshop Area',
    phoneNumber: '+1-555-0005',
    isActive: true
  }
];

const seedUsers = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    console.log('🗑️  Clearing existing users...');
    
    // Clear existing users (optional - remove this if you want to keep existing users)
    await User.deleteMany({});
    console.log('✅ Existing users cleared');
    
    console.log('👥 Creating default users...');
    
    // Create default users
    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { username: userData.username },
            { email: userData.email }
          ]
        });
        
        if (existingUser) {
          console.log(`⚠️  User ${userData.username} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create user
        const user = new User({
          ...userData,
          password: hashedPassword,
          createdAt: new Date(),
          lastLogin: null,
          loginAttempts: 0,
          isLocked: false
        });
        
        await user.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        
      } catch (userError) {
        console.error(`❌ Failed to create user ${userData.username}:`, userError.message);
      }
    }
    
    console.log('\n🎉 User seeding completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('═'.repeat(60));
    
    defaultUsers.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase().replace('_', ' ')}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Email: ${user.email}`);
      console.log('─'.repeat(40));
    });
    
    console.log('\n🔐 Use these credentials to log into the system');
    console.log('🚀 Start with CO Admin account for full system access');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeder
if (require.main === module) {
  console.log('🌱 Starting user seeding process...');
  seedUsers();
}

module.exports = { seedUsers, defaultUsers };