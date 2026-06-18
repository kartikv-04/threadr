import request from 'supertest';
import app from '../../src/app.js';
import * as dbHandler from '../helpers/dbConnection.js';

// Room Feature Integration Tests
describe('Room Integration Tests', () => {
  let accessToken1: string;
  let accessToken2: string;
  let serverId: string;
  let createdRoomId: string;

  // Log in and create server before running room tests
  beforeAll(async () => {
    // Connect to the in-memory database
    await dbHandler.connect();

    const testUser1 = {
      name: 'Test User1',
      email: 'room_admin@example.com',
      password: 'password123'
    };

    const testUser2 = {
      name: 'Test User2',
      email: 'room_non_admin@example.com',
      password: 'password123'
    };

    // Register both users
    await request(app).post('/api/v1/users/signup').send(testUser1);
    await request(app).post('/api/v1/users/signup').send(testUser2);

    // Sign in both users and save tokens
    const loginRes1 = await request(app).post('/api/v1/users/signin').send(testUser1);
    accessToken1 = loginRes1.body.data.user.accessToken;

    const loginRes2 = await request(app).post('/api/v1/users/signin').send(testUser2);
    accessToken2 = loginRes2.body.data.user.accessToken;

    // User 1 creates a server
    const serverPayload = { serverName: 'Test Server' };
    const serverRes = await request(app)
      .post('/api/v1/servers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send(serverPayload);

    serverId = serverRes.body.data.serverId;
  }, 60000);

  // Close connection and clean up after all tests are finished
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Perform Room operations', () => {
    // Test 1: Create a room successfully as Server Admin
    test('POST /api/v1/servers/:serverId/rooms - Create a room successfully as Admin', async () => {
      const roomPayload = { roomName: 'announcements' };

      const res = await request(app)
        .post(`/api/v1/servers/${serverId}/rooms`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(roomPayload);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('roomId');
      expect(res.body.data.roomName).toBe(roomPayload.roomName);
      expect(res.body.data.serverId).toBe(serverId);

      createdRoomId = res.body.data.roomId;
    });

    // Test 2: Get room list for a server
    test('GET /api/v1/servers/:serverId/rooms - Get Room List', async () => {
      const res = await request(app)
        .get(`/api/v1/servers/${serverId}/rooms`)
        .set('Authorization', `Bearer ${accessToken1}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('rooms');
      expect(Array.isArray(res.body.data.rooms)).toBe(true);

      // Check that the announcements room is listed
      const foundRoom = res.body.data.rooms.find((r: any) => r.roomId === createdRoomId);
      expect(foundRoom).toBeDefined();
      expect(foundRoom.roomName).toBe('announcements');
    });

    // Test 3: Reject room creation by non-admin member
    test('POST /api/v1/servers/:serverId/rooms - Reject room creation by non-admin user', async () => {
      const roomPayload = { roomName: 'illegal-room' };

      const res = await request(app)
        .post(`/api/v1/servers/${serverId}/rooms`)
        .set('Authorization', `Bearer ${accessToken2}`) // User 2 is not part of the server or is not admin
        .send(roomPayload);

      expect(res.status).toBe(403); // Forbidden
    });

    // Test 4: Reject room deletion by non-admin member if user is not joined
    test('DELETE /api/v1/servers/:serverId/rooms/:roomId - Reject deleting room by non-admin user', async () => {
      const res = await request(app)
        .delete(`/api/v1/servers/${serverId}/rooms/${createdRoomId}`)
        .set('Authorization', `Bearer ${accessToken2}`);

      expect(res.status).toBe(404); // Forbidden
    });

    // Test 5: Reject room deletion by non-admin member if user is joined to server
    test('DELETE /api/v1/servers/:serverId/rooms/:roomId - Reject deleting room by non-admin user', async () => {
      // Generate invite code using 1st user
      const joinInvite = await request(app)
        .post(`/api/v1/servers/${serverId}/invite`)
        .set('Authorization', `Bearer ${accessToken1}`);

      expect(joinInvite.status).toBe(201);
      expect(joinInvite.body.data).toHaveProperty('code');
      expect(joinInvite.body.data).toHaveProperty('url');
      const inviteCode = joinInvite.body.data.code;

      // Make 2nd user join 1y users's Server
      const joinPayload = {
        inviteCode,
        serverId
      };

      const joinReq = await request(app)
        .post('/api/v1/invite/join')
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(joinPayload);

      expect(joinReq.status).toBe(200);
      expect(joinReq.body.data).toHaveProperty('serverId');
      expect(joinReq.body.data.serverId).toBe(serverId);

      const res = await request(app)
        .delete(`/api/v1/servers/${serverId}/rooms/${createdRoomId}`)
        .set('Authorization', `Bearer ${accessToken2}`);

      expect(res.status).toBe(403); // Forbidden
    });

    // Test 6: Delete room successfully as Server Admin
    test('DELETE /api/v1/servers/:serverId/rooms/:roomId - Delete room as Admin', async () => {
      const res = await request(app)
        .delete(`/api/v1/servers/${serverId}/rooms/${createdRoomId}`)
        .set('Authorization', `Bearer ${accessToken1}`);

      expect(res.status).toBe(204);
    });
  });
});
