/**
 * Test script to verify error handling functionality in Physical AI Book Assistant
 */

const axios = require('axios');

console.log('Testing Physical AI Book Assistant Error Handling...\n');

// Test the Qwen AI Assistant error handling
async function testQwenErrorHandling() {
  console.log('Testing Qwen AI Assistant (port 3000) error handling...\n');
  
  try {
    // Test with missing API key by temporarily removing it
    console.log('1. Testing with no question provided (should return 400):');
    try {
      const response = await axios.post('http://localhost:3000/api/chat', {});
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
    
    console.log('\n2. Testing with a question (will show error if API key not set):');
    try {
      const response = await axios.post('http://localhost:3000/api/chat', {
        question: "What is Physical AI?"
      });
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
  } catch (error) {
    console.log('   Error connecting to Qwen AI Assistant:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Test the Physical AI Assistant error handling
async function testPhysicalAIErrorHandling() {
  console.log('Testing Physical AI Assistant (port 5000) error handling...\n');
  
  try {
    // Test with missing API key by temporarily removing it
    console.log('3. Testing /api/ai/chat endpoint with no text provided (should return 400):');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {});
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
    
    console.log('\n4. Testing /api/ai/chat endpoint with a question (will show error if API key not set):');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        question: "What is Physical AI?"
      });
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
    
    console.log('\n5. Testing /api/ai/ask-book-question endpoint (will show error if API key not set):');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/ask-book-question', {
        question: "What is Physical AI?"
      });
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
    
    console.log('\n6. Testing /api/ai/process-command endpoint (will show error if API key not set):');
    try {
      const response = await axios.post('http://localhost:5000/api/ai/process-command', {
        userInput: "Move forward"
      });
      console.log('   Response:', response.data);
    } catch (error) {
      if (error.response) {
        console.log('   Status:', error.response.status);
        console.log('   Response:', error.response.data);
      }
    }
  } catch (error) {
    console.log('   Error connecting to Physical AI Assistant:', error.message);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run tests
async function runTests() {
  console.log('Starting error handling tests...\n');
  
  await testQwenErrorHandling();
  await testPhysicalAIErrorHandling();
  
  console.log('Error handling tests completed.');
  console.log('\nExpected behaviors:');
  console.log('- When API key is missing: "⚠️ The AI service is currently busy or has reached its usage limit. Please try again later."');
  console.log('- When server is unavailable: "⚠️ Sorry! The Physical AI Assistant is temporarily unavailable due to a server issue. Please wait a moment and try again. If the problem continues, the AI service may be restarting."');
}

// Run the tests
runTests().catch(console.error);