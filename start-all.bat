@echo off
echo ===============================================
echo 🔋 POWER CELL - PrediVersa Full Stack Startup
echo ===============================================
echo.
echo Iniciando todos los servicios de PrediVersa...
echo.

REM Abrir 3 terminales CMD para cada servicio
echo 🔧 Iniciando Backend (Puerto 5001)...
start "PrediVersa Backend" cmd /k "cd /d backend && echo === BACKEND INICIADO === && npm start"

timeout /t 3

echo 🌐 Iniciando API Gateway (Puerto 3001)...
start "PrediVersa API Gateway" cmd /k "cd /d api-gateway && echo === API GATEWAY INICIADO === && npm start"

timeout /t 3

echo 🖥️ Iniciando Frontend (Puerto 3000)...
start "PrediVersa Frontend" cmd /k "cd /d frontend && echo === FRONTEND INICIADO === && npm start"

echo.
echo ===============================================
echo ✅ Power Cell Activada
echo ===============================================
echo.
echo 📡 Backend:     http://localhost:5001/api
echo 🌐 API Gateway: http://localhost:3001
echo 🖥️ Frontend:    http://localhost:3000
echo.
echo Presiona cualquier tecla para cerrar este script...
pause > nul
