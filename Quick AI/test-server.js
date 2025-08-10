// Simple test script to verify server endpoints
const BASE_URL = 'http://localhost:3000';

// Test 1: Basic server health check
async function testServerHealth() {
    try {
        const response = await fetch(`${BASE_URL}/health`);
        const data = await response.json();
        console.log('✅ Server Health Check:', data);
        return true;
    } catch (error) {
        console.error('❌ Server Health Check failed:', error.message);
        return false;
    }
}

// Test 2: Basic server response
async function testServerRoot() {
    try {
        const response = await fetch(`${BASE_URL}/`);
        const data = await response.json();
        console.log('✅ Server Root Response:', data);
        return true;
    } catch (error) {
        console.error('❌ Server Root failed:', error.message);
        return false;
    }
}

// Test 3: Protected route (should fail without auth)
async function testProtectedRoute() {
    try {
        const response = await fetch(`${BASE_URL}/api/ai/dashboard`);
        console.log('✅ Protected Route Status:', response.status, '(Expected: 401 Unauthorized)');
        return response.status === 401;
    } catch (error) {
        console.error('❌ Protected Route test failed:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting Server Tests...\n');
    
    const results = [];
    results.push(await testServerHealth());
    results.push(await testServerRoot());
    results.push(await testProtectedRoute());
    
    const passedTests = results.filter(Boolean).length;
    const totalTests = results.length;
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All server tests passed! Backend is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the server configuration.');
    }
}

// Run the tests
runTests();
