@echo off
REM Cretip App - Quick Start Script (Windows)
REM This script sets up and runs the entire local environment

echo.
echo 🚀 Cretip App - Local Environment Setup
echo ========================================
echo.

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js installed
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   Version: %NODE_VERSION%
echo.

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found.
    pause
    exit /b 1
)
echo ✓ npm installed
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo   Version: %NPM_VERSION%
echo.

echo Installing dependencies...
echo.

REM Backend setup
echo Setting up backend...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed
echo.

REM Frontend setup
echo Setting up frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo ✅ Setup complete!
echo.
echo To start the application:
echo.
echo Option 1: Run all services together:
echo   npm run dev
echo.
echo Option 2: Run services separately:
echo.
echo Terminal 1 - Backend:
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo For more details, see SETUP.md
echo.
pause
