// Script to build the Docusaurus book site
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

function buildBookSite() {
  const bookSitePath = path.join(__dirname, 'book', 'book-site');
  
  // Check if package.json exists in the book site directory
  const packageJsonPath = path.join(bookSitePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('Error: package.json not found in book/book-site directory');
    console.error('Make sure you have a Docusaurus site set up in book/book-site');
    process.exit(1);
  }

  console.log('Building Docusaurus book site...');
  
  const buildProcess = exec('npm run build', { cwd: bookSitePath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Build failed: ${error}`);
      console.error(stderr);
      process.exit(1);
    }
    
    console.log('Build completed successfully!');
    console.log(stdout);
    
    // Copy the build to a public directory if needed
    console.log('Book site built successfully and available for serving.');
  });

  buildProcess.stdout.on('data', (data) => {
    console.log(data);
  });

  buildProcess.stderr.on('data', (data) => {
    console.error(data);
  });
}

// Run the build
buildBookSite();