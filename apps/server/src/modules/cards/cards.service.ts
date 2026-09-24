import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export const createCard = async (
  userId: string,
  columnId: string,
  title: string,
  description?: string,
) => {
  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      board: { members: { some: { userId } } },
    },
  });

  if (!column) {
    throw new Error("COLUMN_NOT_FOUND");
  }

  const lastCard = await prisma.card.findFirst({
    where: { columnId },
    orderBy: { position: "desc" },
  });

  const position = lastCard ? lastCard.position + 1 : 0;

  return prisma.card.create({
    data: { title, description, columnId, position },
  });
};

export const updateCard = async (
  userId: string,
  cardId: string,
  data: {
    title?: string;
    description?: string;
    columnId?: string;
    position?: number;
  },
) => {
  const card = await prisma.card.findFirst({
    where: { id: cardId, column: { board: { members: { some: { userId } } } } },
  });

  if (!card) {
    throw new Error("CARD_NOT_FOUND");
  }

  // Simple field-only update — no move involved.
  if (data.position === undefined && data.columnId === undefined) {
    return prisma.card.update({
      where: { id: cardId },
      data: { title: data.title, description: data.description },
    });
  }

  const targetColumnId = data.columnId ?? card.columnId;
  const targetPosition = data.position ?? card.position;
  const movingColumns = targetColumnId !== card.columnId;

  // Verify the target column belongs to the same board (can't move a card to a column on another board).
  if (movingColumns) {
    const targetColumn = await prisma.column.findFirst({
      where: { id: targetColumnId, board: { members: { some: { userId } } } },
    });
    if (!targetColumn) {
      throw new Error("CARD_NOT_FOUND");
    }
  }

  const operations = [];

  if (movingColumns) {
    // Close the gap in the OLD column.
    operations.push(
      prisma.card.updateMany({
        where: { columnId: card.columnId, position: { gt: card.position } },
        data: { position: { decrement: 1 } },
      }),
    );
    // Make room in the NEW column.
    operations.push(
      prisma.card.updateMany({
        where: { columnId: targetColumnId, position: { gte: targetPosition } },
        data: { position: { increment: 1 } },
      }),
    );
  } else if (targetPosition !== card.position) {
    // Reordering within the SAME column.
    if (targetPosition > card.position) {
      operations.push(
        prisma.card.updateMany({
          where: {
            columnId: card.columnId,
            position: { gt: card.position, lte: targetPosition },
          },
          data: { position: { decrement: 1 } },
        }),
      );
    } else {
      operations.push(
        prisma.card.updateMany({
          where: {
            columnId: card.columnId,
            position: { gte: targetPosition, lt: card.position },
          },
          data: { position: { increment: 1 } },
        }),
      );
    }
  }

  operations.push(
    prisma.card.update({
      where: { id: cardId },
      data: {
        title: data.title,
        description: data.description,
        columnId: targetColumnId,
        position: targetPosition,
      },
    }),
  );

  const results = await prisma.$transaction(operations);
  return results[results.length - 1];
};

export const deleteCard = async (userId: string, cardId: string) => {
  const card = await prisma.card.findFirst({
    where: { id: cardId, column: { board: { members: { some: { userId } } } } },
  });

  if (!card) {
    throw new Error("CARD_NOT_FOUND");
  }

  await prisma.$transaction([
    prisma.card.delete({ where: { id: cardId } }),
    prisma.card.updateMany({
      where: { columnId: card.columnId, position: { gt: card.position } },
      data: { position: { decrement: 1 } },
    }),
  ]);
};
