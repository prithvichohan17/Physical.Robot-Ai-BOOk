// Test script to verify the Physical AI Assistant server is working correctly
const http = require('http');

console.log('Testing Physical AI Assistant server endpoints...\n');

const baseUrl = 'http://localhost:5000';

// Test endpoints
const endpoints = [
  { method: 'GET', path: '/', desc: 'Main endpoint' },
  { method: 'GET', path: '/api/robot/status', desc: 'Robot status' },
  { method: 'GET', path: '/api/ai', desc: 'AI routes base (should 404)' },
  { method: 'GET', path: '/api/book-knowledge', desc: 'Book knowledge routes base (should 404)' },
  { method: 'GET', path: '/nonexistent', desc: 'Non-existent path (should 404)' }
];

let completedRequests = 0;

endpoints.forEach((endpoint, index) => {
  setTimeout(() => {
    const url = new URL(endpoint.path, baseUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 5000,
      path: url.pathname + url.search,
      method: endpoint.method
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✓ ${endpoint.desc}: ${res.statusCode} ${res.statusMessage}`);
        if (data) {
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.message && jsonData.message.includes('Route not found')) {
              console.log(`  Available routes: ${jsonData.availableRoutes ? jsonData.availableRoutes.length : 'N/A'}`);
            }
          } catch (e) {
            console.log(`  Response: ${data.substring(0, 100)}...`);
          }
        }
        console.log('');
        
        completedRequests++;
        if (completedRequests === endpoints.length) {
          console.log('Testing completed. If you still have 404 errors:');
          console.log('1. Make sure the server is running: npm run dev');
          console.log('2. Access endpoints with correct /api/ prefix');
          console.log('3. Use correct HTTP methods (GET/POST)');
          console.log('4. Check your request body format for POST requests');
        }
      });
    });

    req.on('error', (e) => {
      console.error(`✗ ${endpoint.desc}: Error - ${e.message}`);
      completedRequests++;
    });

    req.end();
  }, index * 300); // Stagger requests
});

console.log('Note: This test assumes the server is running on port 5000.\n');