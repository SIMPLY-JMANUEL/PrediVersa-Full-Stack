@echo off
REM Script para detener todos los servicios de PrediVersa
echo ===============================================
echo 🛑 POWER CELL - Deteniendo PrediVersa Stack
echo ===============================================
echo.

echo 🔍 Buscando procesos en puertos 5001, 3001 y 3000...

REM Función para matar procesos en puertos específicos
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 " ^| findstr "LISTENING"') do (
    echo 🛑 Deteniendo Backend (PID: %%a)
    taskkill /f /pid %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3001 " ^| findstr "LISTENING"') do (
    echo 🛑 Deteniendo API Gateway (PID: %%a)
    taskkill /f /pid %%a 2>nul
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    echo 🛑 Deteniendo Frontend (PID: %%a)
    taskkill /f /pid %%a 2>nul
)

REM También matar procesos de Node.js relacionados con PrediVersa
echo 🔍 Buscando procesos Node.js relacionados...
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo table /nh 2^>nul') do (
    wmic process where "ProcessId=%%a" get CommandLine /format:list 2>nul | findstr /i "prediversa\|backend\|frontend\|api-gateway" >nul
    if not errorlevel 1 (
        echo 🛑 Deteniendo proceso Node.js (PID: %%a)
        taskkill /f /pid %%a 2>nul
    )
)

echo.
echo 🧹 Limpieza completada
echo.

REM Verificar que los puertos estén libres
echo 🔍 Verificando puertos...
netstat -ano | findstr ":5001 :3001 :3000" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo ✅ Todos los puertos están libres
) else (
    echo ⚠️  Algunos puertos aún pueden estar ocupados:
    netstat -ano | findstr ":5001 :3001 :3000" | findstr "LISTENING"
)

echo.
echo ===============================================
echo ✅ PrediVersa Stack Detenido
echo ===============================================
echo.
echo 💡 Para reiniciar los servicios, ejecuta: start-all.bat
echo.
pause
