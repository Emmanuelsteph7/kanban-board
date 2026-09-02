import { Type, Static } from "@sinclair/typebox";

export const tags = ["Boards"];
const boardResponseSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
});

export const createBoardSchema = {
  tags,
  summary: "Create a new board",
  description:
    "Creates a board and adds the authenticated user as its first member.",
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
  }),
  response: {
    201: boardResponseSchema,
  },
};

export const updateBoardSchema = {
  tags,
  summary: "Rename a board",
  description: "Updates the name of a board the user is a member of.",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
  }),
  response: {
    200: boardResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export const deleteBoardSchema = {
  tags,
  summary: "Delete a board",
  description: "Deletes a board and all its columns and cards.",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    204: Type.Null(),
    404: Type.Object({ error: Type.String() }),
  },
};

export const listBoardsSchema = {
  tags,
  summary: "List my boards",
  description: "Returns every board the authenticated user is a member of.",
  response: {
    200: Type.Array(boardResponseSchema),
  },
};

export const boardIdParamSchema = {
  tags,
  summary: "Get a board by ID",
  description:
    "Returns a board with its columns and cards, if the user is a member.",
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
  response: {
    200: boardResponseSchema,
    404: Type.Object({ error: Type.String() }),
  },
};

export type CreateBoardBody = Static<typeof createBoardSchema.body>;
