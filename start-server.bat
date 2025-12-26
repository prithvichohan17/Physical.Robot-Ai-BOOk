@echo off
echo Starting Physical AI Book Assistant Server...
echo.

REM Check if node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo npm is not installed. Please install Node.js which includes npm.
    pause
    exit /b 1
)

echo Installing dependencies...
npm install

echo.
echo Starting the server...
node server.js

pause