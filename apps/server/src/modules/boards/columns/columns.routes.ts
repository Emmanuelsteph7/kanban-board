import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  createColumnSchema,
  deleteColumnSchema,
  listColumnsSchema,
  updateColumnSchema,
} from "./columns.schema.js";
import {
  createBoardColumn,
  deleteColumn,
  getColumnsForBoard,
  updateColumn,
} from "./columns.service.js";

export const columnRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/boards/:boardId/columns",
    { schema: createColumnSchema },
    async (request, reply) => {
      try {
        const column = await createBoardColumn(
          request.user.userId,
          request.params.boardId,
          request.body.name,
        );
        return reply.code(201).send(column);
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

  app.get(
    "/boards/:boardId/columns",
    { schema: listColumnsSchema },
    async (request, reply) => {
      try {
        return await getColumnsForBoard(
          request.user.userId,
          request.params.boardId,
        );
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

  app.patch(
    "/boards/columns/:id",
    { schema: updateColumnSchema },
    async (request, reply) => {
      try {
        const column = await updateColumn(
          request.user.userId,
          request.params.id,
          request.body,
        );
        return reply.code(200).send(column);
      } catch (err) {
        if (err instanceof Error && err.message === "COLUMN_NOT_FOUND") {
          return reply.code(404).send({ error: "Column not found" });
        }
        throw err;
      }
    },
  );

  app.delete(
    "/boards/columns/:id",
    { schema: deleteColumnSchema },
    async (request, reply) => {
      try {
        await deleteColumn(request.user.userId, request.params.id);
        return reply.code(204).send(null);
      } catch (err) {
        if (err instanceof Error && err.message === "COLUMN_NOT_FOUND") {
          return reply.code(404).send({ error: "Column not found" });
        }
        throw err;
      }
    },
  );
};
