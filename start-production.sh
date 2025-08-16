
#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting Hibla Manufacturing System in production mode..."

# Set production environment
export NODE_ENV=production
export PORT=5000

# Ensure we're binding to all interfaces for deployment
export HOST=0.0.0.0

# Add any additional environment variables here if needed
# export DATABASE_URL="your_production_db_url"

echo "📦 Environment: $NODE_ENV"
echo "🌐 Port: $PORT"
echo "🖥️  Host: $HOST"

# Start the production server
echo "🎯 Starting server..."
node dist/index.js
