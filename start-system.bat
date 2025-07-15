@echo off
echo ===============================================
echo 🔋 POWER CELL - PrediVersa Full Stack Startup
echo ===============================================
echo.

REM Limpiar procesos anteriores
echo 🧹 Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 5 >nul

REM Función para verificar si un puerto está libre
echo 🔍 Verificando puertos disponibles...
netstat -ano | findstr ":5001" >nul && echo ⚠️ Puerto 5001 ocupado - esperando... && timeout /t 5 >nul || echo ✅ Puerto 5001 disponible
netstat -ano | findstr ":3001" >nul && echo ⚠️ Puerto 3001 ocupado - esperando... && timeout /t 5 >nul || echo ✅ Puerto 3001 disponible

echo.
echo 🚀 Iniciando servicios de PrediVersa...
echo.

REM Iniciar Backend
echo 🔧 Iniciando Backend (Puerto 5001)...
cd backend
start "PrediVersa Backend" cmd /k "echo === BACKEND INICIADO === && npm start"
cd ..

REM Esperar a que el backend se inicie
echo ⏳ Esperando a que el backend se inicie...
timeout /t 10 >nul

REM Verificar que el backend esté funcionando
:check_backend
curl -s http://localhost:5001/api/test >nul 2>&1
if %errorlevel% neq 0 (
    echo ⏳ Backend aún no está listo, esperando...
    timeout /t 3 >nul
    goto check_backend
)
echo ✅ Backend iniciado correctamente

echo.
echo 🖥️ Iniciando Frontend (Puerto 3001)...
cd frontend
start "PrediVersa Frontend" cmd /k "echo === FRONTEND INICIADO === && set NODE_OPTIONS=--openssl-legacy-provider && set PORT=3001 && npm start"
cd ..

echo.
echo ===============================================
echo ✅ Power Cell Activada
echo ===============================================
echo.
echo 📡 Backend:     http://localhost:5001/api
echo 🖥️ Frontend:    http://localhost:3001
echo.
echo ⏳ Esperando a que todos los servicios estén listos...
timeout /t 15 >nul

echo.
echo 🔍 Verificando estado de servicios...
netstat -ano | findstr ":5001" >nul && echo ✅ Backend corriendo en puerto 5001 || echo ❌ Backend NO está corriendo
netstat -ano | findstr ":3001" >nul && echo ✅ Frontend corriendo en puerto 3001 || echo ❌ Frontend NO está corriendo

echo.
echo 🌟 Sistema PrediVersa iniciado correctamente
echo.
echo 💡 Consejos:
echo - Accede a http://localhost:3001 para el frontend
echo - Accede a http://localhost:5001/api para el backend
echo - Usa las credenciales: Admin / 123456789
echo - La búsqueda de usuarios ahora funciona correctamente
echo.
echo Presiona cualquier tecla para cerrar este script...
pause >nul
