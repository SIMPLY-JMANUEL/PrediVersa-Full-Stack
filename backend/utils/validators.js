// utils/validators.js
// Validadores y generadores reutilizables para PrediVersa

/**
 * Genera un nombre de usuario automático.
 * @param {string} nombre
 * @param {string} documento
 * @returns {string}
 */
function generateAutoUsername(nombre, documento) {
  const cleanName = nombre.toLowerCase().replace(/\s+/g, '');
  const lastDigits = (documento || '').slice(-4);
  return `${cleanName.slice(0, 8)}${lastDigits}`;
}

/**
 * Genera un email institucional automático.
 * @param {string} nombre
 * @param {string} apellido
 * @param {string} [domain]
 * @returns {string}
 */
function generateAutoEmail(
  nombre,
  apellido = '',
  domain = process.env.EMAIL_DOMAIN || '@prediversa.edu.co'
) {
  const cleanName = nombre.toLowerCase().replace(/\s+/g, '');
  const cleanLastName = (apellido || '').toLowerCase().replace(/\s+/g, '');
  return `${cleanName}${
    cleanLastName ? `.${cleanLastName.slice(0, 6)}` : ''
  }${domain}`;
}

/**
 * Genera una contraseña segura aleatoria.
 * @param {number} [length]
 * @returns {string}
 */
function generateAutoPassword(length = 12) {
  const chars =
    'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Valida la seguridad de una contraseña.
 * @param {string} password
 * @returns {boolean}
 */
function isValidPassword(password) {
  // Mínimo 10 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
  return (
    typeof password === 'string' &&
    password.length >= 10 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%&*]/.test(password)
  );
}

/**
 * Valida un teléfono internacional.
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {
  return typeof phone === 'string' && /^\+?[1-9][\d]{6,14}$/.test(phone);
}

/**
 * Valida un email básico.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
  generateAutoUsername,
  generateAutoEmail,
  generateAutoPassword,
  isValidPassword,
  isValidPhone,
  isValidEmail,
};
