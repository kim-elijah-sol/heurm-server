import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const deleteChallenge = createAPI(
  async ({ body: { challengeId }, prismaClient, userId }) => {
    await prismaClient.challenge.delete({
      where: {
        userId,
        id: challengeId,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
    }),
  }
);
