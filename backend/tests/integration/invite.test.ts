import request from "supertest";
import app from "../../src/app.js";
import * as dbHandler from "../helpers/dbConnection.js";

// Invite Feature Integration Tests
describe("Invite Integration Tests", () => {
    let accessToken1: string;
    let accessToken2: string;
    let serverId: string;
    let inviteCode: string;

    // Log in and create server before running invite tests
    beforeAll(async () => {
        // Connect to the in-memory database
        await dbHandler.connect();

        const testUser1 = {
            name: "Test User1",
            email: "invite_admin@example.com",
            password: "password123"
        };

        const testUser2 = {
            name: "Test User2",
            email: "invite_joiner@example.com",
            password: "password123"
        };

        // Register both users
        await request(app).post("/api/v1/users/signup").send(testUser1);
        await request(app).post("/api/v1/users/signup").send(testUser2);

        // Sign in both users and save tokens
        const loginRes1 = await request(app).post("/api/v1/users/signin").send(testUser1);
        accessToken1 = loginRes1.body.data.user.accessToken;

        const loginRes2 = await request(app).post("/api/v1/users/signin").send(testUser2);
        accessToken2 = loginRes2.body.data.user.accessToken;

        // User 1 creates a server
        const serverPayload = { serverName: "Invite Test Server" };
        const serverRes = await request(app)
            .post("/api/v1/servers")
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(serverPayload);
        
        serverId = serverRes.body.data.serverId;
    }, 60000);

    // Close connection and clean up after all tests are finished
    afterAll(async () => {
        await dbHandler.closeDatabase();
    });

    describe("Perform Invite and Join operations", () => {

        // Test 1: Generate invite link for a server
        test("POST /api/v1/servers/:serverId/invite - Generate Invite Link", async () => {
            const res = await request(app)
                .post(`/api/v1/servers/${serverId}/invite`)
                .set("Authorization", `Bearer ${accessToken1}`);

            expect(res.status).toBe(201);
            expect(res.body.data).toHaveProperty("code");
            expect(res.body.data).toHaveProperty("url");
            expect(res.body.data).toHaveProperty("expiresAt");
            expect(res.body.data).toHaveProperty("isPermanent");

            inviteCode = res.body.data.code;
        });

        // Test 2: Get Invite Info publicly (using the code without token)
        test("GET /api/v1/invite/:code - Get Invite Info Publicly", async () => {
            const res = await request(app)
                .get(`/api/v1/invite/${inviteCode}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("serverName");
            expect(res.body.data.serverName).toBe("Invite Test Server");
            expect(res.body.data.serverId).toBe(serverId);
        });

        // Test 3: Join the server using the invite code
        test("POST /api/v1/invite/join - Join Server via Invite Link", async () => {
            const joinPayload = {
                inviteCode,
                serverId
            };

            const res = await request(app)
                .post("/api/v1/invite/join")
                .set("Authorization", `Bearer ${accessToken2}`)
                .send(joinPayload);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveProperty("serverId");
            expect(res.body.data.serverId).toBe(serverId);
        });

        // Test 4: Verify User 2 can now access server list and see the new server
        test("GET /api/v1/servers - Verify User 2 is part of the server", async () => {
            const res = await request(app)
                .get("/api/v1/servers")
                .set("Authorization", `Bearer ${accessToken2}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

            // Find the joined server in the list
            const foundServer = res.body.data.find((s: any) => s.serverId === serverId);
            expect(foundServer).toBeDefined();
            expect(foundServer.name).toBe("Invite Test Server");
            expect(foundServer.role[0]).toBe("member");
        });

    });
});
