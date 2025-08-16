#!/bin/bash
cd "$(dirname "$0")"
export NODE_ENV=production
node --experimental-modules dist/index-main.js