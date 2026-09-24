import cors from "@fastify/cors";

const origin = ["http://localhost:5173"];

export const corsConfig = async (app: any) => {
  await app.register(cors, {
    origin,
    credentials: true,
  });
};
