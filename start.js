
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting LearnHub Application...\n');

// Check if backend directory exists
if (!fs.existsSync('backend')) {
  console.error('❌ Backend directory not found. Please run setup.js first.');
  process.exit(1);
}

// Start backend server
console.log('📦 Starting backend server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Start frontend dev server
console.log('🌐 Starting frontend dev server...');
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

backend.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('❌ Frontend error:', err);
});

console.log('\n✅ Both servers starting...');
console.log('📖 Backend API: http://localhost:5000');
console.log('🌐 Frontend: http://localhost:5173');
console.log('\n📝 Check the terminal output above for any errors.');
console.log('🔄 Use Ctrl+C to stop both servers.\n');
