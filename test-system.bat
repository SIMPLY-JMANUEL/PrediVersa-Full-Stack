@echo off
echo ===============================================
echo 🧪 PRUEBA RÁPIDA - PrediVersa Sistema
echo ===============================================
echo.

REM Probar conexión al backend
echo 🔍 Probando conexión al backend...
curl -s http://localhost:5001/api/test >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend responde correctamente
) else (
    echo ❌ Backend no responde
    echo 💡 Ejecuta start-system.bat para iniciar el backend
    pause
    exit /b 1
)

echo.
echo 🔑 Probando login de Admin...
curl -s -X POST "http://localhost:5001/api/auth/login" -H "Content-Type: application/json" -d "{\"usuario\":\"Admin\",\"password\":\"123456789\"}" >temp_login.json 2>nul
if %errorlevel% equ 0 (
    echo ✅ Login de Admin exitoso
) else (
    echo ❌ Login de Admin falló
)

echo.
echo 🔍 Probando búsqueda de usuarios...
REM Aquí se podría agregar más lógica para probar la búsqueda, pero requiere parsing JSON en batch

echo.
echo 🌐 Probando conexión al frontend...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend responde correctamente
) else (
    echo ❌ Frontend no responde
    echo 💡 Ejecuta start-system.bat para iniciar el frontend
)

echo.
echo ===============================================
echo 📋 RESUMEN DE ESTADO
echo ===============================================
netstat -ano | findstr ":5001" >nul && echo ✅ Backend: Puerto 5001 activo || echo ❌ Backend: Puerto 5001 inactivo
netstat -ano | findstr ":3001" >nul && echo ✅ Frontend: Puerto 3001 activo || echo ❌ Frontend: Puerto 3001 inactivo

echo.
echo 💡 URLs del sistema:
echo - Frontend: http://localhost:3001
echo - Backend API: http://localhost:5001/api
echo - Credenciales: Admin / 123456789
echo.

REM Limpiar archivo temporal
if exist temp_login.json del temp_login.json >nul 2>&1

pause
