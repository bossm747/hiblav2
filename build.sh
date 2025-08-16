#!/bin/bash

# Production build script
echo "🔨 Starting production build..."

# Clean dist directory first
rm -rf dist

# Build frontend with Vite
echo "📦 Building frontend with Vite..."
npx vite build

# Build backend with ESBuild - output to dist/index.js for npm start compatibility
echo "📦 Building backend with ESBuild..."
npx esbuild server/index-main.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

echo "✅ Build complete!"