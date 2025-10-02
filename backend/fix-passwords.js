const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user.model');
require('dotenv').config();

const fixCoAdminPassword = async () => {
  try {
    console.log('🔧 Fixing CO Admin password...\n');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://umernusratjaved_db_user:WGlc4xHOKBDdmdIa@maint-data-cluster.2uboyxj.mongodb.net/?retryWrites=true&w=majority&appName=maint-data-cluster";
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find CO Admin user
    const coAdmin = await User.findOne({ username: 'co_admin' });
    
    if (!coAdmin) {
      console.log('❌ CO Admin user not found');
      return;
    }
    
    // Hash the correct password
    console.log('🔐 Hashing new password: CO@2024!');
    const saltRounds = 12;
    const newPassword = 'CO@2024!';
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    console.log('📝 New password hash length:', hashedPassword.length);
    
    // Update the password
    await User.updateOne(
      { username: 'co_admin' },
      { password: hashedPassword }
    );
    
    console.log('✅ CO Admin password updated');
    
    // Verify the update
    const updatedUser = await User.findOne({ username: 'co_admin' });
    const isValidPassword = await bcrypt.compare(newPassword, updatedUser.password);
    
    console.log('🧪 Password verification test:', isValidPassword ? '✅ PASS' : '❌ FAIL');
    
    // Update all other users too to be safe
    console.log('\n🔄 Updating all user passwords...');
    
    const userUpdates = [
      { username: 'transport_officer', password: 'TO@2024!' },
      { username: 'maint_officer', password: 'MO@2024!' },
      { username: 'transport_jco', password: 'TJCO@2024!' },
      { username: 'maint_jco', password: 'MJCO@2024!' }
    ];
    
    for (const update of userUpdates) {
      const hashedPwd = await bcrypt.hash(update.password, saltRounds);
      await User.updateOne(
        { username: update.username },
        { password: hashedPwd }
      );
      console.log(`✅ Updated password for: ${update.username}`);
    }
    
    console.log('\n🎉 All passwords updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
};

fixCoAdminPassword();