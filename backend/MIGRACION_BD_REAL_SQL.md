# Guía de Migración: De Base de Datos Simulada a Base de Datos Real (SQL)

Este documento explica el paso a paso para migrar la base de datos simulada de usuarios en el backend de PrediVersa a una base de datos real utilizando un sistema SQL (por ejemplo, MySQL o PostgreSQL).

---

## 1. Requisitos Previos

- Tener Node.js y npm instalados.
- Tener una base de datos SQL (MySQL, PostgreSQL, etc.) creada y accesible.
- Acceso al backend del proyecto (`backend/`).

## 2. Instalar Dependencias

Ejecuta en la carpeta `backend/` según el motor de base de datos:

**Para MySQL:**

```bash
npm install mysql2 sequelize
```

**Para PostgreSQL:**

```bash
npm install pg pg-hstore sequelize
```

## 3. Configurar Sequelize

Crea un archivo `models/index.js` con la configuración de Sequelize:

```js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Cambia a 'postgres' si usas PostgreSQL
  }
);

module.exports = sequelize;
```

Agrega las variables en tu archivo `.env`:

```
DB_NAME=prediversa
DB_USER=usuario
DB_PASS=contraseña
DB_HOST=localhost
```

## 4. Crear el Modelo de Usuario

Crea un archivo `models/User.js`:

```js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false, unique: true },
  contraseña: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.ENUM('admin', 'teacher', 'student', 'parent', 'moderator'),
    allowNull: false,
  },
});

module.exports = User;
```

## 5. Sincronizar el Modelo con la Base de Datos

En el archivo principal (`server.js`):

```js
const sequelize = require('./models');

sequelize
  .sync()
  .then(() => console.log('Base de datos sincronizada'))
  .catch(err => console.error('Error al sincronizar BD:', err));
```

## 6. Reemplazar la Base Simulada por el Modelo

En `routes/auth.js`, elimina el array `users` y usa el modelo `User`:

```js
const User = require('../models/User');
```

- Para buscar usuarios: `const user = await User.findOne({ where: { correo } });`
- Para crear usuarios: `const newUser = await User.create({ ... });`

## 7. Actualizar los Endpoints

Modifica los endpoints `/login`, `/register`, etc., para usar operaciones de Sequelize en vez del array local.

## 8. Probar la Migración

- Ejecuta el backend y prueba el registro, login y recuperación de contraseña.
- Verifica que los datos se almacenan y consultan desde la base SQL.

## 9. Eliminar la Base Simulada

Una vez verificado el funcionamiento, elimina el array `users` del código.

## 10. Consideraciones de Seguridad

- Nunca subas contraseñas en texto plano ni credenciales de conexión a repositorios públicos.
- Usa variables de entorno para datos sensibles.

---

**¡Listo! Ahora tu backend utiliza una base de datos SQL real y escalable.**
