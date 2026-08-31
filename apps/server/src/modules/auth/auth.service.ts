import { PrismaClient } from "../../generated/prisma/client.js";
import { hashPassword, verifyPassword } from "../../lib/hash.js";
import { signToken } from "../../lib/jwt.js";

const prisma = new PrismaClient();

export const signup = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new Error("EMAIL_TAKEN");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = signToken({ userId: user.id, email: user.email });
  return { token };
};
