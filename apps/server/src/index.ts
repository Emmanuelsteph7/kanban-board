import Fastify from "fastify";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const app = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(authRoutes);

app.get("/health", async () => {
  return { status: "ok" };
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
