#!/bin/bash
# Build script for Render deployment

set -e  # Exit on error

echo "Current directory: $(pwd)"
echo "Listing directories:"
ls -la

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "Installing Node.js dependencies..."
if [ -d "frontend" ]; then
    cd frontend
    npm ci
    echo "Building React app..."
    npm run build
    cd ..
else
    echo "ERROR: frontend directory not found!"
    exit 1
fi

echo "Collecting static files..."
python backend/manage.py collectstatic --noinput

echo "Running migrations..."
python backend/manage.py migrate --noinput

echo "Build complete!"
