const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('./models/user.model');

const testDatabaseConnection = async () => {
  try {
    console.log('🔍 Testing database connection and user data...\n');
    
    // Connect to MongoDB using the same URI as the seeder
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://umernusratjaved_db_user:WGlc4xHOKBDdmdIa@maint-data-cluster.2uboyxj.mongodb.net/?retryWrites=true&w=majority&appName=maint-data-cluster";
    
    console.log('📍 Connecting to MongoDB...');
    console.log('🔗 URI (masked):', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Check if users exist
    console.log('👥 Checking users in database...');
    const users = await User.find({}, 'username email role createdAt').lean();
    
    console.log(`📊 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username}, Email: ${user.email}, Role: ${user.role}`);
    });
    
    // Test specific user lookup
    console.log('\n🔍 Testing CO Admin lookup...');
    const coAdmin = await User.findOne({ 
      $or: [
        { username: 'co_admin' },
        { email: 'co_admin' }
      ]
    });
    
    if (coAdmin) {
      console.log('✅ CO Admin user found:');
      console.log('   Username:', coAdmin.username);
      console.log('   Email:', coAdmin.email);
      console.log('   Role:', coAdmin.role);
      console.log('   Password Hash Length:', coAdmin.password.length);
      console.log('   Created:', coAdmin.createdAt);
    } else {
      console.log('❌ CO Admin user NOT found');
    }
    
    // Test password verification
    if (coAdmin) {
      const bcrypt = require('bcryptjs');
      console.log('\n🔐 Testing password verification...');
      const isValidPassword = await bcrypt.compare('CO@2024!', coAdmin.password);
      console.log('Password "CO@2024!" matches:', isValidPassword ? '✅ YES' : '❌ NO');
      
      // Test other possible passwords
      const testPasswords = ['CO@2024!', 'co123', 'admin', 'CO123', 'co_admin'];
      console.log('\n🧪 Testing various passwords:');
      for (const pwd of testPasswords) {
        const matches = await bcrypt.compare(pwd, coAdmin.password);
        console.log(`   "${pwd}": ${matches ? '✅' : '❌'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

testDatabaseConnection();