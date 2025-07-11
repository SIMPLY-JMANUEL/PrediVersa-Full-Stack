@echo off
echo ===============================================
echo 🖥️ STARTING FRONTEND ONLY - PrediVersa
echo ===============================================
echo.
cd /d frontend
echo Current directory: %CD%
echo.
echo Checking if react-scripts is installed...
if exist "node_modules\.bin\react-scripts.cmd" (
    echo ✅ react-scripts found
) else (
    echo ❌ react-scripts not found
    pause
    exit
)
echo.
echo Starting frontend with react-scripts 4.0.3...
echo ===============================================
set BROWSER=none
set FORCE_COLOR=true
set NODE_OPTIONS=--openssl-legacy-provider
npm start
pause
