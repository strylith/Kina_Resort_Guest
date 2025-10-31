import request from 'supertest';
import express from 'express';
import usersRoutes from '../../routes/users.js';
import { db, dbAuth, mockClient } from '../../db/databaseClient.js';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/users', usersRoutes);

// Mock authenticateToken middleware
const mockAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'test-secret');
    req.user = { user: { id: decoded.userId } };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// This would normally be in the actual routes file, but for testing we need to wrap it
// We'll create a wrapper that applies auth middleware
const wrappedRoutes = express.Router();
wrappedRoutes.use(mockAuth);
wrappedRoutes.use(usersRoutes);

const appWithAuth = express();
appWithAuth.use(express.json());
appWithAuth.use('/api/users', mockAuth);
appWithAuth.use('/api/users', usersRoutes);

describe('Users Routes', () => {
  let authToken;
  let userId;

  beforeEach(async () => {
    mockClient.reset();
    
    // Create a test user in auth system first
    userId = 'test-user-123';
    await dbAuth.admin.createUser({
      id: userId,
      email: 'test@example.com',
      user_metadata: { firstName: 'Test', lastName: 'User' }
    });
    
    // Generate token
    authToken = jwt.sign({ userId }, process.env.JWT_SECRET || 'test-secret');
    
    // Seed user profile
    mockClient.seed('users', [
      {
        id: userId,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        member_since: new Date().toISOString(),
        loyalty_points: 100,
        total_bookings: 2
      }
    ]);
    
    // Seed bookings
    mockClient.seed('bookings', [
      {
        id: 1,
        user_id: userId,
        status: 'confirmed',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        user_id: userId,
        status: 'completed',
        created_at: new Date().toISOString()
      }
    ]);
  });

  describe('GET /api/users/profile', () => {
    it('should return user profile with stats', async () => {
      const response = await request(appWithAuth)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.profile.email).toBe('test@example.com');
      expect(response.body.data.stats.totalBookings).toBe(2);
    });
  });

  describe('PATCH /api/users/profile', () => {
    it('should update user profile', async () => {
      const response = await request(appWithAuth)
        .patch('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Updated',
          lastName: 'Name'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Updated');
      expect(response.body.data.lastName).toBe('Name');
    });
  });
});


