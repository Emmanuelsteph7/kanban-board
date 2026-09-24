import swagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

export const scalarDocsConfig = async (app: any) => {
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
};
