# PrediVersa - Sistema de Gestión Educativa

## 🚀 Descripción del Proyecto

PrediVersa es un sistema integral de gestión educativa que permite la administración de usuarios, recursos educativos y el seguimiento del progreso académico. El sistema está construido con una arquitectura de microservicios utilizando React, Node.js y SQL Server.

## 📋 Características Principales

- **Gestión de Usuarios**: Administración completa de estudiantes, profesores, padres y administradores
- **Dashboards Personalizados**: Interfaces específicas para cada rol de usuario
- **Sistema de Autenticación**: JWT-based authentication con middleware de seguridad
- **Base de Datos**: Integración con SQL Server para persistencia de datos
- **API Gateway**: Centralización de requests y manejo de autenticación
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos

## 🏗️ Arquitectura del Sistema

```
PrediVersa-Full-Stack/
├── frontend/           # Aplicación React
├── backend/            # API Node.js/Express
├── api-gateway/        # Gateway de servicios
└── scripts/           # Scripts de inicio y utilidades
```

## 📦 Tecnologías Utilizadas

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 con diseño responsive

### Backend
- Node.js
- Express.js
- JWT para autenticación
- bcrypt para encriptación
- mssql para conexión a SQL Server

### Base de Datos
- SQL Server
- Diseño normalizado con tablas de usuarios, roles y perfiles

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- SQL Server
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd PrediVersa-Full-Stack
```

2. **Instalar dependencias**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# API Gateway
cd ../api-gateway
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la carpeta `backend/`:
```env
NODE_ENV=development
PORT=5001
JWT_SECRET=tu_clave_secreta_super_segura
DB_SERVER=tu_servidor_sql
DB_DATABASE=PrediVersa
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
```

4. **Configurar la base de datos**
- Crear base de datos `PrediVersa` en SQL Server
- Ejecutar los scripts de creación de tablas (se ejecutan automáticamente al iniciar el backend)

## 🚀 Ejecución del Sistema

### Opción 1: Inicio Automático
```bash
# Desde el directorio raíz
start-all.bat
```

### Opción 2: Inicio Manual
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - API Gateway
cd api-gateway
npm start

# Terminal 3 - Frontend
cd frontend
npm start
```

## 📊 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token

### Administración
- `GET /api/admin/users` - Obtener usuarios
- `POST /api/admin/users` - Crear usuario
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario

### Estadísticas
- `GET /api/stats/dashboard` - Estadísticas del dashboard
- `GET /api/stats/users` - Estadísticas de usuarios

## 🔐 Roles de Usuario

- **Administrador**: Acceso completo al sistema
- **Profesor**: Gestión de estudiantes y recursos
- **Estudiante**: Acceso a recursos y actividades
- **Padre**: Seguimiento del progreso del estudiante
- **Moderador**: Gestión de contenido y usuarios

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Monitoreo

El sistema incluye:
- Logging detallado en consola
- Manejo de errores centralizado
- Rate limiting para APIs
- Validación de datos de entrada

## 🔧 Mantenimiento

### Limpieza del Proyecto
```bash
# Ejecutar script de limpieza
clean-project.bat
```

### Backup de Base de Datos
Se recomienda realizar backups regulares de la base de datos SQL Server.

## 📝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o reporte de bugs, por favor abrir un issue en el repositorio.

---

**Versión**: 1.0.0
**Última actualización**: Diciembre 2025
