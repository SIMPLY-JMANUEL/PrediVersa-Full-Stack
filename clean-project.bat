@echo off
echo ===============================================
echo 🧹 LIMPIEZA DE PROYECTO PREDIVERSA
echo ===============================================
echo.

REM Eliminar archivos de prueba del directorio raíz
echo Eliminando archivos de prueba del directorio raíz...
if exist "test-*.js" del "test-*.js" /q
if exist "debug-*.js" del "debug-*.js" /q
if exist "diagnostico-*.js" del "diagnostico-*.js" /q
if exist "sistema-validacion.js" del "sistema-validacion.js" /q
if exist "test-conectividad.html" del "test-conectividad.html" /q

REM Eliminar archivos de prueba del backend
echo Eliminando archivos de prueba del backend...
cd backend
if exist "test-*.js" del "test-*.js" /q
if exist "debug-*.js" del "debug-*.js" /q
if exist "simple-test.js" del "simple-test.js" /q
if exist "verify-*.js" del "verify-*.js" /q
if exist "get-users.js" del "get-users.js" /q
cd ..

REM Eliminar archivos de prueba del frontend
echo Eliminando archivos de prueba del frontend...
cd frontend
if exist "test-*.js" del "test-*.js" /q
if exist "debug-*.js" del "debug-*.js" /q
cd ..

REM Eliminar archivos de documentación excesivos
echo Eliminando documentación duplicada...
if exist "REPORTE_RESTAURACION.md" del "REPORTE_RESTAURACION.md" /q
if exist "RESTAURACION_*.md" del "RESTAURACION_*.md" /q
if exist "RESOLUCION_*.md" del "RESOLUCION_*.md" /q
if exist "CORRECCION_*.md" del "CORRECCION_*.md" /q
if exist "CONFIGURACION_*.md" del "CONFIGURACION_*.md" /q
if exist "NUEVA_PESTANA_*.md" del "NUEVA_PESTANA_*.md" /q
if exist "SISTEMA_LOGIN_*.md" del "SISTEMA_LOGIN_*.md" /q
if exist "USUARIOS_PRUEBA.md" del "USUARIOS_PRUEBA.md" /q
if exist "TEST_*.md" del "TEST_*.md" /q

REM Eliminar archivos bat innecesarios
echo Eliminando scripts bat duplicados...
if exist "start-frontend-only.bat" del "start-frontend-only.bat" /q

echo.
echo ===============================================
echo ✅ LIMPIEZA COMPLETADA
echo ===============================================
echo.
echo Archivos eliminados:
echo - Archivos de prueba temporales (test-*.js, debug-*.js)
echo - Documentación duplicada y obsoleta
echo - Scripts bat innecesarios
echo - Archivos de verificación temporales
echo.
pause
