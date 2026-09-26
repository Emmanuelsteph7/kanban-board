import type { FastifyInstance } from "fastify";

// Reusable defaults — tests can override individual fields
export const testUser = {
  email: "test@example.com",
  password: "password123",
};

/**
 * Signs up a user and returns their JWT token.
 * Use this in any test file that needs an authenticated user.
 */
export async function createTestUser(
  app: FastifyInstance,
  overrides: { email?: string; password?: string } = {},
): Promise<string> {
  const payload = { ...testUser, ...overrides };

  const res = await app.inject({
    method: "POST",
    url: "/auth/signup",
    payload,
  });

  const body = JSON.parse(res.body);
  return body.token;
}
