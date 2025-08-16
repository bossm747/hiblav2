
#!/bin/bash
echo "🚀 Starting Hibla Manufacturing System for deployment..."

# Set production environment
export NODE_ENV=production

# Build the React application first
echo "📦 Building React application..."
npm run build

# Start the server with optimized settings
echo "🌐 Starting production server..."
node server/index.js
