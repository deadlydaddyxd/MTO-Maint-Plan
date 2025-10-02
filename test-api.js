const axios = require('axios');

// Test API endpoints
const testAPI = async () => {
  console.log('🔍 Testing API endpoints...\n');
  
  const baseURL = 'https://veh-maint-app-production.up.railway.app/api';
  
  try {
    // Test 1: Basic connectivity
    console.log('1️⃣ Testing basic connectivity...');
    const healthCheck = await axios.get(baseURL + '/auth/validate');
    console.log('❌ Expected: Should fail with "No session ID provided"');
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('✅ Response:', error.response.data);
    } else {
      console.log('❌ Connection failed:', error.message);
    }
  }
  
  try {
    // Test 2: Login attempt
    console.log('\n2️⃣ Testing login endpoint...');
    const loginResponse = await axios.post(baseURL + '/auth/login', {
      identifier: 'co_admin',
      password: 'CO@2024!'
    });
    console.log('✅ Login successful:', loginResponse.data);
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('❌ Login failed:', error.response.data);
    } else {
      console.log('❌ Login request failed:', error.message);
    }
  }
  
  try {
    // Test 3: Test with different credentials
    console.log('\n3️⃣ Testing with Transport Officer credentials...');
    const loginResponse = await axios.post(baseURL + '/auth/login', {
      identifier: 'transport_officer',
      password: 'TO@2024!'
    });
    console.log('✅ Login successful:', loginResponse.data);
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('❌ Login failed:', error.response.data);
    } else {
      console.log('❌ Login request failed:', error.message);
    }
  }
};

testAPI();