import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { boardRoutes } from "./modules/boards/boards.routes.js";
import { columnRoutes } from "./modules/columns/columns.routes.js";
import { cardRoutes } from "./modules/cards/cards.routes.js";
import { scalarDocsConfig } from "./lib/scalarDocs.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

scalarDocsConfig(app);

app.register(authRoutes);
app.register(boardRoutes);
app.register(columnRoutes);
app.register(cardRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
