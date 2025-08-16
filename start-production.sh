
#!/bin/bash

# Production startup script for Hibla Manufacturing System
echo "Starting Hibla Manufacturing System in production mode..."

# Set production environment
export NODE_ENV=production
export PORT=5000

# Ensure dependencies are installed
echo "Installing dependencies..."
npm ci --production

# Build the application
echo "Building application..."
npm run build

# Start the server
echo "Starting server..."
node server/index.js
