@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ===============================================
REM 📊 PrediVersa - Estado de Servicios (FIXED)
REM ===============================================

echo.
echo 📊 ESTADO DE SERVICIOS PREDIVERSA
echo ===============================================
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo 🔍 Verificando servicios en ejecución...
echo.

REM ===============================================
REM VERIFICAR PUERTOS
REM ===============================================

set backend_running=0
set gateway_running=0
set frontend_running=0

REM Verificar Backend (Puerto 5001)
netstat -ano | findstr ":5001" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend [Puerto 5001]: ACTIVO
    set backend_running=1
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING"') do (
        echo    └── PID: %%a
    )
) else (
    echo ❌ Backend [Puerto 5001]: NO está ejecutándose
)

REM Verificar API Gateway (Puerto 3001)
netstat -ano | findstr ":3001" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ API Gateway [Puerto 3001]: ACTIVO
    set gateway_running=1
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING"') do (
        echo    └── PID: %%a
    )
) else (
    echo ❌ API Gateway [Puerto 3001]: NO está ejecutándose
)

REM Verificar Frontend (Puerto 3000)
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend [Puerto 3000]: ACTIVO
    set frontend_running=1
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
        echo    └── PID: %%a
    )
) else (
    echo ❌ Frontend [Puerto 3000]: NO está ejecutándose
)

echo.

REM ===============================================
REM VERIFICAR CONECTIVIDAD HTTP
REM ===============================================

echo 🌐 Probando conectividad HTTP...
echo.

REM Test Backend API
curl -s --max-time 3 http://localhost:5001/api/test >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend API: Respondiendo correctamente
) else (
    echo ❌ Backend API: No responde o tiene errores
)

REM Test API Gateway
curl -s --max-time 3 http://localhost:3001 >nul 2>&1
if not errorlevel 1 (
    echo ✅ API Gateway: Respondiendo correctamente
) else (
    echo ❌ API Gateway: No responde o tiene errores
)

REM Test Frontend
curl -s --max-time 3 http://localhost:3000 >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend: Respondiendo correctamente
) else (
    echo ❌ Frontend: No responde o tiene errores
)

echo.

REM ===============================================
REM INFORMACIÓN DEL SISTEMA
REM ===============================================

echo 💾 Procesos Node.js activos:
set node_count=0
for /f "tokens=1,2,5" %%a in ('tasklist /fi "imagename eq node.exe" /fo table /nh 2^>nul') do (
    if "%%a"=="node.exe" (
        echo │ PID %%b: %%c KB
        set /a node_count+=1
    )
)
if !node_count! equ 0 (
    echo │ No hay procesos Node.js ejecutándose
)
echo.

echo 📁 Verificando archivos de configuración:
if exist "%SCRIPT_DIR%backend\.env" (
    echo ✅ .env del backend: Existe
) else (
    echo ❌ .env del backend: NO encontrado
)
echo.

echo 📦 Verificando dependencias:
if exist "%SCRIPT_DIR%backend\node_modules" (
    echo ✅ Backend node_modules: Existe
) else (
    echo ❌ Backend node_modules: NO encontrado
)

if exist "%SCRIPT_DIR%api-gateway\node_modules" (
    echo ✅ API Gateway node_modules: Existe
) else (
    echo ❌ API Gateway node_modules: NO encontrado
)

if exist "%SCRIPT_DIR%frontend\node_modules" (
    echo ✅ Frontend node_modules: Existe
) else (
    echo ❌ Frontend node_modules: NO encontrado
)

echo.

REM ===============================================
REM RESUMEN FINAL
REM ===============================================

set /a total_services=!backend_running!+!gateway_running!+!frontend_running!

echo ===============================================
echo 📊 RESUMEN DEL ESTADO
echo ===============================================
echo.
echo Servicios activos: !total_services!/3
echo.

if !total_services! equ 3 (
    echo 🎉 ¡Todos los servicios están funcionando correctamente!
    echo.
    echo 🌐 URLs de acceso:
    echo ├── Frontend:    http://localhost:3000
    echo ├── API Gateway: http://localhost:3001
    echo └── Backend:     http://localhost:5001/api
) else if !total_services! equ 0 (
    echo 🛑 Ningún servicio está ejecutándose
    echo 💡 Ejecuta start-all-fixed.bat para iniciar todos los servicios
) else (
    echo ⚠️  Solo algunos servicios están activos
    echo 💡 Revisa los errores y reinicia los servicios necesarios
)

echo.
echo 💡 COMANDOS ÚTILES:
echo ├── Iniciar servicios: start-all-fixed.bat
echo ├── Detener servicios: stop-all-fixed.bat
echo └── Ver este estado:   status-fixed.bat
echo.

pause
