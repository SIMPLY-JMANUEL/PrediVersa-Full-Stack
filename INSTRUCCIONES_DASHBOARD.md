# INSTRUCCIONES PARA USAR EL DASHBOARD ADMINISTRADOR

## 🔧 PROBLEMA IDENTIFICADO

El dashboard de administrador aparece en blanco porque requiere autenticación válida para mostrar contenido.

## 🔑 CREDENCIALES DE ACCESO

Según la base de datos, estos son los usuarios disponibles:

```
1. Usuario: Admin
   Correo: hals_93@hotmail.es
   Perfil: Administrador
   Contraseña: [Necesita verificación]

2. Usuario: Moder
   Correo: Prueba@hotmail.com
   Perfil: Moderador
   Contraseña: [Necesita verificación]

3. Usuario: User
   Correo: Prueba2@gmail.com
   Perfil: Estudiante
   Contraseña: [Necesita verificación]
```

## 🚀 PASOS PARA ACCEDER AL DASHBOARD

### 1. Asegúrate de que todos los servicios estén ejecutándose:
```bash
# Ejecutar desde el directorio raíz del proyecto
.\start-all.bat
```

### 2. Verificar que los servicios estén activos:
- ✅ Backend: http://localhost:5001/api
- ✅ API Gateway: http://localhost:3001
- ✅ Frontend: http://localhost:3000

### 3. Acceder al sistema:
1. Abrir navegador en: http://localhost:3000
2. Ir a la página de login: http://localhost:3000/login
3. Usar las credenciales de administrador

### 4. Solución temporal si el dashboard está en blanco:
- Ahora el dashboard mostrará un mensaje de carga mientras verifica la autenticación
- Si hay error de autenticación, se redirigirá automáticamente al login

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Si el dashboard sigue en blanco:
1. **Verificar token en localStorage**: Abrir herramientas de desarrollador (F12) → Application → Local Storage → verificar si existe 'token'
2. **Verificar conexión backend**: Probar http://localhost:5001/api/test
3. **Verificar errores en consola**: Revisar la consola del navegador (F12) para errores

### Si el login no funciona:
1. **Verificar credenciales**: Usar exactamente "Admin" como usuario
2. **Verificar contraseña**: La contraseña por defecto debería ser "123456"
3. **Verificar logs del backend**: Revisar la consola del backend para mensajes de debug

## 🛠️ SOLUCIÓN DEFINITIVA

Para resolver completamente el problema:

### 1. Verificar contraseñas hasheadas:
```javascript
// Ejecutar este script para verificar contraseñas
node verify-users.js
```

### 2. Crear usuario administrador de prueba:
```javascript
// Crear nuevo usuario con contraseña conocida
// (Implementar endpoint para crear usuarios si no existe)
```

### 3. Alternativa - Resetear contraseña:
```sql
-- Ejecutar en SQL Server para resetear contraseña
UPDATE Usuarios SET Contrasena = '$2a$10$...' WHERE Usuario = 'Admin';
```

## 📋 ESTADO ACTUAL

- ✅ **Sistema**: Todos los servicios funcionando
- ✅ **Backend**: Conectado a base de datos
- ✅ **Frontend**: Cargando correctamente
- ❌ **Autenticación**: Problema con credenciales
- ⚠️ **Dashboard**: Protegido por autenticación

## 🎯 PRÓXIMOS PASOS

1. **Inmediato**: Verificar credenciales exactas en la base de datos
2. **Corto plazo**: Crear endpoint para resetear contraseñas
3. **Largo plazo**: Implementar sistema de recuperación de contraseñas

---

**Última actualización**: 14 de Julio de 2025
**Estado**: Sistema funcionando, problema de autenticación identificado
