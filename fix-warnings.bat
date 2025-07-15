@echo off
echo ===============================================
echo 🧹 LIMPIEZA FINAL DE ADVERTENCIAS
echo ===============================================
echo.

echo Aplicando correcciones de ESLint...

REM Navegar al frontend
cd frontend

REM Ejecutar ESLint con fix automático
echo Ejecutando ESLint con corrección automática...
npx eslint src/pages/dashboards/AdminDashboard.jsx --fix

echo.
echo ===============================================
echo ✅ CORRECCIONES APLICADAS
echo ===============================================
echo.

cd ..

echo El código ha sido limpiado automáticamente.
pause
