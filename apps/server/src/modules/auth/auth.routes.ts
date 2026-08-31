import { signup, login } from "./auth.service.js";
import { signupSchema, loginSchema } from "./auth.schema.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

export const authRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post("/auth/signup", { schema: signupSchema }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const result = await signup(email, password);
      return reply.code(201).send(result);
    } catch (err) {
      if (err instanceof Error && err.message === "EMAIL_TAKEN") {
        return reply.code(409).send({ error: "Email already in use" });
      }
      throw err;
    }
  });

  app.post("/auth/login", { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body;

    try {
      const result = await login(email, password);
      return reply.code(200).send(result);
    } catch (err) {
      if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
        return reply.code(401).send({ error: "Invalid email or password" });
      }
      throw err;
    }
  });
};
