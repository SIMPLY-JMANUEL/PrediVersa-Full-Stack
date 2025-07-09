const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

describe('Backend API Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        correo: 'test@example.com',
        contraseña: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('correo', loginData.correo);
    });

    it('should return 400 for invalid credentials', async () => {
      const loginData = {
        correo: 'wrong@example.com',
        contraseña: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('msg');
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('msg');
    });
  });

  describe('GET /api/profile', () => {
    let authToken;

    beforeAll(async () => {
      // Crear un token válido para las pruebas
      const payload = {
        id: 1,
        correo: 'test@example.com',
        rol: 'student',
      };
      authToken = jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('correo', 'test@example.com');
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/profile').expect(401);

      expect(response.body).toHaveProperty('msg');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('msg');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const userData = {
        nombre: 'Test User',
        correo: 'newuser@example.com',
        contraseña: 'password123',
        rol: 'student',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('correo', userData.correo);
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        nombre: 'Test User',
        correo: 'existing@example.com',
        contraseña: 'password123',
        rol: 'student',
      };

      // Primer registro
      await request(app).post('/api/auth/register').send(userData);

      // Segundo registro con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('msg');
    });
  });

  describe('GET /api/test', () => {
    it('should return server status', async () => {
      const response = await request(app).get('/api/test').expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});

describe('Middleware Tests', () => {
  describe('Auth Middleware', () => {
    it('should validate JWT token correctly', async () => {
      const validPayload = {
        id: 1,
        correo: 'test@example.com',
        rol: 'student',
      };

      const token = jwt.sign(
        validPayload,
        process.env.JWT_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.user.id).toBe(validPayload.id);
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests under limit', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).get('/api/test').expect(200);
      }
    });

    // Este test requeriría configuración especial para testing
    it.skip('should block requests over limit', async () => {
      // Test de rate limiting requiere configuración especial
    });
  });
});

describe('Database Integration Tests', () => {
  // Estos tests requerirían una base de datos de prueba
  it.skip('should connect to test database', () => {
    // Test de conexión a BD
  });

  it.skip('should create user in database', () => {
    // Test de creación de usuario real
  });

  it.skip('should authenticate user from database', () => {
    // Test de autenticación real
  });
});
