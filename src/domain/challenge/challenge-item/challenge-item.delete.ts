import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';

export const deleteChallengeItem = createAPI(
  async ({ body: { challengeId, challengeItemId }, prismaClient, userId }) => {
    const challenge = await prismaClient.challenge.findUnique({
      where: {
        id: challengeId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (challenge == null) {
      throw new BadRequestError('can not find challenge data');
    }

    await prismaClient.challengeItem.delete({
      where: {
        challengeId,
        id: challengeItemId,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
      challengeItemId: t.String(),
    }),
  }
);
