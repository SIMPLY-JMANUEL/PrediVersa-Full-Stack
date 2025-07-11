# 🔗 Configuración de Base de Datos SQL Server - PrediVersa

## 📋 Información de Conexión

```
Servidor: DESKTOP-5R27AVI\PREDIVERSA
Base de Datos: PrediVersa
Usuario: sa
Contraseña: 123456789
Puerto: 1433 (por defecto)
```

## 🚀 Configuración Realizada

### 1. **Dependencias Instaladas**
- ✅ `mssql`: Driver de Node.js para SQL Server
- ✅ `bcryptjs`: Ya instalado para hash de contraseñas

### 2. **Archivos Creados/Modificados**

#### `backend/config/database.js`
- Configuración de conexión a SQL Server
- Pool de conexiones para mejor rendimiento
- Funciones utilitarias para consultas
- Manejo de errores y reconexión

#### `backend/models/User.js`
- Modelo de usuario con métodos para:
  - Crear tabla de usuarios
  - Insertar usuarios por defecto
  - Buscar por username o email
  - Verificar contraseñas
  - CRUD completo de usuarios

#### `backend/routes/auth.js` (Modificado)
- Login ahora usa base de datos SQL Server
- Mantiene compatibilidad con usuario o email
- Verificación de contraseñas con bcrypt

#### `backend/server.js` (Modificado)
- Inicialización automática de base de datos al startup
- Creación de tablas si no existen
- Inserción de usuarios por defecto
- Manejo graceful de cierre de conexiones

#### `database/init-database.sql`
- Script SQL para crear la estructura completa
- Tablas: usuarios, encuestas, preguntas, respuestas, pqr
- Ejecutar manualmente en SQL Server si es necesario

## 🎯 Usuarios por Defecto

Al iniciar el backend, se crearán automáticamente:

| Usuario     | Email                     | Contraseña | Rol       |
|-------------|---------------------------|------------|-----------|
| admin       | admin@prediversa.com      | admin123   | admin     |
| profesor    | profesor@prediversa.com   | admin123   | teacher   |
| estudiante  | estudiante@prediversa.com | admin123   | student   |
| padre       | padre@prediversa.com      | admin123   | parent    |
| moderador   | moderador@prediversa.com  | admin123   | moderator |

## 🔧 Cómo Funciona

### 1. **Al Iniciar el Backend:**
```
🔌 Conectando a SQL Server...
📋 Inicializando tablas...
✅ Tabla usuarios verificada/creada
👥 Usuarios por defecto insertados correctamente
✅ Base de datos inicializada correctamente
```

### 2. **En caso de Error de Conexión:**
- El sistema continúa funcionando con datos en memoria
- Se muestra mensaje de advertencia
- No interrumpe el funcionamiento de la aplicación

### 3. **Pool de Conexiones:**
- Máximo 10 conexiones simultáneas
- Timeout de 30 segundos para conexiones inactivas
- Reconexión automática en caso de fallos

## 🛠️ Configuración Manual (Si es Necesario)

### 1. **Verificar SQL Server:**
```sql
-- En SQL Server Management Studio o Azure Data Studio
SELECT @@SERVERNAME as Servidor, @@VERSION as Version;
```

### 2. **Crear Base de Datos Manualmente:**
```bash
# Ejecutar el script SQL
sqlcmd -S DESKTOP-5R27AVI\PREDIVERSA -U sa -P 123456789 -i database/init-database.sql
```

### 3. **Verificar Conexión:**
```bash
# En el backend, verificar logs al iniciar
npm start
```

## 🔍 Troubleshooting

### Error: "Login failed for user 'sa'"
- Verificar que SQL Server esté ejecutándose
- Verificar credenciales en `backend/config/database.js`
- Asegurar que SQL Server Authentication esté habilitado

### Error: "Cannot connect to server"
- Verificar nombre del servidor: `DESKTOP-5R27AVI\PREDIVERSA`
- Verificar que SQL Server Browser esté ejecutándose
- Verificar firewall y puertos

### Error: "Database does not exist"
- Ejecutar script `database/init-database.sql`
- O permitir que la aplicación cree las tablas automáticamente

## 📊 Estructura de Tablas Creadas

1. **usuarios**: Datos de autenticación y perfil
2. **encuestas**: Metadata de encuestas
3. **preguntas**: Preguntas de cada encuesta
4. **respuestas**: Respuestas de usuarios
5. **pqr**: Sistema de peticiones, quejas y reclamos

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Pool de conexiones con límites
- ✅ Parámetros preparados (evita SQL injection)
- ✅ Validación de entrada
- ✅ Manejo de errores sin exponer información sensible

## 🚀 Próximos Pasos

1. **Migrar otros endpoints** para usar SQL Server
2. **Implementar sistema de encuestas** con nuevas tablas
3. **Agregar logging** de actividades de usuarios
4. **Implementar backup automático** de base de datos
