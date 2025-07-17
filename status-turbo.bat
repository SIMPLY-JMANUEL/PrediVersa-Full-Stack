@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

REM ===============================================
REM ⚡ PREDIVERSA STATUS TURBO - VERIFICACIÓN RÁPIDA
REM ===============================================

echo.
echo ⚡ Estado TURBO - PrediVersa Stack
echo ===============================================
echo.

set services_count=0

REM Verificación ultra-rápida de puertos
netstat -ano | findstr ":5001" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend [5001]: ACTIVO
    set /a services_count+=1
) else (
    echo ❌ Backend [5001]: INACTIVO
)

netstat -ano | findstr ":3001" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ API Gateway [3001]: ACTIVO
    set /a services_count+=1
) else (
    echo ❌ API Gateway [3001]: INACTIVO
)

netstat -ano | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend [3000]: ACTIVO
    set /a services_count+=1
) else (
    echo ❌ Frontend [3000]: INACTIVO
)

echo.
echo ===============================================
if !services_count! equ 3 (
    echo 🎉 TODOS LOS SERVICIOS ACTIVOS (!services_count!/3)
    echo 🌐 Aplicación lista en: http://localhost:3000
) else if !services_count! equ 0 (
    echo 🛑 NINGÚN SERVICIO ACTIVO
    echo 💡 Ejecuta start-turbo.bat para iniciar
) else (
    echo ⚠️  SERVICIOS PARCIALMENTE ACTIVOS (!services_count!/3)
    echo 💡 Algunos servicios aún se están iniciando...
)
echo ===============================================
echo.

pause
