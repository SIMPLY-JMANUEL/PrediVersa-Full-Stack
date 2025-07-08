@echo off
echo ===============================================
echo 🧪 PrediVersa Test Suite
echo ===============================================
echo.
echo Ejecutando tests del proyecto...
echo.

echo 🔧 Testing Backend...
start "Backend Tests" cmd /k "cd /d backend && echo === BACKEND TESTS === && npm test"

timeout /t 2

echo 🖥️ Testing Frontend...
start "Frontend Tests" cmd /k "cd /d frontend && echo === FRONTEND TESTS === && npm test"

echo.
echo ✅ Tests iniciados en ventanas separadas
echo.
pause
