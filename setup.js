
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up LearnHub Backend...\n');

try {
  // Create backend directory if it doesn't exist
  if (!fs.existsSync('backend')) {
    console.log('📁 Creating backend directory...');
    fs.mkdirSync('backend');
  }

  // Create uploads directory
  const uploadsDir = path.join('backend', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('📁 Creating uploads directory...');
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Install backend dependencies
  console.log('📦 Installing backend dependencies...');
  process.chdir('backend');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Backend dependencies installed successfully!\n');
  } catch (error) {
    console.error('❌ Failed to install backend dependencies:', error.message);
    process.exit(1);
  }

  // Go back to root directory
  process.chdir('..');

  console.log('🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: node start.js');
  console.log('2. Open your browser to: http://localhost:5173');
  console.log('3. The backend API will be available at: http://localhost:5000\n');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
