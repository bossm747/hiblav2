
#!/bin/bash

# Production build script
echo "🔨 Starting production build..."

# Clean dist directory first
rm -rf dist

# Build frontend with Vite
echo "📦 Building frontend with Vite..."
npx vite build

# Build backend with ESBuild - using the main server file
echo "📦 Building backend with ESBuild..."
npx esbuild server/index-main.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "✅ Build complete!"
