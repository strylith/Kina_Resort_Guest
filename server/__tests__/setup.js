// Test setup file
process.env.USE_MOCK_DB = 'true';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-tests';

// Import mock client
import { mockClient } from '../db/databaseClient.js';

// Reset database before each test
beforeEach(() => {
  mockClient.reset();
  if (process.env.DEBUG_TESTS) {
    console.log('🧹 Test database reset');
  }
});

// Setup default test data
beforeAll(() => {
  if (process.env.DEBUG_TESTS) {
    console.log('🧩 Seeding mock database...');
  }
  
  // Seed default packages for tests that need them
  try {
    mockClient.seed('packages', [
      {
        id: 1,
        title: 'Standard Room',
        category: 'rooms',
        price: '₱5,500/night',
        capacity: 4,
        description: 'Comfortable room with air conditioning',
        image_url: 'images/room1.jpg',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Beachfront Cottage',
        category: 'cottages',
        price: '₱9,500/night',
        capacity: 6,
        description: 'Beach access cottage',
        image_url: 'images/cottage1.jpg',
        created_at: new Date().toISOString()
      }
    ]);
    
    if (process.env.DEBUG_TESTS) {
      console.log('✅ Default test data seeded');
    }
  } catch (error) {
    // Ignore seeding errors - tests will seed their own data
  }
  
  if (process.env.DEBUG_TESTS) {
    console.log('✅ Test environment initialized');
  }
});

