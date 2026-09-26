import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../lib/buildApp.js";
import { createTestUser, testUser } from "../helpers/users.js";
import { clearDB } from "../helpers/clearDB.js";

const prisma = new PrismaClient();
let app: FastifyInstance;

beforeAll(async () => {
  app = buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

// Reset just the users table before each test so tests don't leak into each other.
// Order matters: cards → columns → board_members → boards → users
// because of foreign key constraints.
beforeEach(async () => {
  await clearDB(prisma);
});

// ---------------------------------------------------------------------------
// POST /auth/signup
// ---------------------------------------------------------------------------
describe("POST /auth/signup", () => {
  it("returns 201 and a token on valid input", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: testUser,
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
  });

  it("returns 409 when the email is already registered", async () => {
    // First signup
    await createTestUser(app);

    // Second signup with the same email
    const res = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: testUser,
    });

    expect(res.statusCode).toBe(409);
  });

  it("returns 400 when email is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: { password: "password123" },
    });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 when password is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: { email: "test@example.com" },
    });

    expect(res.statusCode).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// POST /auth/login
// ---------------------------------------------------------------------------
describe("POST /auth/login", () => {
  it("returns 200 and a token with correct credentials", async () => {
    await createTestUser(app);

    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: testUser,
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
  });

  it("returns 401 with wrong password", async () => {
    await createTestUser(app);

    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: testUser.email, password: "wrongpassword" },
    });

    expect(res.statusCode).toBe(401);
  });

  it("returns 401 for an email that does not exist", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { email: "nobody@example.com", password: "password123" },
    });

    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when email is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/auth/login",
      payload: { password: "password123" },
    });

    expect(res.statusCode).toBe(400);
  });
});
