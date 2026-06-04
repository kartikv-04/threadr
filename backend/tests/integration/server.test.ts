import request from "supertest";
import app from "../../src/app.js";
import * as dbHandler from "../helpers/dbConnection.js";

// Server Feature Integration Tests
describe("Server Integration Tests", () => {
    let accessToken1: string;
    let createdServerId1: string;

    // Log in before running server tests to get a valid authentication token
    beforeAll(async () => {
        // Connect to the in-memory database
        await dbHandler.connect();

        const testUser1 = {
            name: "Test User1",
            email: "server_test1@example.com",
            password: "testPassword123"
        };

        const testUser2 = {
            name: "Test User2",
            email: "server_test2@example.com",
            password: "testPassword123"
        };

        // Register and log in the test user
        await request(app).post("/api/v1/users/signup").send(testUser1);
        await request(app).post("/api/v1/users/signup").send(testUser2);
        const loginRes = await request(app).post("/api/v1/users/signin").send(testUser1);
        accessToken1 = loginRes.body.data.user.accessToken;
    }, 60000);

    // Close connection and clean up after all tests are finished
    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    describe("Perform CRUD Operations on Server Feature", () => {

        // Test 1: Create New Server
        test("POST /api/v1/servers - Create New Server", async () => {
            const newServerPayload = {
                serverName: "Personal Server"
            };

            const res = await request(app)
                .post("/api/v1/servers")
                .set("Authorization", `Bearer ${accessToken1}`)
                .send(newServerPayload);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty('serverId');
            expect(res.body.data).toHaveProperty('serverName');
            expect(res.body.data).toHaveProperty('roomId');

            // Save the serverId for the subsequent tests
            createdServerId1 = res.body.data.serverId;
        });

        // Test 2: Get Server List
        test("GET /api/v1/servers - Get Server List", async () => {
            const res = await request(app)
                .get("/api/v1/servers")
                .set("Authorization", `Bearer ${accessToken1}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

            if (res.body.data.length > 0) {
                expect(res.body.data[0]).toHaveProperty('serverId');
                expect(res.body.data[0]).toHaveProperty('name');
                expect(res.body.data[0]).toHaveProperty('icon');
                expect(res.body.data[0]).toHaveProperty('role');
            }
        });

        // Test 3: Reject last admin from leaving
        test("POST /api/v1/servers/:serverId/leave - Reject last admin from leaving", async () => {
            const res = await request(app)
                .post(`/api/v1/servers/${createdServerId1}/leave`)
                .set("Authorization", `Bearer ${accessToken1}`);

            // Validation middleware or logic rejects last admin leaving with 400 Bad Request
            expect(res.status).toBe(400);
        });

        // Test 4: Reject deleting another user's server (Unauthorized Delete)
        // Note: Run this while Server 1 still exists to verify authorization blocks the non-owner.
        test("DELETE /api/v1/servers/:serverId - Reject deleting a server owned by another user", async () => {
            const testUser2 = {
                email: "server_test2@example.com",
                password: "testPassword123"
            };

            const loginRes = await request(app).post("/api/v1/users/signin").send(testUser2);
            const accessToken2 = loginRes.body.data.user.accessToken;

            const res = await request(app)
                .delete(`/api/v1/servers/${createdServerId1}`)
                .set("Authorization", `Bearer ${accessToken2}`);

            expect(res.status).toBe(404);
        });

        // Test 5: Owner should be able to delete their server (Authorized Delete)
        // Note: Run this last because it permanently deletes Server 1 from the database.
        test("DELETE /api/v1/servers/:serverId - Owner should be able to delete their server", async () => {
            const res = await request(app)
                .delete(`/api/v1/servers/${createdServerId1}`)
                .set("Authorization", `Bearer ${accessToken1}`);

            expect(res.status).toBe(204);
        });

    });
});