import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { boardRoutes } from "./modules/boards/boards.routes.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

await app.register(swagger, {
  openapi: {
    info: {
      title: "Kanban Board API",
      description: "Real-time collaborative kanban board — REST API",
      version: "0.1.0",
    },
  },
});

await app.register(scalarApiReference, {
  routePrefix: "/docs",
});

app.register(authRoutes);
app.register(boardRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
