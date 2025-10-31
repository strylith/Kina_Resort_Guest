import request from 'supertest';
import express from 'express';
import packagesRoutes from '../../routes/packages.js';
import { db, mockClient } from '../../db/databaseClient.js';

const app = express();
app.use(express.json());
app.use('/api/packages', packagesRoutes);

describe('Packages Routes', () => {
  beforeEach(() => {
    mockClient.reset();
    
    // Seed test data
    mockClient.seed('packages', [
      {
        id: 1,
        title: 'Standard Room',
        category: 'rooms',
        price: '₱5,500/night',
        capacity: 4,
        description: 'Comfortable room',
        image_url: 'images/room1.jpg'
      },
      {
        id: 2,
        title: 'Beachfront Cottage',
        category: 'cottages',
        price: '₱9,500/night',
        capacity: 6,
        description: 'Beach access cottage',
        image_url: 'images/cottage1.jpg'
      }
    ]);
  });

  describe('GET /api/packages', () => {
    it('should return all packages', async () => {
      const response = await request(app)
        .get('/api/packages')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
    });

    it('should filter packages by category', async () => {
      const response = await request(app)
        .get('/api/packages?category=cottages')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].category).toBe('cottages');
    });
  });

  describe('GET /api/packages/:id', () => {
    it('should return a single package', async () => {
      const response = await request(app)
        .get('/api/packages/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(1);
      expect(response.body.data.title).toBe('Standard Room');
    });

    it('should return 404 for non-existent package', async () => {
      const response = await request(app)
        .get('/api/packages/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});



