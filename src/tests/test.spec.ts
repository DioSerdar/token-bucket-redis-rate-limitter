import { createTestServer } from "./utill/createTestServer";
const request = require("supertest");

let app: Express.Application, users: string[];

beforeAll(async () => {
    const testServer = await createTestServer();
    app = testServer.app;
    users = testServer.users;
})

describe("GET /public", () => {
    let tokenLimit = parseInt(process.env.TOKEN_BUCKET_SIZE_PUBLIC as string);
    it(`should accept the first ${tokenLimit} requests and reject others`, async () => {
        let results =
            await Promise.all<number>(new Array(tokenLimit + 1)
                .fill(1)
                .map(async t => {
                    let res = await request(app)
                        .get(`/public`);
                    return res.statusCode;
                }))

        expect(results.filter(t => t === 200)).toHaveLength(tokenLimit);
        expect(results.filter(t => t === 429)).toHaveLength(1);
    })
    it("should inform the client about when they can make another request", async () => {
        let res = await request(app)
            .get("/public");
        expect(res.statusCode).toBe(429);
        expect(res.header).toHaveProperty("x-ratelimit-reset");
    })
    it("should be accessible", async () => {
        const res = await request(app).get("/public");
        expect(res.statusCode).not.toBe(404);
    });
    it("should identify the client by their ip address", async () => {
        const res = await request(app).get("/public");
        expect(res.header).toHaveProperty("client-id");
        expect(res.header["client-id"]).toBe("::ffff:127.0.0.1");
    })
});

describe("GET /private/1", () => {
    let tokenCost = 1;
    let tokenLimit = parseInt(process.env.TOKEN_BUCKET_SIZE_PRIVATE as string);
    let numberOfRequestsBeforeReject = Math.floor(tokenLimit / tokenCost);
    let userIndex = 1;
    it("should be accessible", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).not.toBe(404);
    });
    it("should reject unauthorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).toBe(401);
    })
    it("should accept authorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[0] });
        expect(res.statusCode).toBe(200);
    })
    it("should not accept unknown tokens", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": "Unkown_Token" });
        expect(res.statusCode).toBe(401);
    })
    it(`should accept the first ${numberOfRequestsBeforeReject} requests and reject others`, async () => {
        let results =
            await Promise.all<number>(new Array(numberOfRequestsBeforeReject + 1)
                .fill(1)
                .map(async t => {
                    let res = await request(app)
                        .get(`/private/${tokenCost}`)
                        .set({ "Authorization": users[userIndex] });
                    return res.statusCode;
                }))

        expect(results.filter(t => t === 200)).toHaveLength(numberOfRequestsBeforeReject);
        expect(results.filter(t => t === 429)).toHaveLength(1);

    })
    it("should inform the client about when they can make another request", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.statusCode).toBe(429);
        expect(res.header).toHaveProperty("x-ratelimit-reset");
    })
    it("should identify the client by their access token", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.header).toHaveProperty("client-id");
        expect(res.header["client-id"]).toBe(users[userIndex]);
    })
});

describe("GET /private/2", () => {
    let tokenCost = 2;
    let tokenLimit = parseInt(process.env.TOKEN_BUCKET_SIZE_PRIVATE as string);
    let numberOfRequestsBeforeReject = Math.floor(tokenLimit / tokenCost);
    let userIndex = 2;
    it("should be accessible", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).not.toBe(404);
    });
    it("should reject unauthorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).toBe(401);
    })
    it("should accept authorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[0] });
        expect(res.statusCode).toBe(200);
    })
    it("should not accept unknown tokens", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": "Unkown_Token" });
        expect(res.statusCode).toBe(401);
    })
    it(`should accept the first ${numberOfRequestsBeforeReject} requests and reject others`, async () => {
        let results =
            await Promise.all<number>(new Array(numberOfRequestsBeforeReject + 1)
                .fill(1)
                .map(async t => {
                    let res = await request(app)
                        .get(`/private/${tokenCost}`)
                        .set({ "Authorization": users[userIndex] });
                    return res.statusCode;
                }))

        expect(results.filter(t => t === 200)).toHaveLength(numberOfRequestsBeforeReject);
        expect(results.filter(t => t === 429)).toHaveLength(1);

    })
    it("should inform the client about when they can make another request", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.statusCode).toBe(429);
        expect(res.header).toHaveProperty("x-ratelimit-reset");
    })
    it("should identify the client by their access token", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.header).toHaveProperty("client-id");
        expect(res.header["client-id"]).toBe(users[userIndex]);
    })
});

describe("GET /private/5", () => {
    let tokenCost = 5;
    let tokenLimit = parseInt(process.env.TOKEN_BUCKET_SIZE_PRIVATE as string);
    let numberOfRequestsBeforeReject = Math.floor(tokenLimit / tokenCost);
    let userIndex = 3;
    it("should be accessible", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).not.toBe(404);
    });
    it("should reject unauthorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`);
        expect(res.statusCode).toBe(401);
    })
    it("should accept authorized access", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[0] });
        expect(res.statusCode).toBe(200);
    })
    it("should not accept unknown tokens", async () => {
        const res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": "Unkown_Token" });
        expect(res.statusCode).toBe(401);
    })
    it(`should accept the first ${numberOfRequestsBeforeReject} requests and reject others`, async () => {
        let results =
            await Promise.all<number>(new Array(numberOfRequestsBeforeReject + 1)
                .fill(1)
                .map(async t => {
                    let res = await request(app)
                        .get(`/private/${tokenCost}`)
                        .set({ "Authorization": users[userIndex] });
                    return res.statusCode;
                }))

        expect(results.filter(t => t === 200)).toHaveLength(numberOfRequestsBeforeReject);
        expect(results.filter(t => t === 429)).toHaveLength(1);

    })
    it("should inform the client about when they can make another request", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.statusCode).toBe(429);
        expect(res.header).toHaveProperty("x-ratelimit-reset");
    })
    it("should identify the client by their access token", async () => {
        let res = await request(app)
            .get(`/private/${tokenCost}`)
            .set({ "Authorization": users[userIndex] });
        expect(res.header).toHaveProperty("client-id");
        expect(res.header["client-id"]).toBe(users[userIndex]);
    })
});