import { FastifyRequest, FastifyReply } from "fastify";
import { verifyToken } from "./jwt.js";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply
      .code(401)
      .send({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = verifyToken(token);
    request.user = payload;
  } catch {
    return reply.code(401).send({ error: "Invalid or expired token" });
  }
};
