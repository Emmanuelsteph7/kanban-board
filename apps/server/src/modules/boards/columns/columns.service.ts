import { PrismaClient } from "../../../generated/prisma/client.js";

const prisma = new PrismaClient();

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

export const getColumnsForBoard = async (userId: string, boardId: string) => {
  const board = await prisma.board.findFirst({
    where: { id: boardId, members: { some: { userId } } },
  });

  if (!board) {
    throw new Error("BOARD_NOT_FOUND");
  }

  return prisma.column.findMany({
    where: { boardId },
    orderBy: { position: "asc" },
  });
};

export const updateColumn = async (
  userId: string,
  columnId: string,
  data: { name?: string; position?: number },
) => {
  const column = await prisma.column.findFirst({
    where: { id: columnId, board: { members: { some: { userId } } } },
  });

  if (!column) {
    throw new Error("COLUMN_NOT_FOUND");
  }

  if (data.position === undefined) {
    return prisma.column.update({ where: { id: columnId }, data });
  }

  const siblings = await prisma.column.findMany({
    where: { boardId: column.boardId, id: { not: columnId } },
    orderBy: { position: "asc" },
  });

  const reordered = [
    ...siblings.slice(0, data.position),
    { id: columnId },
    ...siblings.slice(data.position),
  ];

  await prisma.$transaction(
    reordered.map((col, index) =>
      prisma.column.update({
        where: { id: col.id },
        data: {
          position: index,
          ...(col.id === columnId && data.name !== undefined
            ? { name: data.name }
            : {}),
        },
      }),
    ),
  );

  return prisma.column.findUniqueOrThrow({ where: { id: columnId } });
};

export const deleteColumn = async (userId: string, columnId: string) => {
  const column = await prisma.column.findFirst({
    where: { id: columnId, board: { members: { some: { userId } } } },
  });

  if (!column) {
    throw new Error("COLUMN_NOT_FOUND");
  }

  await prisma.$transaction([
    prisma.card.deleteMany({ where: { columnId } }),
    prisma.column.delete({ where: { id: columnId } }),
  ]);
};
