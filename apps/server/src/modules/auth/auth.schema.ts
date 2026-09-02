import { Type, Static } from "@sinclair/typebox";

const tags = ["Auth"];
const authResponseSchema = Type.Object({
  token: Type.String(),
});

const errorResponseSchema = Type.Object({
  error: Type.String(),
});

export const signupSchema = {
  tags,
  summary: "Create a new account",
  description:
    "Registers a new user with an email and password. Returns a JWT to use for authenticated requests.",
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 8 }),
  }),
  response: {
    201: authResponseSchema,
    409: errorResponseSchema,
  },
};

export const loginSchema = {
  tags,
  summary: "Log in to an existing account",
  description:
    "Verifies email and password, and returns a JWT to use for authenticated requests.",
  body: Type.Object({
    email: Type.String({ format: "email" }),
    password: Type.String({ minLength: 1 }),
  }),
  response: {
    200: authResponseSchema,
    401: errorResponseSchema,
  },
};

export type SignupBody = Static<typeof signupSchema.body>;
export type LoginBody = Static<typeof loginSchema.body>;
