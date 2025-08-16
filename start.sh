#!/bin/bash

# Production start script
echo "🚀 Starting Hibla Manufacturing System in production..."

# Set production environment
export NODE_ENV=production

# Build if dist doesn't exist
if [ ! -f "dist/index.js" ]; then
  echo "📦 Building application first..."
  ./build.sh
fi

# Start production server
echo "🌐 Starting production server..."
node dist/index.js