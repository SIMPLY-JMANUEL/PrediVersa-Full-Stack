  @echo off
echo ===============================================
echo 🔋 POWER CELL - PrediVersa Full Stack Startup
echo ===============================================
echo.
echo Iniciando todos los servicios de PrediVersa...
echo.

REM Detener procesos existentes en los puertos necesarios
echo 🔧 Liberando puertos necesarios...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3001"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000"') do taskkill /PID %%a /F >nul 2>&1
echo ✅ Puertos liberados

REM Abrir 3 terminales CMD para cada servicio
echo 🔧 Iniciando Backend (Puerto 5001)...
start "PrediVersa Backend" cmd /k "cd /d backend && echo === BACKEND INICIADO === && npm start"

timeout /t 3

echo 🌐 Iniciando API Gateway (Puerto 3001)...
start "PrediVersa API Gateway" cmd /k "cd /d api-gateway && echo === API GATEWAY INICIADO === && npm start"

timeout /t 3

echo 🖥️ Iniciando Frontend (Puerto 3000)...
start "PrediVersa Frontend" cmd /k "cd /d frontend && echo === FRONTEND INICIADO === && set NODE_OPTIONS=--openssl-legacy-provider && npm start"

echo.
echo ===============================================
echo ✅ Power Cell Activada
echo ===============================================
echo.
echo 📡 Backend:     http://localhost:5001/api
echo 🌐 API Gateway: http://localhost:3001
echo 🖥️ Frontend:    http://localhost:3000
echo.
echo 🔍 Verificando que los servicios estén activos...
timeout /t 5 > nul

REM Verificar puertos
echo Verificando puertos...
netstat -ano | findstr ":5001" > nul && echo ✅ Backend corriendo en puerto 5001 || echo ❌ Backend NO está corriendo
netstat -ano | findstr ":3001" > nul && echo ✅ API Gateway corriendo en puerto 3001 || echo ❌ API Gateway NO está corriendo  
netstat -ano | findstr ":3000" > nul && echo ✅ Frontend corriendo en puerto 3000 || echo ❌ Frontend NO está corriendo

echo.
echo 🌟 Sistema PrediVersa iniciado correctamente
echo Presiona cualquier tecla para cerrar este script...
pause > nul
