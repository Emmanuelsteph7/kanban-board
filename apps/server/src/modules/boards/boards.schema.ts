import { Type, Static } from "@sinclair/typebox";

export const createBoardSchema = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
  }),
};

export const boardIdParamSchema = {
  params: Type.Object({
    id: Type.String({ format: "uuid" }),
  }),
};

export const createColumnSchema = {
  params: Type.Object({
    boardId: Type.String({ format: "uuid" }),
  }),
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 50 }),
  }),
};

export type CreateBoardBody = Static<typeof createBoardSchema.body>;
