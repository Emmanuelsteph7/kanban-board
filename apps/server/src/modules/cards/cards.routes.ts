import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { authenticate } from "../../lib/authenticate.js";
import { createCard, deleteCard, updateCard } from "./cards.service.js";
import {
  createCardSchema,
  deleteCardSchema,
  updateCardSchema,
} from "./cards.schema.js";

export const cardRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.addHook("preHandler", authenticate);

  app.post(
    "/columns/:columnId/cards",
    { schema: createCardSchema },
    async (request, reply) => {
      try {
        const card = await createCard(
          request.user.userId,
          request.params.columnId,
          request.body.title,
          request.body.description,
        );
        return reply.code(201).send({
          ...card,
          description: card.description ?? "",
          updatedAt: card.updatedAt.toISOString(),
        });
      } catch (err) {
        if (err instanceof Error && err.message === "COLUMN_NOT_FOUND") {
          return reply.code(404).send({ error: "Column not found" });
        }
        throw err;
      }
    },
  );

  app.patch(
    "/cards/:id",
    { schema: updateCardSchema },
    async (request, reply) => {
      try {
        const card = (await updateCard(
          request.user.userId,
          request.params.id,
          request.body,
        )) as {
          id: string;
          title: string;
          description: string | null;
          position: number;
          columnId: string;
          updatedAt: Date;
        };

        return reply.code(200).send({
          ...card,
          updatedAt: card.updatedAt.toISOString(),
        });
      } catch (err) {
        if (err instanceof Error && err.message === "CARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Card not found" });
        }
        throw err;
      }
    },
  );

  app.delete(
    "/cards/:id",
    { schema: deleteCardSchema },
    async (request, reply) => {
      try {
        await deleteCard(request.user.userId, request.params.id);
        return reply.code(204).send(null);
      } catch (err) {
        if (err instanceof Error && err.message === "CARD_NOT_FOUND") {
          return reply.code(404).send({ error: "Card not found" });
        }
        throw err;
      }
    },
  );
};
