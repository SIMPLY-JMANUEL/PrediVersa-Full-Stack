# PrediVersa Backend

Backend para la aplicación PrediVersa - Sistema de autenticación y gestión de usuarios.

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo `.env` y ajusta las variables según sea necesario
2. El JWT_SECRET debe cambiarse en producción

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## API Endpoints

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/me` - Obtener información del usuario autenticado

### Usuarios de prueba

- **Admin (Juliana Fajardo)**: admin@prediversa.com / admin123
- **Profesor (Andrey Luna)**: profesor@prediversa.com / admin123
- **Estudiante (Carlos Rodríguez)**: estudiante@prediversa.com / admin123
- **Padre (Harold Salcedo)**: padre@prediversa.com / admin123
- **Moderador**: moderador@prediversa.com / admin123

## Estructura del proyecto

```
backend/
├── routes/
│   └── auth.js          # Rutas de autenticación
├── .env                 # Variables de entorno
├── package.json         # Dependencias
├── server.js           # Servidor principal
└── README.md           # Este archivo
```
