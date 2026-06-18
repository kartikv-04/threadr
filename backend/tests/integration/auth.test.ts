import request from 'supertest';
import app from '../../src/app.js';
import * as dbHandler from '../helpers/dbConnection.js';

// Authentication Integration Tests
describe('Auth Integration Tests', () => {
  // Connect to the in-memory database before all tests run
  beforeAll(async () => {
    await dbHandler.connect();
  }, 60000);

  // Clear all database collections after each test to keep a clean slate
  afterEach(async () => {
    await dbHandler.clearDatabase();
  });

  // Drop database, disconnect Mongoose, and stop the memory server
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  // Now we can use a stable email since database is cleared after each test
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test@123'
  };

  // Signup Test
  describe('POST /api/v1/users/signup', () => {
    test('user should be able to signup correctly', async () => {
      const res = await request(app).post('/api/v1/users/signup').send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('server');
      expect(res.body.data.user).toHaveProperty('email');
      expect(res.body.data.user).toHaveProperty('accessToken');
    });
  });

  // Signin Test
  describe('POST /api/v1/users/signin', () => {
    test('user should be able to signin correctly', async () => {
      // First register the user since database was cleared after signup test
      await request(app).post('/api/v1/users/signup').send(testUser);

      const res = await request(app).post('/api/v1/users/signin').send(testUser);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data.user).toHaveProperty('id');
      expect(res.body.data.user).toHaveProperty('email');
      expect(res.body.data.user).toHaveProperty('accessToken');
    });
  });
});
