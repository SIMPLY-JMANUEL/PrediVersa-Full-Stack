@echo off
echo ===============================================
echo 🔴 POWER CELL - PrediVersa Full Stack Cleanup
echo ===============================================
echo.
echo Cerrando todos los servicios de PrediVersa...
echo.

REM Cerrar procesos Node.js
echo 🧹 Cerrando procesos Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Procesos Node.js cerrados
) else (
    echo ⚠️  No se encontraron procesos Node.js activos
)

REM Cerrar ventanas CMD específicas
echo 🪟 Cerrando ventanas de terminales...
taskkill /FI "WINDOWTITLE eq PrediVersa Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PrediVersa API Gateway" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq PrediVersa Frontend" /F >nul 2>&1

echo.
echo 🔍 Verificando que los puertos estén libres...
timeout /t 2 >nul

netstat -ano | findstr ":5001" >nul && echo ⚠️  Puerto 5001 aún ocupado || echo ✅ Puerto 5001 libre
netstat -ano | findstr ":3001" >nul && echo ⚠️  Puerto 3001 aún ocupado || echo ✅ Puerto 3001 libre
netstat -ano | findstr ":3000" >nul && echo ⚠️  Puerto 3000 aún ocupado || echo ✅ Puerto 3000 libre

echo.
echo 🌟 Limpieza completada
echo.
echo 💡 Ahora puedes ejecutar start-all.bat para iniciar nuevamente el sistema
echo.
pause
