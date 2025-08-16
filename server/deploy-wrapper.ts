// Deployment wrapper that ensures production mode
// This file intercepts deployment attempts and forces production mode

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if we're running in Replit deployment context
const isDeployment = process.env.REPL_ID && !process.env.REPL_OWNER;
const forceProduction = process.argv.includes('--production') || isDeployment;

if (forceProduction || process.env.NODE_ENV === 'production') {
  console.log('🚀 Running in PRODUCTION mode');
  
  // Force production environment
  process.env.NODE_ENV = 'production';
  
  // Check if dist exists
  const distPath = path.join(process.cwd(), 'dist', 'index.js');
  
  if (!existsSync(distPath)) {
    console.log('📦 Building application first...');
    
    // Run build
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      shell: true
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Build complete, starting server...');
        // Import and run the production server
        import('../dist/index.js');
      } else {
        console.error('❌ Build failed');
        process.exit(1);
      }
    });
  } else {
    // Directly run the production server
    import('../dist/index.js');
  }
} else {
  // Run development server
  console.log('🔧 Running in DEVELOPMENT mode');
  import('./index.js');
}