import { Type, Static } from "@sinclair/typebox";

export const signupSchema = {
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
  }),
};

export const loginSchema = {
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 1 }),
  }),
};

export type SignupBody = Static<typeof signupSchema.body>;
export type LoginBody = Static<typeof loginSchema.body>;
