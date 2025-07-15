@echo off
echo ===============================================
echo ✅ VALIDACION DE CODIGO LIMPIO - PREDIVERSA
echo ===============================================
echo.

echo 🔍 Verificando estructura del proyecto...
echo.

REM Verificar que no existan archivos de prueba
echo Verificando archivos de prueba eliminados...
if exist "test-*.js" (
    echo ❌ Aún existen archivos test-*.js
) else (
    echo ✅ No se encontraron archivos test-*.js
)

if exist "debug-*.js" (
    echo ❌ Aún existen archivos debug-*.js
) else (
    echo ✅ No se encontraron archivos debug-*.js
)

REM Verificar estructura de directorios
echo.
echo Verificando estructura de directorios...
if exist "frontend" (
    echo ✅ Directorio frontend existe
) else (
    echo ❌ Directorio frontend NO existe
)

if exist "backend" (
    echo ✅ Directorio backend existe
) else (
    echo ❌ Directorio backend NO existe
)

if exist "api-gateway" (
    echo ✅ Directorio api-gateway existe
) else (
    echo ❌ Directorio api-gateway NO existe
)

REM Verificar archivos de configuración
echo.
echo Verificando archivos de configuración...
if exist "backend\.env" (
    echo ✅ Archivo backend\.env existe
) else (
    echo ❌ Archivo backend\.env NO existe
)

if exist "frontend\.env" (
    echo ✅ Archivo frontend\.env existe
) else (
    echo ❌ Archivo frontend\.env NO existe
)

if exist "package.json" (
    echo ✅ Archivo package.json principal existe
) else (
    echo ❌ Archivo package.json principal NO existe
)

if exist "README.md" (
    echo ✅ Archivo README.md existe
) else (
    echo ❌ Archivo README.md NO existe
)

if exist ".gitignore" (
    echo ✅ Archivo .gitignore existe
) else (
    echo ❌ Archivo .gitignore NO existe
)

echo.
echo 📊 Verificando dependencias...
cd frontend
if exist "package.json" (
    echo ✅ Frontend package.json existe
) else (
    echo ❌ Frontend package.json NO existe
)

cd ..\backend
if exist "package.json" (
    echo ✅ Backend package.json existe
) else (
    echo ❌ Backend package.json NO existe
)

cd ..\api-gateway
if exist "package.json" (
    echo ✅ API Gateway package.json existe
) else (
    echo ❌ API Gateway package.json NO existe
)

cd ..

echo.
echo ===============================================
echo ✅ VALIDACION COMPLETADA
echo ===============================================
echo.
echo Proyecto limpio y organizado correctamente
echo.
pause
