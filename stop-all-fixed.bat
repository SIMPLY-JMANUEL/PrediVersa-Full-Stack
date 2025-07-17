@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ===============================================
REM 🛑 PrediVersa - Detener Servicios (FIXED)
REM ===============================================

echo.
echo 🛑 DETENIENDO SERVICIOS PREDIVERSA
echo ===============================================
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo 🔍 Buscando servicios activos...
echo.

set services_stopped=0

REM ===============================================
REM DETENER POR PUERTOS ESPECÍFICOS
REM ===============================================

REM Detener Backend (Puerto 5001)
echo 🛑 Deteniendo Backend (Puerto 5001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING" 2^>nul') do (
    echo    └── Terminando proceso PID: %%a
    taskkill /f /pid %%a >nul 2>&1
    set /a services_stopped+=1
)

REM Detener API Gateway (Puerto 3001)
echo 🛑 Deteniendo API Gateway (Puerto 3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING" 2^>nul') do (
    echo    └── Terminando proceso PID: %%a
    taskkill /f /pid %%a >nul 2>&1
    set /a services_stopped+=1
)

REM Detener Frontend (Puerto 3000)
echo 🛑 Deteniendo Frontend (Puerto 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING" 2^>nul') do (
    echo    └── Terminando proceso PID: %%a
    taskkill /f /pid %%a >nul 2>&1
    set /a services_stopped+=1
)

REM ===============================================
REM LIMPIAR PROCESOS NODE.JS RELACIONADOS
REM ===============================================

echo.
echo 🧹 Limpiando procesos Node.js relacionados con PrediVersa...

set node_processes_killed=0
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo table /nh 2^>nul') do (
    if not "%%a"=="PID" (
        REM Verificar si el proceso está relacionado con PrediVersa
        wmic process where "ProcessId=%%a" get CommandLine /format:list 2>nul | findstr /i "prediversa\|backend\|frontend\|api-gateway" >nul
        if not errorlevel 1 (
            echo    └── Terminando proceso Node.js PID: %%a
            taskkill /f /pid %%a >nul 2>&1
            set /a node_processes_killed+=1
        )
    )
)

if !node_processes_killed! equ 0 (
    echo    └── No se encontraron procesos Node.js relacionados con PrediVersa
)

REM ===============================================
REM LIMPIEZA ADICIONAL
REM ===============================================

echo.
echo 🧹 Limpieza adicional...

REM Matar cualquier proceso node.exe restante (opcional)
REM taskkill /F /IM node.exe >nul 2>&1

REM Esperar un momento para que los procesos terminen
timeout /t 2 >nul

REM ===============================================
REM VERIFICACIÓN FINAL
REM ===============================================

echo.
echo 🔍 Verificando que los puertos estén libres...

set ports_free=0

netstat -ano | findstr ":5001" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo ✅ Puerto 5001: Libre
    set /a ports_free+=1
) else (
    echo ⚠️  Puerto 5001: Aún ocupado
)

netstat -ano | findstr ":3001" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo ✅ Puerto 3001: Libre
    set /a ports_free+=1
) else (
    echo ⚠️  Puerto 3001: Aún ocupado
)

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if errorlevel 1 (
    echo ✅ Puerto 3000: Libre
    set /a ports_free+=1
) else (
    echo ⚠️  Puerto 3000: Aún ocupado
)

echo.

REM ===============================================
REM RESUMEN FINAL
REM ===============================================

echo ===============================================
echo 🏁 RESUMEN DE LIMPIEZA
echo ===============================================
echo.
echo Servicios detenidos: !services_stopped!
echo Procesos Node.js terminados: !node_processes_killed!
echo Puertos liberados: !ports_free!/3
echo.

if !ports_free! equ 3 (
    echo ✅ ¡Todos los puertos están libres!
    echo 🎯 Los servicios se han detenido correctamente
) else (
    echo ⚠️  Algunos puertos pueden estar aún ocupados
    echo 💡 Puedes intentar reiniciar el sistema si persisten problemas
    echo.
    echo 🔍 Procesos aún usando los puertos:
    netstat -ano | findstr ":5001 :3001 :3000" | findstr "LISTENING"
)

echo.
echo 💡 COMANDOS ÚTILES:
echo ├── Iniciar servicios: start-all-fixed.bat
echo ├── Ver estado:       status-fixed.bat
echo └── Detener servicios: stop-all-fixed.bat (este script)
echo.

echo 🔄 Para reiniciar completamente:
echo    1. Ejecuta este script (stop-all-fixed.bat)
echo    2. Espera unos segundos
echo    3. Ejecuta start-all-fixed.bat
echo.

pause
