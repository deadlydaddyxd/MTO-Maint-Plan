const axios = require('axios');

// Test the updated CORS configuration
const testCORS = async () => {
  console.log('🔍 Testing CORS configuration after Railway deployment...\n');
  
  const baseURL = 'https://veh-maint-app-production.up.railway.app/api';
  
  // Simulate a request from the Vercel preview domain
  try {
    console.log('1️⃣ Testing basic connectivity...');
    const response = await axios.get(baseURL + '/auth/validate', {
      headers: {
        'Origin': 'https://mto-maint-plan-br62q6xhh-umer-javeds-projects-2a2ac580.vercel.app'
      }
    });
    console.log('✅ API is accessible');
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('✅ Expected response:', error.response.data);
    } else {
      console.log('❌ Connection issue:', error.message);
    }
  }
  
  console.log('\n2️⃣ Testing login with CO credentials...');
  try {
    const loginResponse = await axios.post(baseURL + '/auth/login', {
      identifier: 'co_admin',
      password: 'CO@2024!'
    }, {
      headers: {
        'Origin': 'https://mto-maint-plan-br62q6xhh-umer-javeds-projects-2a2ac580.vercel.app'
      }
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

// Wait a bit for Railway to deploy, then test
setTimeout(testCORS, 10000);