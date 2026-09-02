import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate } from "../../lib/authenticate.js";
import {
  createBoard,
  getBoardsForUser,
  getBoardById,
  createBoardColumn,
} from "./boards.service.js";
import {
  createBoardSchema,
  boardIdParamSchema,
  createColumnSchema,
} from "./boards.schema.js";

export const boardRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.addHook("preHandler", authenticate);

  app.post("/boards", { schema: createBoardSchema }, async (request, reply) => {
    const board = await createBoard(request.user.userId, request.body.name);
    return reply.code(201).send(board);
  });

  app.get("/boards", async (request) => {
    return getBoardsForUser(request.user.userId);
  });

  app.get(
    "/boards/:id",
    { schema: boardIdParamSchema },
    async (request, reply) => {
      try {
        const board = await getBoardById(
          request.user.userId,
          request.params.id,
        );
        return board;
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

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
};
