#!/usr/bin/env node

/**
 * Email Notification System Test Script
 * 
 * This script tests the email notification system to ensure it's working correctly.
 * Run with: node test-email-system.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';

// Test cases
const testCases = [
  {
    name: 'System Alert',
    type: 'SYSTEM',
    expectedSubject: 'System Alert - Square One Rentals'
  },
  {
    name: 'Newsletter',
    type: 'NEWSLETTER', 
    expectedSubject: 'Newsletter - Square One Rentals'
  },
  {
    name: 'Special Offer',
    type: 'MARKETING',
    expectedSubject: 'Special Offer - Square One Rentals'
  },
  {
    name: 'Payment Notification',
    type: 'PAYMENT',
    expectedSubject: 'Payment Notification - Square One Rentals'
  },
  {
    name: 'Welcome Message',
    type: 'WELCOME',
    expectedSubject: 'Welcome to Square One Rentals'
  }
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testNotification(type, email) {
  const url = `${BASE_URL}/api/test-notification?email=${encodeURIComponent(email)}&type=${type}`;
  
  try {
    const response = await makeRequest(url);
    return response;
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function testEmailConfig(email) {
  const url = `${BASE_URL}/api/test-email-config?email=${encodeURIComponent(email)}`;
  
  try {
    const response = await makeRequest(url);
    return response;
  } catch (error) {
    return { status: 0, error: error.message };
  }
}

async function runTests() {
  log('🧪 Email Notification System Test', 'bold');
  log('=====================================', 'blue');
  log('');
  
  // Test 1: Check if server is running
  log('1. Testing server connectivity...', 'yellow');
  try {
    const response = await makeRequest(`${BASE_URL}/api/test-notification?email=test@example.com&type=SYSTEM`);
    if (response.status > 0) {
      log('✅ Server is running and responding', 'green');
    } else {
      log('❌ Server is not responding', 'red');
      return;
    }
  } catch (error) {
    log('❌ Cannot connect to server', 'red');
    log(`   Make sure the server is running at ${BASE_URL}`, 'yellow');
    return;
  }
  
  log('');
  
  // Test 2: Check email configuration
  log('2. Testing email configuration...', 'yellow');
  const configResponse = await testEmailConfig(TEST_EMAIL);
  if (configResponse.status === 200 && configResponse.data.success) {
    log('✅ Email configuration is working', 'green');
  } else {
    log('⚠️  Email configuration may have issues', 'yellow');
    if (configResponse.data) {
      log(`   Details: ${JSON.stringify(configResponse.data)}`, 'yellow');
    }
  }
  
  log('');
  
  // Test 3: Test each notification type
  log('3. Testing notification types...', 'yellow');
  log('');
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  for (const testCase of testCases) {
    log(`   Testing ${testCase.name}...`, 'blue');
    
    const response = await testNotification(testCase.type, TEST_EMAIL);
    
    if (response.status === 200 && response.data.success) {
      log(`   ✅ ${testCase.name} - PASSED`, 'green');
      passedTests++;
    } else {
      log(`   ❌ ${testCase.name} - FAILED`, 'red');
      if (response.data && response.data.error) {
        log(`      Error: ${response.data.error}`, 'red');
      }
    }
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  log('');
  log('📊 Test Results', 'bold');
  log('===============', 'blue');
  log(`Passed: ${passedTests}/${totalTests}`, passedTests === totalTests ? 'green' : 'yellow');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! Email system is working correctly.', 'green');
  } else {
    log('⚠️  Some tests failed. Check the configuration and try again.', 'yellow');
  }
  
  log('');
  log('📝 Next Steps:', 'bold');
  log('1. Check your email inbox for test messages', 'blue');
  log('2. Verify email templates look correct', 'blue');
  log('3. Test with real user accounts', 'blue');
  log('4. Monitor email delivery rates', 'blue');
}

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    log(`❌ Test failed with error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { runTests, testNotification, testEmailConfig };
