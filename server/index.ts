// Deployment-aware server entry point
// This file automatically detects deployment context and runs appropriate mode
// Solves the issue where .replit deployment uses 'npm run dev'

import { execSync } from 'child_process';
import { existsSync } from 'fs';

// Detect if we're in a deployment environment
// In deployments: REPL_ID exists but REPL_OWNER is undefined
const isDeployment = process.env.REPL_ID && !process.env.REPL_OWNER;

// Also check for explicit deployment flags
const hasDeploymentFlag = process.env.DEPLOYMENT === 'true' || 
                         process.env.REPLIT_DEPLOYMENT === 'true';

// If we detect deployment, override to production mode
if (isDeployment || hasDeploymentFlag) {
  console.log('🚀 DEPLOYMENT DETECTED - Forcing PRODUCTION mode');
  console.log('📌 Environment: REPL_ID=' + process.env.REPL_ID);
  console.log('📌 REPL_OWNER=' + (process.env.REPL_OWNER || 'undefined'));
  
  // Force production environment
  process.env.NODE_ENV = 'production';
  
  // Ensure production build exists
  if (!existsSync('dist/index-main.js')) {
    console.log('📦 Building application for production deployment...');
    try {
      execSync('./build.sh', { stdio: 'inherit' });
      console.log('✅ Production build complete');
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  } else {
    console.log('✅ Using existing production build');
  }
  
  // Start production server
  console.log('🌐 Starting PRODUCTION server...');
  console.log('🔒 NODE_ENV=' + process.env.NODE_ENV);
  import('../dist/index-main.js');
} else {
  // Development mode - run the main development server
  console.log('🔧 Running in DEVELOPMENT mode');
  import('./index-main.js');
}