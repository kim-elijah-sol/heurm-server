import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';

export const getHistory = createAPI(
  async ({ query: { challengeId, challengeItemId }, prismaClient, userId }) => {
    const result = await prismaClient.challenge.findUnique({
      where: {
        id: challengeId,
        userId,
      },
      select: {
        items: {
          where: {
            id: challengeItemId,
          },
          select: {
            history: {
              select: {
                id: true,
                count: true,
                complete: true,
                date: true,
              },
              where: {
                challengeItemId,
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new BadRequestError('can not find challenge data');
    }

    const historys = result.items[0]?.history ?? [];

    return historys;
  },
  {
    query: t.Object({
      challengeId: t.String(),
      challengeItemId: t.String(),
    }),
  }
);
