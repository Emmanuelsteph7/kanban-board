import { Type, Static } from "@sinclair/typebox";
import { tags } from "../boards.schema.js";

const columnResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  position: Type.Number(),
  boardId: Type.String({ format: "uuid" }),
});

export const createColumnSchema = {
  tags,
  summary: "Create a column on a board",
  description:
    "Creates a new column at the end of the specified board. Position is assigned automatically based on existing columns.",
  params: Type.Object({
    boardId: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 50 }),
  }),
  response: {
    201: columnResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export const listColumnsSchema = {
  tags,
  summary: "List columns for a board",
  description:
    "Returns all columns for a board, ordered by position, with their cards.",
  params: Type.Object({
    boardId: Type.String({ format: "uuid" }),
  }),
  response: {
    200: Type.Array(columnResponseSchema),
    404: Type.Object({ error: Type.String() }),
  },
};

export const updateColumnSchema = {
  tags,
  summary: "Rename or reposition a column",
  description:
    "Updates a column's name and/or its position among sibling columns.",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    name: Type.Optional(Type.String({ minLength: 1, maxLength: 50 })),
    position: Type.Optional(Type.Number()),
  }),
  response: {
    200: columnResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export const deleteColumnSchema = {
  tags,
  summary: "Delete a column",
  description: "Deletes a column and all its cards.",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    204: Type.Null(),
    404: Type.Object({ error: Type.String() }),
  },
};

export type CreateColumnBody = Static<typeof createColumnSchema.body>;
