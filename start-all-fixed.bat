@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ===============================================
REM 🔋 POWER CELL - PrediVersa Full Stack Startup (FIXED)
REM ===============================================

echo.
echo 🔋 PrediVersa Full Stack - Iniciando servicios...
echo.

REM Obtener la ruta del directorio donde está este script
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"
echo 📁 Directorio de trabajo: %SCRIPT_DIR%

REM ===============================================
REM VERIFICACIONES PREVIAS
REM ===============================================

echo.
echo 🔍 Verificando requisitos...

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js no está instalado
    echo 📥 Descarga e instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js: Instalado

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm no está disponible
    pause
    exit /b 1
)
echo ✅ npm: Disponible

REM Verificar estructura de carpetas
if not exist "%SCRIPT_DIR%backend" (
    echo ❌ ERROR: Carpeta 'backend' no encontrada
    pause
    exit /b 1
)
if not exist "%SCRIPT_DIR%api-gateway" (
    echo ❌ ERROR: Carpeta 'api-gateway' no encontrada
    pause
    exit /b 1
)
if not exist "%SCRIPT_DIR%frontend" (
    echo ❌ ERROR: Carpeta 'frontend' no encontrada
    pause
    exit /b 1
)
echo ✅ Estructura de carpetas: Correcta

REM ===============================================
REM LIMPIAR PROCESOS EXISTENTES
REM ===============================================

echo.
echo 🧹 Limpiando procesos anteriores...

REM Matar procesos de Node.js
taskkill /F /IM node.exe >nul 2>&1

REM Limpiar puertos específicos
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING" 2^>nul') do (
    echo 🛑 Liberando puerto 5001 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING" 2^>nul') do (
    echo 🛑 Liberando puerto 3001 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo 🛑 Liberando puerto 3000 (PID: %%a)
    taskkill /f /pid %%a >nul 2>&1
)

timeout /t 1 >nul

REM ===============================================
REM VERIFICAR E INSTALAR DEPENDENCIAS
REM ===============================================

echo.
echo 📦 Verificando dependencias...

REM Backend
if not exist "%SCRIPT_DIR%backend\node_modules" (
    echo 📥 Instalando dependencias del backend...
    cd /d "%SCRIPT_DIR%backend"
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del backend
        pause
        exit /b 1
    )
)
echo ✅ Backend: Dependencias OK

REM API Gateway
if not exist "%SCRIPT_DIR%api-gateway\node_modules" (
    echo 📥 Instalando dependencias del API Gateway...
    cd /d "%SCRIPT_DIR%api-gateway"
    npm install
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del API Gateway
        pause
        exit /b 1
    )
)
echo ✅ API Gateway: Dependencias OK

REM Frontend
if not exist "%SCRIPT_DIR%frontend\node_modules" (
    echo 📥 Instalando dependencias del frontend...
    cd /d "%SCRIPT_DIR%frontend"
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del frontend
        pause
        exit /b 1
    )
)
echo ✅ Frontend: Dependencias OK

REM ===============================================
REM CREAR ARCHIVO .ENV SI NO EXISTE
REM ===============================================

if not exist "%SCRIPT_DIR%backend\.env" (
    echo 🔧 Creando archivo .env para backend...
    (
        echo JWT_SECRET=prediversa_jwt_secret_key_2025
        echo PORT=5001
        echo NODE_ENV=development
        echo CORS_ORIGINS=http://localhost:3000,http://192.168.0.102:3000
        echo MAX_FILE_SIZE=10mb
    ) > "%SCRIPT_DIR%backend\.env"
    echo ✅ Archivo .env creado
)

cd /d "%SCRIPT_DIR%"

REM ===============================================
REM INICIAR SERVICIOS
REM ===============================================

echo.
echo 🚀 Iniciando servicios...

echo.
echo 🔧 Iniciando Backend (Puerto 5001)...
start "PrediVersa Backend" /D "%SCRIPT_DIR%backend" cmd /k "echo === BACKEND PREDIVERSA === && echo Directorio: %CD% && npm start"

timeout /t 2

echo 🌐 Iniciando API Gateway (Puerto 3001)...
start "PrediVersa API Gateway" /D "%SCRIPT_DIR%api-gateway" cmd /k "echo === API GATEWAY PREDIVERSA === && echo Directorio: %CD% && npm start"

timeout /t 2

echo 🖥️ Iniciando Frontend (Puerto 3000)...
start "PrediVersa Frontend" /D "%SCRIPT_DIR%frontend" cmd /k "echo === FRONTEND PREDIVERSA === && echo Directorio: %CD% && npm start"

echo.
echo ===============================================
echo ✅ Servicios iniciados correctamente
echo ===============================================
echo.
echo 🌐 URLs DE ACCESO:
echo ├── 🖥️  Frontend:    http://localhost:3000
echo ├── 🌐 API Gateway: http://localhost:3001  
echo └── 🔧 Backend:     http://localhost:5001/api
echo.
echo 🧪 ENDPOINTS DE PRUEBA:
echo ├── 🔍 Health Backend: http://localhost:5001/api/test
echo ├── 🔍 Health Gateway: http://localhost:3001/health
echo └── 🔐 Login:          http://localhost:5001/api/auth/login
echo.
echo 👥 USUARIOS DE PRUEBA:
echo ├── Admin:      admin@prediversa.com      / admin123
echo ├── Profesor:   profesor@prediversa.com   / admin123  
echo ├── Estudiante: estudiante@prediversa.com / admin123
echo └── Padre:      padre@prediversa.com      / admin123
echo.
echo 💡 NOTAS:
echo ├── Se abrieron 3 ventanas de terminal separadas
echo ├── Para detener: Cierra las ventanas o usa Ctrl+C
echo ├── Para reiniciar: Ejecuta este script nuevamente
echo └── Para estado: Ejecuta status-fixed.bat
echo.

REM ===============================================
REM VERIFICACIÓN FINAL
REM ===============================================

echo 🔍 Verificando que los servicios estén activos...
timeout /t 3 >nul

set services_running=0

netstat -ano | findstr ":5001" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo ✅ Backend activo en puerto 5001
    set /a services_running+=1
) else (
    echo ❌ Backend NO está activo en puerto 5001
)

netstat -ano | findstr ":3001" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo ✅ API Gateway activo en puerto 3001
    set /a services_running+=1
) else (
    echo ❌ API Gateway NO está activo en puerto 3001
)

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo ✅ Frontend activo en puerto 3000
    set /a services_running+=1
) else (
    echo ❌ Frontend NO está activo en puerto 3000
)

echo.
if !services_running! equ 3 (
    echo 🎉 ¡Todos los servicios están funcionando correctamente!
) else (
    echo ⚠️  Solo !services_running!/3 servicios están activos
    echo 💡 Revisa las ventanas de terminal para ver errores específicos
)

echo.
echo 🛑 Para detener todos los servicios, ejecuta: stop-all-fixed.bat
echo.
pause
