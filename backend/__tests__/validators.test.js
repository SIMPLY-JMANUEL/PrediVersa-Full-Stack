// __tests__/validators.test.js
const {
  generateAutoUsername,
  generateAutoEmail,
  generateAutoPassword,
  isValidPassword,
  isValidPhone,
  isValidEmail,
} = require('../utils/validators');

describe('Validador y generadores reutilizables', () => {
  test('generateAutoUsername genera correctamente', () => {
    expect(generateAutoUsername('Juan Perez', '12345678')).toMatch(
      /^juanpere5678$/
    );
  });

  test('generateAutoEmail genera email institucional', () => {
    expect(generateAutoEmail('Juan', 'Perez')).toMatch(
      /juan.perez@prediversa.edu.co$/
    );
  });

  test('generateAutoPassword cumple requisitos de seguridad', () => {
    const pwd = generateAutoPassword();
    expect(pwd.length).toBeGreaterThanOrEqual(10);
    expect(/[A-Z]/.test(pwd)).toBe(true);
    expect(/[a-z]/.test(pwd)).toBe(true);
    expect(/[0-9]/.test(pwd)).toBe(true);
    expect(/[!@#$%&*]/.test(pwd)).toBe(true);
  });

  test('isValidPassword valida contraseñas seguras', () => {
    expect(isValidPassword('Abcdef12!')).toBe(true);
    expect(isValidPassword('abc')).toBe(false);
    expect(isValidPassword('1234567890')).toBe(false);
    expect(isValidPassword('ABCDEFGHIJK')).toBe(false);
  });

  test('isValidPhone valida teléfonos internacionales', () => {
    expect(isValidPhone('+573001234567')).toBe(true);
    expect(isValidPhone('3001234567')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });

  test('isValidEmail valida emails', () => {
    expect(isValidEmail('test@prediversa.edu.co')).toBe(true);
    expect(isValidEmail('noemail')).toBe(false);
  });
});
