# 🎯 SISTEMA DE LOGIN CONDICIONAL - PrediVersa

## ✅ **IMPLEMENTACIÓN COMPLETADA**

### 🗄️ **Base de Datos SQL Server**
- **Servidor**: `DESKTOP-5R27AVI\PREDIVERSA`
- **Base de datos**: `PrediVersa`
- **Tabla**: `dbo.usuarios`

### 📊 **Estructura de la Tabla usuarios**
```sql
Id_Usuario (int) - ID único
Nombre_Completo (varchar(50)) - Nombre del usuario
Usuario (varchar(50)) - Usuario para login
Correo (varchar(50)) - Email del usuario
Contrasena (nchar(10)) - Contraseña
Perfil (varchar(50)) - Rol del usuario
Activo (varchar(50)) - Estado del usuario (SI/NO)
Identificacion (varchar(50)) - Documento de identidad
Contacto_Emergencia (varchar(50)) - Contacto de emergencia
```

### 👥 **Usuarios Disponibles**
1. **Admin** (Administrador)
   - Usuario: `Admin`
   - Contraseña: `123456789`
   - Correo: `hals_93@hotmail.es`
   - Rol: `Administrador`
   - Dashboard: `/Admin` → `AdminDashboard.tsx`

2. **Moder** (Moderador)
   - Usuario: `Moder`
   - Contraseña: `123456789`
   - Correo: `Prueba@hotmail.com`
   - Rol: `Moderador`
   - Dashboard: `/Moderador` → `ModeratorDashboard.tsx`

3. **User** (Estudiante)
   - Usuario: `User`
   - Contraseña: `123456789`
   - Correo: `Prueba2@gmail.com`
   - Rol: `Estudiante`
   - Dashboard: `/Estudiante` → `StudentDashboard.tsx`

### 🔀 **Mapeo de Roles a Dashboards**
```javascript
const profileRoutes = {
  'Administrador': '/Admin',
  'Moderador': '/Moderador', 
  'Estudiante': '/Estudiante',
  'Acudiente': '/Acudiente',
  'Docente': '/Docente'
};
```

### 📁 **Archivos de Dashboard**
```
frontend/src/pages/dashboards/
├── AdminDashboard.tsx          (/Admin)
├── ModeratorDashboard.tsx      (/Moderador)
├── StudentDashboard.tsx        (/Estudiante)
├── AttendantDashboard.tsx      (/Acudiente) - ✨ NUEVO
└── TeacherDashboard.tsx        (/Docente)
```

### 🔐 **Lógica Condicional de Login**

#### **Backend (routes/auth.js)**
```javascript
// 1. Validar credenciales
const user = await User.findByUsernameOrEmail(identifier);

// 2. Verificar estado activo
if (user.activo !== 'SI') {
  return error('Usuario inactivo');
}

// 3. Verificar contraseña
const isMatch = await User.verifyPassword(password, user.contraseña);

// 4. Generar token JWT con ruta de dashboard
const dashboardRoute = profileRoutes[user.rol] || '/dashboard';

// 5. Retornar usuario con información completa
return {
  success: true,
  token,
  user: {
    id, nombre, usuario, correo, rol, 
    dashboardRoute
  }
}
```

#### **Frontend (LoginNew.jsx)**
```javascript
// 1. Enviar credenciales al backend
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ usuario, password })
});

// 2. Verificar respuesta exitosa
if (data.success && data.user.activo === 'SI') {
  
  // 3. Guardar datos en localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // 4. Redirigir según el rol
  const dashboardRoute = getDashboardRoute(data.user.rol);
  navigate(dashboardRoute);
}
```

#### **Enrutamiento (AppRouterNew.tsx)**
```jsx
<Routes>
  <Route path="/Admin" element={
    <ProtectedRoute requiredRole="Administrador">
      <AdminDashboard />
    </ProtectedRoute>
  } />
  <Route path="/Moderador" element={
    <ProtectedRoute requiredRole="Moderador">
      <ModeratorDashboard />
    </ProtectedRoute>
  } />
  {/* ... más rutas por rol ... */}
</Routes>
```

### 🛡️ **Protección de Rutas**
- **ProtectedRoute.jsx** actualizado para validar roles
- Verificación de token JWT
- Validación de estado activo del usuario
- Redirección automática según permisos

### 🎯 **Características Implementadas**

✅ **Autenticación por base de datos real**
✅ **Validación de estado activo (SI/NO)**
✅ **Mapeo automático de roles a dashboards**
✅ **Protección de rutas por rol**
✅ **Dashboard específico para Acudientes (AttendantDashboard)**
✅ **Token JWT con información completa del usuario**
✅ **Manejo de errores y validaciones**
✅ **Redirección automática post-login**

### 🚀 **Para Iniciar el Sistema**

1. **Backend**:
   ```bash
   cd backend
   npm start
   # Servidor en http://localhost:5001
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm start
   # Aplicación en http://localhost:3000
   ```

3. **Login de prueba**:
   - Usuario: `Admin`
   - Contraseña: `123456789`
   - Resultado: Redirección a `/Admin` (AdminDashboard)

### 📝 **Notas Técnicas**
- Las contraseñas actuales NO están hasheadas
- La columna `Activo` tiene padding de espacios en algunos registros
- Se implementó limpieza automática de caracteres nulos y espacios
- El sistema soporta tanto usuario como correo para login
- JWT expira en 24 horas

## 🎉 **SISTEMA COMPLETAMENTE FUNCIONAL**
