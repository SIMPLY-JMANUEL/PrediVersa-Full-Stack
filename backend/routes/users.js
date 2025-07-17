// routes/users.js
// Rutas para gestión de usuarios conectadas a Dbo.Usuarios

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { jwtRequired, roleRequired } = require('../utils/jwt');

// GET /users/search - Buscar usuarios por documento o nombre
router.get('/search', jwtRequired, roleRequired('admin'), userController.searchUsers);

// GET /users - Obtener lista de usuarios con paginación
router.get('/', jwtRequired, roleRequired('admin'), userController.getAllUsers);

// GET /users/:id - Obtener usuario por ID
router.get('/:id', jwtRequired, roleRequired('admin'), userController.getUserById);

// PUT /users/:id - Actualizar usuario
router.put('/:id', jwtRequired, roleRequired('admin'), userController.updateUser);

// DELETE /users/:id - Eliminar usuario (cambiar estado a inactivo)
router.delete('/:id', jwtRequired, roleRequired('admin'), userController.deleteUser);

module.exports = router;
