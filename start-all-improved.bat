@echo off
echo ===============================================
echo 🔋 POWER CELL - PrediVersa Full Stack Startup
echo ===============================================
echo.

REM Función para verificar si un puerto está libre
:check_port
netstat -ano | findstr ":%1" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Puerto %1 está ocupado, intentando liberar...
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 2 >nul
    goto check_port
) else (
    echo ✅ Puerto %1 está libre
)
goto :eof

echo 🧹 Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 >nul

echo 🔍 Verificando puertos...
call :check_port 5001
call :check_port 3001
call :check_port 3000

echo.
echo Iniciando todos los servicios de PrediVersa...
echo.

REM Iniciar Backend
echo 🔧 Iniciando Backend (Puerto 5001)...
start "PrediVersa Backend" cmd /k "cd /d backend && echo === BACKEND INICIADO === && npm start"
timeout /t 8

REM Iniciar API Gateway
echo 🌐 Iniciando API Gateway (Puerto 3001)...
start "PrediVersa API Gateway" cmd /k "cd /d api-gateway && echo === API GATEWAY INICIADO === && npm start"
timeout /t 5

REM Iniciar Frontend
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
timeout /t 10 >nul

REM Verificar puertos
echo Verificando puertos...
netstat -ano | findstr ":5001" >nul && echo ✅ Backend corriendo en puerto 5001 || echo ❌ Backend NO está corriendo
netstat -ano | findstr ":3001" >nul && echo ✅ API Gateway corriendo en puerto 3001 || echo ❌ API Gateway NO está corriendo  
netstat -ano | findstr ":3000" >nul && echo ✅ Frontend corriendo en puerto 3000 || echo ❌ Frontend NO está corriendo

echo.
echo 🌟 Sistema PrediVersa iniciado correctamente
echo.
echo 💡 Consejos:
echo - Si hay errores, cierra las ventanas y ejecuta este script nuevamente
echo - El backend debe iniciarse antes que el frontend
echo - Espera a que cada servicio termine de cargar antes de usar la aplicación
echo.
echo Presiona cualquier tecla para cerrar este script...
pause >nul
