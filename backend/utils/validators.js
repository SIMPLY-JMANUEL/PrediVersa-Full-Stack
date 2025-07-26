// utils/validators.js
const validator = require('validator');

// Validar email
const validateEmail = email => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email es requerido' };
  }

  if (!validator.isEmail(email)) {
    return { isValid: false, message: 'Formato de email inválido' };
  }

  return { isValid: true };
};

// Validar contraseña
const validatePassword = password => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Contraseña es requerida' };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'La contraseña debe tener al menos 6 caracteres',
    };
  }

  if (password.length > 100) {
    return {
      isValid: false,
      message: 'La contraseña no puede exceder 100 caracteres',
    };
  }

  return { isValid: true };
};

// Validar nombre
const validateName = name => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: 'Nombre es requerido' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return {
      isValid: false,
      message: 'El nombre debe tener al menos 2 caracteres',
    };
  }

  if (trimmedName.length > 50) {
    return {
      isValid: false,
      message: 'El nombre no puede exceder 50 caracteres',
    };
  }

  // Verificar que solo contenga letras, espacios y algunos caracteres especiales
  if (!/^[a-zA-ZÀ-ÿñÑ\s\-'\.]+$/.test(trimmedName)) {
    return {
      isValid: false,
      message: 'El nombre contiene caracteres inválidos',
    };
  }

  return { isValid: true };
};

// Validar teléfono
const validatePhone = phone => {
  if (!phone) {
    return { isValid: true }; // Teléfono es opcional
  }

  if (typeof phone !== 'string') {
    return { isValid: false, message: 'Formato de teléfono inválido' };
  }

  const cleanPhone = phone.replace(/\D/g, ''); // Remover caracteres no numéricos

  if (cleanPhone.length < 7 || cleanPhone.length > 15) {
    return {
      isValid: false,
      message: 'El teléfono debe tener entre 7 y 15 dígitos',
    };
  }

  return { isValid: true };
};

// Validar rol
const validateRole = role => {
  const validRoles = ['admin', 'estudiante', 'profesor', 'padre', 'moderador'];

  if (!role || typeof role !== 'string') {
    return { isValid: false, message: 'Rol es requerido' };
  }

  if (!validRoles.includes(role.toLowerCase())) {
    return {
      isValid: false,
      message: `Rol inválido. Roles válidos: ${validRoles.join(', ')}`,
    };
  }

  return { isValid: true };
};

// Validar ID de usuario
const validateUserId = userId => {
  if (!userId) {
    return { isValid: false, message: 'ID de usuario es requerido' };
  }

  // Verificar si es un número válido
  const numericId = parseInt(userId);
  if (isNaN(numericId) || numericId <= 0) {
    return {
      isValid: false,
      message: 'ID de usuario debe ser un número positivo',
    };
  }

  return { isValid: true };
};

// Validar datos de registro de usuario
const validateUserRegistration = userData => {
  const errors = [];

  // Validar nombre
  const nameValidation = validateName(userData.nombre);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message);
  }

  // Validar email
  const emailValidation = validateEmail(userData.email);
  if (!emailValidation.isValid) {
    errors.push(emailValidation.message);
  }

  // Validar contraseña
  const passwordValidation = validatePassword(userData.password);
  if (!passwordValidation.isValid) {
    errors.push(passwordValidation.message);
  }

  // Validar rol
  const roleValidation = validateRole(userData.role);
  if (!roleValidation.isValid) {
    errors.push(roleValidation.message);
  }

  // Validar teléfono (opcional)
  if (userData.telefono) {
    const phoneValidation = validatePhone(userData.telefono);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validar datos de actualización de usuario
const validateUserUpdate = userData => {
  const errors = [];

  // Validar nombre (si se proporciona)
  if (userData.nombre !== undefined) {
    const nameValidation = validateName(userData.nombre);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.message);
    }
  }

  // Validar email (si se proporciona)
  if (userData.email !== undefined) {
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.message);
    }
  }

  // Validar contraseña (si se proporciona)
  if (userData.password !== undefined) {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.message);
    }
  }

  // Validar teléfono (si se proporciona)
  if (userData.telefono !== undefined) {
    const phoneValidation = validatePhone(userData.telefono);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validar texto general (para descripciones, comentarios, etc.)
const validateText = (text, minLength = 1, maxLength = 1000) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, message: 'Texto es requerido' };
  }

  const trimmedText = text.trim();

  if (trimmedText.length < minLength) {
    return {
      isValid: false,
      message: `El texto debe tener al menos ${minLength} caracteres`,
    };
  }

  if (trimmedText.length > maxLength) {
    return {
      isValid: false,
      message: `El texto no puede exceder ${maxLength} caracteres`,
    };
  }

  return { isValid: true };
};

// Sanitizar entrada de texto
const sanitizeText = text => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return validator.escape(text.trim());
};

// Validar fecha
const validateDate = date => {
  if (!date) {
    return { isValid: false, message: 'Fecha es requerida' };
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, message: 'Formato de fecha inválido' };
  }

  return { isValid: true, date: parsedDate };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateRole,
  validateUserId,
  validateUserRegistration,
  validateUserUpdate,
  validateText,
  validateDate,
  sanitizeText,
};
