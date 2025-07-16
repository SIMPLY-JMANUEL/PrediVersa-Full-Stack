@echo off
REM Obtener la ruta del directorio donde está este script
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo ===============================================
echo 🔋 POWER CELL - PrediVersa Full Stack Startup
echo ===============================================
echo.
echo Directorio de trabajo: %SCRIPT_DIR%
echo Iniciando todos los servicios de PrediVersa...
echo.

REM Verificar que las carpetas existen
if not exist "%SCRIPT_DIR%\backend" (
    echo ❌ ERROR: No se encuentra la carpeta backend
    pause
    exit /b 1
)
if not exist "%SCRIPT_DIR%\api-gateway" (
    echo ❌ ERROR: No se encuentra la carpeta api-gateway
    pause
    exit /b 1
)
if not exist "%SCRIPT_DIR%\frontend" (
    echo ❌ ERROR: No se encuentra la carpeta frontend
    pause
    exit /b 1
)

REM Verificar archivos de configuración
echo 🔍 Verificando configuración...
if not exist "%SCRIPT_DIR%\backend\.env" (
    echo ⚠️  ADVERTENCIA: No se encuentra .env en backend, creando uno básico...
    echo JWT_SECRET=prediversa_jwt_secret_key_2025 > "%SCRIPT_DIR%\backend\.env"
    echo PORT=5001 >> "%SCRIPT_DIR%\backend\.env"
    echo NODE_ENV=development >> "%SCRIPT_DIR%\backend\.env"
    echo CORS_ORIGINS=http://localhost:3000,http://192.168.0.102:3000 >> "%SCRIPT_DIR%\backend\.env"
    echo MAX_FILE_SIZE=10mb >> "%SCRIPT_DIR%\backend\.env"
)

REM Verificar que npm esté instalado
echo 🔍 Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm no está instalado o no está en PATH
    echo 📥 Instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar dependencias y instalarlas si es necesario
echo 📦 Verificando dependencias...
if not exist "%SCRIPT_DIR%\backend\node_modules" (
    echo 📥 Instalando dependencias del backend...
    cd /d "%SCRIPT_DIR%\backend"
    npm install --silent
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del backend
        pause
        exit /b 1
    )
)

if not exist "%SCRIPT_DIR%\api-gateway\node_modules" (
    echo 📥 Instalando dependencias del API Gateway...
    cd /d "%SCRIPT_DIR%\api-gateway"
    npm install --silent
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del API Gateway
        pause
        exit /b 1
    )
)

if not exist "%SCRIPT_DIR%\frontend\node_modules" (
    echo 📥 Instalando dependencias del frontend...
    cd /d "%SCRIPT_DIR%\frontend"
    npm install --silent --legacy-peer-deps
    if errorlevel 1 (
        echo ❌ ERROR: Falló la instalación de dependencias del frontend
        pause
        exit /b 1
    )
)

cd /d "%SCRIPT_DIR%"

REM Matar procesos existentes en los puertos si están ocupados
:cleanup_ports
echo 🧹 Limpiando puertos ocupados...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul

timeout /t 2

REM Abrir 3 terminales CMD para cada servicio con rutas absolutas
echo 🔧 Iniciando Backend (Puerto 5001)...
start "PrediVersa Backend" cmd /k "cd /d "%SCRIPT_DIR%\backend" && echo === DIRECTORIO: %CD% === && echo === VERIFICANDO NPM === && npm --version && echo === INICIANDO BACKEND === && npm start"

echo ⏳ Esperando 5 segundos antes del siguiente servicio...
timeout /t 5

echo 🌐 Iniciando API Gateway (Puerto 3001)...
start "PrediVersa API Gateway" cmd /k "cd /d "%SCRIPT_DIR%\api-gateway" && echo === DIRECTORIO: %CD% === && echo === VERIFICANDO NPM === && npm --version && echo === INICIANDO API GATEWAY === && npm start"

echo ⏳ Esperando 5 segundos antes del siguiente servicio...
timeout /t 5

echo 🖥️ Iniciando Frontend (Puerto 3000)...
start "PrediVersa Frontend" cmd /k "cd /d "%SCRIPT_DIR%\frontend" && echo === DIRECTORIO: %CD% === && echo === VERIFICANDO NPM === && npm --version && echo === INICIANDO FRONTEND === && npm start"

echo.
echo ⏳ Esperando que los servicios se inicialicen completamente...
timeout /t 10

REM Health check de los servicios
echo 🏥 Verificando estado de los servicios...
curl -s http://localhost:5001/api/test >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Backend: Iniciando... (puede tardar unos segundos más)
) else (
    echo ✅ Backend: Funcionando correctamente
)

curl -s http://localhost:3001 >nul 2>&1
if errorlevel 1 (
    echo ⚠️  API Gateway: Iniciando... (puede tardar unos segundos más)
) else (
    echo ✅ API Gateway: Funcionando correctamente
)

curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Frontend: Iniciando... (puede tardar unos segundos más)
) else (
    echo ✅ Frontend: Funcionando correctamente
    echo 🌐 Abriendo navegador...
    start http://localhost:3000
)

echo.
echo ===============================================
echo ✅ Power Cell Activada - PrediVersa Stack
echo ===============================================
echo.
echo 🌐 SERVICIOS ACTIVOS:
echo ├── 📡 Backend:     http://localhost:5001/api
echo ├── � API Gateway: http://localhost:3001
echo └── 🖥️  Frontend:    http://localhost:3000
echo.
echo 🔧 ENDPOINTS ÚTILES:
echo ├── 🧪 Test Backend: http://localhost:5001/api/test
echo ├── 👤 Login:        http://localhost:5001/api/auth/login
echo └── 📊 Estado:       http://localhost:3001/health
echo.
echo 👥 USUARIOS DE PRUEBA:
echo ├── Admin:      admin@prediversa.com      / admin123
echo ├── Profesor:   profesor@prediversa.com   / admin123
echo ├── Estudiante: estudiante@prediversa.com / admin123
echo └── Padre:      padre@prediversa.com      / admin123
echo.
echo 💡 COMANDOS ÚTILES:
echo ├── Ver logs:     Revisa las ventanas de terminal abiertas
echo ├── Detener:      Ctrl+C en cada ventana de terminal
echo ├── Reiniciar:    Ejecuta este script nuevamente
echo └── Tests:        npm test (en carpeta backend o frontend)
echo.
echo 📁 ARCHIVOS IMPORTANTES:
echo ├── Configuración: %SCRIPT_DIR%\backend\.env
echo ├── Base de datos: Simulada en memoria (desarrollo)
echo └── Logs:          Visibles en terminales separadas
echo.
echo ⚡ OPCIONES AVANZADAS:
echo ├── [R] Reiniciar todos los servicios
echo ├── [S] Solo verificar estado (sin reiniciar)
echo ├── [L] Ver logs en tiempo real
echo └── [Q] Salir
echo.
set /p "choice=¿Qué deseas hacer? [R/S/L/Q]: "

if /i "%choice%"=="R" (
    echo 🔄 Reiniciando servicios...
    goto :restart_services
)
if /i "%choice%"=="S" (
    echo 🔍 Verificando estado...
    goto :check_status
)
if /i "%choice%"=="L" (
    echo 📋 Abriendo logs...
    start "Backend Logs" cmd /k "cd /d "%SCRIPT_DIR%\backend" && npm run logs"
    start "Frontend Logs" cmd /k "cd /d "%SCRIPT_DIR%\frontend" && npm run logs"
)
if /i "%choice%"=="Q" (
    goto :end_script
)

:check_status
echo 🏥 Estado actual de servicios...
netstat -ano | findstr ":5001 :3001 :3000" | findstr "LISTENING"
goto :end_script

:restart_services
echo 🔄 Reiniciando...
goto :cleanup_ports

:end_script
echo.
echo 💡 NOTA: Se han abierto 3 ventanas de terminal separadas.
echo    Si algún servicio no inicia, revisa las ventanas de terminal
echo    para ver los mensajes de error específicos.
echo.
echo ⚠️  Si un servicio falla al iniciar:
echo    1. Verifica que npm esté instalado: npm --version
echo    2. Instala dependencias: npm install en cada carpeta
echo    3. Revisa los puertos no estén ocupados
echo    4. Verifica el archivo .env en backend
echo.
echo 🛑 Para detener todos los servicios:
echo    - Ejecuta: stop-all.bat
echo    - O cierra manualmente cada ventana de terminal
echo.
echo Presiona cualquier tecla para cerrar este script...
pause > nul
