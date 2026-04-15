#!/bin/bash

# Legal Tech Dashboard - Setup and Run Script
# This script will install dependencies and start both backend and frontend

echo "🚀 Legal Tech Dashboard - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed"
fi

echo ""
echo "✅ Backend setup complete"
echo ""

# Setup Frontend
cd ../frontend
echo "📦 Setting up Frontend..."

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

echo ""
echo "✅ Frontend setup complete"
echo ""

echo "======================================"
echo "🎉 Setup Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Open Terminal 1 and run:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Open Terminal 2 and run:"
echo "   cd frontend && npm start"
echo ""
echo "3. Backend will run on: http://localhost:5000"
echo "4. Frontend will run on: http://localhost:3000"
echo ""
echo "📌 Note: Make sure MongoDB is running!"
echo ""
