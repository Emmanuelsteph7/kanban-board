import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PrismaClient } from "../../generated/prisma/client.js";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../../lib/buildApp.js";
import { createTestUser } from "../helpers/users.js";
import { clearDB } from "../helpers/clearDB.js";

const prisma = new PrismaClient();
let app: FastifyInstance;
let token: string;

beforeAll(async () => {
  app = buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
  await prisma.$disconnect();
});

beforeEach(async () => {
  await clearDB(prisma);

  // Fresh user + token for every test
  token = await createTestUser(app);
});

// ---------------------------------------------------------------------------
// POST /boards
// ---------------------------------------------------------------------------
describe("POST /boards", () => {
  it("returns 201 and the created board", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "My Board" },
    });

    expect(res.statusCode).toBe(201);

    const body = JSON.parse(res.body);
    expect(body.name).toBe("My Board");
    expect(body.id).toBeDefined();
  });

  it("returns 401 when no token is provided", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/boards",
      payload: { name: "My Board" },
    });

    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when name is missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: {},
    });

    expect(res.statusCode).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// GET /boards
// ---------------------------------------------------------------------------
describe("GET /boards", () => {
  it("returns only boards the user is a member of", async () => {
    // Create two boards as the primary user
    await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Board A" },
    });
    await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Board B" },
    });

    // Create a second user with their own board
    const otherToken = await createTestUser(app, {
      email: "other@example.com",
    });
    await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${otherToken}` },
      payload: { name: "Other Board" },
    });

    // Primary user should only see their two boards
    const res = await app.inject({
      method: "GET",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body).toHaveLength(2);
    expect(body.map((b: { name: string }) => b.name)).toEqual(
      expect.arrayContaining(["Board A", "Board B"]),
    );
  });

  it("returns 401 when no token is provided", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/boards",
    });

    expect(res.statusCode).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// GET /boards/:boardId
// ---------------------------------------------------------------------------
describe("GET /boards/:boardId", () => {
  it("returns the board with its columns and cards", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Detail Board" },
    });
    const { id } = JSON.parse(created.body);

    const res = await app.inject({
      method: "GET",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(200);

    const body = JSON.parse(res.body);
    expect(body.id).toBe(id);
    expect(body.name).toBe("Detail Board");
    expect(Array.isArray(body.columns)).toBe(true);
  });

  it("returns 404 when the user is not a board member", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Private Board" },
    });
    const { id } = JSON.parse(created.body);

    const otherToken = await createTestUser(app, {
      email: "other@example.com",
    });

    const res = await app.inject({
      method: "GET",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${otherToken}` },
    });

    expect(res.statusCode).toBe(404);
  });

  it("returns 404 for a board that does not exist", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/boards/00000000-0000-0000-0000-000000000000",
      headers: { authorization: `Bearer ${token}` },
    });

    expect(res.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// PATCH /boards/:boardId
// ---------------------------------------------------------------------------
describe("PATCH /boards/:boardId", () => {
  it("returns 200 and the updated board name", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Old Name" },
    });
    const { id } = JSON.parse(created.body);

    const res = await app.inject({
      method: "PATCH",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "New Name" },
    });

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).name).toBe("New Name");
  });

  it("returns 404 when the user is not a board member", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Old Name" },
    });
    const { id } = JSON.parse(created.body);

    const otherToken = await createTestUser(app, {
      email: "other@example.com",
    });

    const res = await app.inject({
      method: "PATCH",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${otherToken}` },
      payload: { name: "Hacked Name" },
    });

    expect(res.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// DELETE /boards/:boardId
// ---------------------------------------------------------------------------
describe("DELETE /boards/:boardId", () => {
  it("returns 204 and the board no longer exists", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "To Delete" },
    });
    const { id } = JSON.parse(created.body);

    const deleteRes = await app.inject({
      method: "DELETE",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(deleteRes.statusCode).toBe(204);

    // Confirm it's gone
    const getRes = await app.inject({
      method: "GET",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${token}` },
    });
    expect(getRes.statusCode).toBe(404);
  });

  it("returns 404 when the user is not a board member", async () => {
    const created = await app.inject({
      method: "POST",
      url: "/boards",
      headers: { authorization: `Bearer ${token}` },
      payload: { name: "Protected Board" },
    });
    const { id } = JSON.parse(created.body);

    const otherToken = await createTestUser(app, {
      email: "other@example.com",
    });

    const res = await app.inject({
      method: "DELETE",
      url: `/boards/${id}`,
      headers: { authorization: `Bearer ${otherToken}` },
    });

    expect(res.statusCode).toBe(404);
  });
});
