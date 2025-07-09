# Guía de Migración: De Base de Datos Simulada a Base de Datos Real (MongoDB)

Este documento explica el paso a paso para migrar la base de datos simulada de usuarios en el backend de PrediVersa a una base de datos real utilizando MongoDB.

---

## 1. Requisitos Previos

- Tener Node.js y npm instalados.
- Tener una cuenta y base de datos en MongoDB Atlas o una instancia local de MongoDB.
- Acceso al backend del proyecto (`backend/`).

## 2. Instalar Dependencias

Ejecuta en la carpeta `backend/`:

```bash
npm install mongoose
```

## 3. Crear el Modelo de Usuario

Crea un archivo `models/User.js` con el siguiente contenido:

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: {
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent', 'moderator'],
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
```

## 4. Configurar la Conexión a MongoDB

En el archivo principal del backend (`server.js` o similar), agrega:

```js
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));
```

Agrega la variable `MONGODB_URI` en tu archivo `.env`:

```
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/prediversa
```

## 5. Reemplazar la Base Simulada por el Modelo

En `routes/auth.js`, elimina el array `users` y usa el modelo `User`:

```js
const User = require('../models/User');
```

- Para buscar usuarios: `const user = await User.findOne({ correo });`
- Para crear usuarios: `const newUser = new User({ ... }); await newUser.save();`

## 6. Actualizar los Endpoints

Modifica los endpoints `/login`, `/register`, etc., para usar operaciones de Mongoose en vez del array local.

## 7. Probar la Migración

- Ejecuta el backend y prueba el registro, login y recuperación de contraseña.
- Verifica que los datos se almacenan y consultan desde MongoDB.

## 8. Eliminar la Base Simulada

Una vez verificado el funcionamiento, elimina el array `users` del código.

## 9. Consideraciones de Seguridad

- Nunca subas contraseñas en texto plano ni credenciales de conexión a repositorios públicos.
- Usa variables de entorno para datos sensibles.

---

**¡Listo! Ahora tu backend utiliza una base de datos real y escalable.**
