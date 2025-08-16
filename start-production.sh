#!/bin/bash

# Production startup script for Replit deployment
# This script ensures the application runs in production mode

echo "Starting Hibla Manufacturing System in production mode..."

# Set production environment
export NODE_ENV=production

# Build the application if dist folder doesn't exist
if [ ! -d "dist" ]; then
  echo "Building application..."
  npm run build
fi

# Start the production server
echo "Starting production server..."
npm start