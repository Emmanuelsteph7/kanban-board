import { JwtPayload } from "./jwt.js";

declare module "fastify" {
  interface FastifyRequest {
    user: JwtPayload;
  }
}
