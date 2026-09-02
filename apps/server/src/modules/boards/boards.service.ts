import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient();

export const createBoard = async (userId: string, name: string) => {
  return prisma.board.create({
    data: {
      name,
      members: {
        create: { userId },
      },
    },
  });
};

export const getBoardsForUser = async (userId: string) => {
  return prisma.board.findMany({
    where: {
      members: { some: { userId } },
    },
  });
};

export const getBoardById = async (userId: string, boardId: string) => {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      members: { some: { userId } },
    },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          cards: { orderBy: { position: "asc" } },
        },
      },
    },
  });

  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  return board;
};

export const createBoardColumn = async (
  userId: string,
  boardId: string,
  name: string,
) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, members: { some: { userId } } },
  });

  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { position: "desc" },
  });

  const position = lastColumn ? lastColumn.position + 1 : 0;

  return prisma.column.create({
    data: { name, boardId, position },
  });
};
