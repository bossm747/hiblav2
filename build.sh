#!/bin/bash

# Production build script that avoids ESBuild conflicts
echo "🔨 Starting production build..."

# Clean dist directory first
rm -rf dist

# Build frontend with Vite
echo "📦 Building frontend with Vite..."
npx vite build

# Build backend with ESBuild - output to dist/server.js to avoid conflict
echo "📦 Building backend with ESBuild..."
npx esbuild server/index-main.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js

echo "✅ Build complete!"