import { Type, Static } from "@sinclair/typebox";

const tags = ["Cards"];
const cardResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  position: Type.Number(),
  columnId: Type.String({ format: "uuid" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const createCardSchema = {
  tags,
  summary: "Create a card in a column",
  description: "Creates a new card at the end of the specified column.",
  params: Type.Object({
    columnId: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    title: Type.String({ minLength: 1, maxLength: 200 }),
    description: Type.Optional(Type.String({ maxLength: 2000 })),
  }),
  response: {
    201: cardResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export const updateCardSchema = {
  tags,
  summary: "Update a card",
  description:
    "Updates a card's title, description, column, and/or position. Passing columnId + position together handles moving a card between columns (drag-and-drop).",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    title: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
    description: Type.Optional(Type.String({ maxLength: 2000 })),
    columnId: Type.Optional(Type.String({ format: "uuid" })),
    position: Type.Optional(Type.Number()),
  }),
  response: {
    200: cardResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export const deleteCardSchema = {
  tags,
  summary: "Delete a card",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    204: Type.Null(),
    404: Type.Object({ error: Type.String() }),
  },
};

export type UpdateCardBody = Static<typeof updateCardSchema.body>;

export type CreateCardBody = Static<typeof createCardSchema.body>;
