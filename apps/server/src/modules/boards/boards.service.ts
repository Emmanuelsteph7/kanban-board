import { PrismaClient } from "../../generated/prisma/client.js";

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

export const updateBoard = async (
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

  return prisma.board.update({
    where: { id: boardId },
    data: { name },
  });
};

export const deleteBoard = async (userId: string, boardId: string) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, members: { some: { userId } } },
  });

  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  /**
   * Postgres will reject it if any columns/cards/members
   * still reference this board. So we have to delete the
   * dependent rows first, in the correct order (cards → columns → members → board itself, deepest dependency first).
   *
   * prisma.$transaction([...]) wraps all four deletes as one atomic
   * operation — either all of them succeed, or none do. This matters: without a
   * transaction, if the process crashed between deleting cards and deleting columns,
   * you'd be left with a half-deleted, inconsistent board. This is a real, concrete
   * example of why transactions exist, not just a "best practice" to follow blindly.
   */
  await prisma.$transaction([
    prisma.card.deleteMany({ where: { column: { boardId } } }),
    prisma.column.deleteMany({ where: { boardId } }),
    prisma.boardMember.deleteMany({ where: { boardId } }),
    prisma.board.delete({ where: { id: boardId } }),
  ]);
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
