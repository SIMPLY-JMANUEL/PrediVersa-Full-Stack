// __tests__/profileController.test.js
const { isValidPhone, isValidEmail } = require('../utils/validators');
const profileController = require('../controllers/profileController');

describe('ProfileController', () => {
  test('Rechaza teléfono inválido', () => {
    const req = { user: { id: 1 }, body: { phone: '123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    profileController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      msg: 'Formato de teléfono inválido',
    });
  });

  test('Rechaza email inválido', () => {
    const req = { user: { id: 1 }, body: { email: 'noemail' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    profileController.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: 'Formato de email inválido' });
  });

  test('Actualiza perfil correctamente', () => {
    const req = {
      user: { id: 2 },
      body: { phone: '+573001234567', email: 'test@prediversa.edu.co' },
    };
    const res = { json: jest.fn() };
    profileController.updateProfile(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        phone: '+573001234567',
        email: 'test@prediversa.edu.co',
      })
    );
  });
});
