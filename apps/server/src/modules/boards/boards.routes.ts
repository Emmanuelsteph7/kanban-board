import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate } from "../../lib/authenticate.js";
import {
  createBoard,
  getBoardsForUser,
  getBoardById,
  updateBoard,
  deleteBoard,
} from "./boards.service.js";
import {
  createBoardSchema,
  boardIdParamSchema,
  listBoardsSchema,
  updateBoardSchema,
  deleteBoardSchema,
} from "./boards.schema.js";
import { columnRoutes } from "./columns/columns.routes.js";

export const boardRoutes: FastifyPluginAsyncTypebox = async (app, opts) => {
  app.addHook("preHandler", authenticate);

  app.post("/boards", { schema: createBoardSchema }, async (request, reply) => {
    const board = await createBoard(request.user.userId, request.body.name);
    return reply
      .code(201)
      .send({ ...board, createdAt: board.createdAt.toISOString() });
  });

  app.patch(
    "/boards/:id",
    { schema: updateBoardSchema },
    async (request, reply) => {
      try {
        const board = await updateBoard(
          request.user.userId,
          request.params.id,
          request.body.name,
        );
        return reply.code(200).send({
          ...board,
          createdAt: board.createdAt.toISOString(),
        });
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

  app.delete(
    "/boards/:id",
    { schema: deleteBoardSchema },
    async (request, reply) => {
      try {
        await deleteBoard(request.user.userId, request.params.id);
        return reply.code(204).send(null);
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

  app.get("/boards", { schema: listBoardsSchema }, async (request) => {
    const boards = await getBoardsForUser(request.user.userId);

    return boards.map((board) => ({
      ...board,
      createdAt: board.createdAt.toISOString(),
    }));
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
        return { ...board, createdAt: board.createdAt.toISOString() };
      } catch (err) {
        if (err instanceof Error && err.message === "BOARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Board not found" });
        }
        throw err;
      }
    },
  );

  /**
   * Column routes are nested under the board routes because they require a board ID in the URL. This allows us to group related routes together and makes it clear that columns belong to a specific board.
   * The column routes are defined in a separate file (columns.routes.ts) to keep the code organized and maintainable. This separation of concerns makes it easier to manage and scale the application as it grows.
   * By registering the column routes within the board routes, we ensure that all column-related endpoints are properly namespaced under their respective boards, providing a clear and intuitive API structure for clients.
   */
  columnRoutes(app, opts);
};
