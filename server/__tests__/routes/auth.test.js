import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth.js';
import { db, dbAuth, mockClient } from '../../db/databaseClient.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    mockClient.reset();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('All fields are required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // First create a user via registration to ensure both auth and profile exist
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'testpass123',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(200);

      expect(registerResponse.body.success).toBe(true);
      const userId = registerResponse.body.user.id;

      // Now test login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'testpass123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpass'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});


