#!/usr/bin/env node

// Deployment entry point - Always runs in production mode
// This script ensures proper production deployment on Replit

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

console.log('🚀 Starting Hibla Manufacturing System Deployment...');

// Force production environment
process.env.NODE_ENV = 'production';

// Check if build exists
const distPath = path.join(process.cwd(), 'dist');
const distExists = existsSync(distPath);

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { 
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function deploy() {
  try {
    // Build if needed
    if (!distExists) {
      console.log('📦 Building application for production...');
      await runCommand('npm', ['run', 'build']);
      console.log('✅ Build complete');
    } else {
      console.log('✅ Using existing build');
    }
    
    // Start production server
    console.log('🌐 Starting production server...');
    await runCommand('node', ['dist/index.js']);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Start deployment
deploy();