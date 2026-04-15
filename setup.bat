@echo off
REM Legal Tech Dashboard - Windows Setup and Run Script

echo.
echo 🚀 Legal Tech Dashboard - Setup Script
echo ======================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Setup Verified - Continuing...
echo.

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

echo ✅ Backend setup complete
echo.

REM Setup Frontend
cd ..\frontend
echo 📦 Setting up Frontend...

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

echo ✅ Frontend setup complete
echo.

echo ======================================
echo 🎉 Setup Complete!
echo ======================================
echo.
echo To start the application:
echo.
echo 1. Open PowerShell/Command Prompt Tab 1 and run:
echo    cd backend
echo    npm run dev
echo.
echo 2. Open PowerShell/Command Prompt Tab 2 and run:
echo    cd frontend
echo    npm start
echo.
echo 3. Backend will run on: http://localhost:5000
echo 4. Frontend will run on: http://localhost:3000
echo.
echo 📌 Note: Make sure MongoDB is running!
echo.
pause
