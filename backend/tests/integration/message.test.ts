import request from 'supertest';
import app from '../../src/app.js';
import * as dbHandler from '../helpers/dbConnection.js';

// Message Feature Integration Tests
describe('Message Integration Tests', () => {
  let accessToken1: string;
  let accessToken2: string;
  let serverId: string;
  let roomId: string;
  let createdMessageId: string;

  // Log in, create server, join second user, and get room details before running tests
  beforeAll(async () => {
    // Connect to the in-memory database
    await dbHandler.connect();

    const testUser1 = {
      name: 'Test User1',
      email: 'message_sender@example.com',
      password: 'password123'
    };

    const testUser2 = {
      name: 'Test User2',
      email: 'message_stranger@example.com',
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

    // User 1 creates a server (this also creates the default 'general' room)
    const serverPayload = { serverName: 'Message Server' };
    const serverRes = await request(app)
      .post('/api/v1/servers')
      .set('Authorization', `Bearer ${accessToken1}`)
      .send(serverPayload);

    serverId = serverRes.body.data.serverId;
    roomId = serverRes.body.data.roomId; // Automatically created room ID

    // User 1 creates an invite link so User 2 can join
    const inviteRes = await request(app)
      .post(`/api/v1/servers/${serverId}/invite`)
      .set('Authorization', `Bearer ${accessToken1}`);
    const inviteCode = inviteRes.body.data.inviteCode;

    // User 2 joins the server so they are a valid member (but not message sender)
    await request(app)
      .post('/api/v1/invite/join')
      .set('Authorization', `Bearer ${accessToken2}`)
      .send({ inviteCode, serverId });
  }, 60000);

  // Close connection and clean up after all tests are finished
  afterAll(async () => {
    await dbHandler.closeDatabase();
  });

  describe('Perform Message Operations', () => {
    // Test 1: Send a message successfully
    test('POST /api/v1/rooms/:roomId/messages - Send a message successfully', async () => {
      const messagePayload = {
        content: 'Hello world!',
        serverId
      };

      const res = await request(app)
        .post(`/api/v1/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(messagePayload);

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('messageId');
      expect(res.body.data.content).toBe('Hello world!');
      expect(res.body.data.roomId).toBe(roomId);
      expect(res.body.data.serverId).toBe(serverId);

      createdMessageId = res.body.data.messageId;
    });

    // Test 2: Get messages from a room
    test('GET /api/v1/rooms/:roomId/messages - Fetch Room Messages', async () => {
      const res = await request(app)
        .get(`/api/v1/rooms/${roomId}/messages`)
        .query({ serverId }) // Pass serverId as query param
        .set('Authorization', `Bearer ${accessToken1}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].content).toBe('Hello world!');
    });

    // Test 3: Edit message successfully as the message creator
    test('PUT /api/v1/rooms/:roomId/messages - Edit own message successfully', async () => {
      const editPayload = {
        messageId: createdMessageId,
        content: 'Hello world edited!'
      };

      const res = await request(app)
        .put(`/api/v1/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(editPayload);

      expect(res.status).toBe(200);
      expect(res.body.data.content).toBe('Hello world edited!');
      expect(res.body.data.isEdited).toBe(true);
    });

    // Test 4: Reject editing another user's message
    test('PUT /api/v1/rooms/:roomId/messages - Reject editing message owned by another user', async () => {
      const editPayload = {
        messageId: createdMessageId,
        content: 'Hijacked content!'
      };

      const res = await request(app)
        .put(`/api/v1/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${accessToken2}`) // User 2 is member, but not sender
        .send(editPayload);

      expect(res.status).toBe(403); // Forbidden access for editing others' messages
    });

    // Test 5: Reject deleting another user's message
    test('DELETE /api/v1/rooms/:roomId/messages - Reject deleting message owned by another user', async () => {
      const deletePayload = {
        messageId: createdMessageId
      };

      const res = await request(app)
        .delete(`/api/v1/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(deletePayload);

      expect(res.status).toBe(403); // Access Forbidden
    });

    // Test 6: Delete message successfully as message creator
    test('DELETE /api/v1/rooms/:roomId/messages - Delete own message', async () => {
      const deletePayload = {
        messageId: createdMessageId
      };

      const res = await request(app)
        .delete(`/api/v1/rooms/${roomId}/messages`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(deletePayload);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Message deleted Successfully');
    });
  });
});
