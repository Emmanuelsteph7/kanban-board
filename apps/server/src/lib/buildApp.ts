import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

import { authRoutes } from "../modules/auth/auth.routes.js";
import { boardRoutes } from "../modules/boards/boards.routes.js";
import { cardRoutes } from "../modules/cards/cards.routes.js";
import { columnRoutes } from "../modules/columns/columns.routes.js";
import { corsConfig } from "./cors.js";
import { scalarDocsConfig } from "./scalarDocs.js";

export const buildApp = () => {
  const app = Fastify({
    logger: process.env.NODE_ENV !== "test",
  }).withTypeProvider<TypeBoxTypeProvider>();

  scalarDocsConfig(app);
  corsConfig(app);

  app.register(authRoutes);
  app.register(boardRoutes);
  app.register(columnRoutes);
  app.register(cardRoutes);

  return app;
};
