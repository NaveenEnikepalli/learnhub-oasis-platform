
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Setting up LearnHub MERN Stack Application...\n');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { 
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit' 
  });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup complete! You can now start the application with:');
console.log('   node start.js');
console.log('\nOr start services separately:');
console.log('   Backend:  cd backend && npm run dev');
console.log('   Frontend: npm run dev');
