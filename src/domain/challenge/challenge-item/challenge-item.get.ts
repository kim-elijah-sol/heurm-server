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
        name: true,
        type: true,
        intervalType: true,
        repeatType: true,
        interval: true,
        rest: true,
        anyInterval: true,
        days: true,
        dates: true,
        weeks: true,
        months: true,
        targetCount: true,
        unit: true,
        accumulateType: true,
        startAt: true,
        endAt: true,
      },
      orderBy: {
        createdAt: 'desc',
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
