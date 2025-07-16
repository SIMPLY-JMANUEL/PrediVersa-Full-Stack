@echo off
REM Script para verificar el estado de los servicios PrediVersa
echo ===============================================
echo 📊 POWER CELL - Estado PrediVersa Stack
echo ===============================================
echo.

REM Función para verificar si un puerto está en uso
:check_port
set port=%1
set service=%2
netstat -ano | findstr ":%port% " | findstr "LISTENING" >nul
if errorlevel 1 (
    echo ❌ %service% [Puerto %port%]: No está ejecutándose
) else (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%port% " ^| findstr "LISTENING"') do (
        echo ✅ %service% [Puerto %port%]: Activo (PID: %%a)
    )
)
goto :eof

echo 🔍 Verificando servicios...
echo.

call :check_port 5001 "Backend"
call :check_port 3001 "API Gateway"
call :check_port 3000 "Frontend"

echo.
echo 🌐 Probando conectividad...

REM Test de conectividad HTTP
curl -s --max-time 3 http://localhost:5001/api/test >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API: No responde
) else (
    echo ✅ Backend API: Respondiendo
)

curl -s --max-time 3 http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo ❌ API Gateway: No responde
) else (
    echo ✅ API Gateway: Respondiendo
)

curl -s --max-time 3 http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend: No responde
) else (
    echo ✅ Frontend: Respondiendo
)

echo.
echo 💾 Uso de memoria de procesos Node.js:
for /f "tokens=1,2,5" %%a in ('tasklist /fi "imagename eq node.exe" /fo table /nh 2^>nul') do (
    echo │ PID %%b: %%c KB
)

echo.
echo 📁 Archivos de configuración:
if exist "%~dp0backend\.env" (
    echo ✅ .env del backend existe
) else (
    echo ❌ .env del backend no encontrado
)

echo.
echo 📦 Dependencias:
if exist "%~dp0backend\node_modules" (
    echo ✅ Backend node_modules existe
) else (
    echo ❌ Backend node_modules no encontrado
)

if exist "%~dp0api-gateway\node_modules" (
    echo ✅ API Gateway node_modules existe
) else (
    echo ❌ API Gateway node_modules no encontrado
)

if exist "%~dp0frontend\node_modules" (
    echo ✅ Frontend node_modules existe
) else (
    echo ❌ Frontend node_modules no encontrado
)

echo.
echo ===============================================
echo 📊 Diagnóstico Completado
echo ===============================================
echo.
pause
