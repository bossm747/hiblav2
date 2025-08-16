// Production Override Script
// This ensures the app ALWAYS runs in production mode when deployed

// If we detect we're in a deployment environment, force production mode
if (process.env.REPL_ID && !process.env.REPL_OWNER) {
  console.log('🚀 Deployment detected - Forcing PRODUCTION mode');
  process.env.NODE_ENV = 'production';
  
  // Run the production build and start
  const { execSync } = require('child_process');
  
  try {
    console.log('📦 Building for production...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('🌐 Starting production server...');
    require('../dist/index.js');
  } catch (error) {
    console.error('❌ Production startup failed:', error.message);
    process.exit(1);
  }
} else {
  // Regular development mode
  require('./index.js');
}