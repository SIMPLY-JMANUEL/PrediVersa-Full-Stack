@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ===============================================
REM ⚡ PREDIVERSA TURBO START - ULTRA RÁPIDO ⚡
REM ===============================================

echo.
echo ⚡ PrediVersa TURBO - Inicio ultrarrápido...
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM ===============================================
REM LIMPIEZA RÁPIDA
REM ===============================================

echo 🧹 Limpieza express...
taskkill /F /IM node.exe >nul 2>&1

REM Limpiar puertos sin esperas
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5001 :3001 :3000" ^| findstr "LISTENING" 2^>nul') do taskkill /f /pid %%a >nul 2>&1

REM ===============================================
REM INICIO SIMULTANEO (SIN ESPERAS)
REM ===============================================

echo 🚀 Iniciando todos los servicios simultáneamente...

REM Iniciar Backend
start "PrediVersa Backend" /D "%SCRIPT_DIR%backend" cmd /k "npm start"

REM Iniciar API Gateway (sin espera)
start "PrediVersa API Gateway" /D "%SCRIPT_DIR%api-gateway" cmd /k "npm start"

REM Iniciar Frontend (sin espera)
start "PrediVersa Frontend" /D "%SCRIPT_DIR%frontend" cmd /k "npm start"

echo.
echo ⚡ ¡SERVICIOS INICIADOS EN MODO TURBO!
echo.
echo 🌐 URLs disponibles en unos segundos:
echo ├── 🖥️  Frontend:    http://localhost:3000
echo ├── 🌐 API Gateway: http://localhost:3001  
echo └── 🔧 Backend:     http://localhost:5001/api
echo.
echo 💡 Los servicios se están iniciando en paralelo
echo 📊 Usa status-turbo.bat para verificar el estado
echo 🛑 Usa stop-all-fixed.bat para detener todo
echo.

echo ⚡ Script completado en modo TURBO
pause
