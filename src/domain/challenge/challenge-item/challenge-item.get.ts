import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';

export const getChallengeItem = createAPI(
  async ({ query: { challengeId }, prismaClient, userId }) => {
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

    const result = await prismaClient.challengeItem.findMany({
      where: {
        challengeId,
      },
      select: {
        id: true,
        type: true,
        name: true,
        days: true,
        targetCount: true,
        unit: true,
      },
    });

    return result;
  },
  {
    query: t.Object({
      challengeId: t.String(),
    }),
  }
);
