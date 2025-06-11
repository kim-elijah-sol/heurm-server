import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchHistory = createAPI(
  async ({
    body: { challengeId, challengeItemId, id, complete, count, targetCount },
    prismaClient,
    userId,
  }) => {
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

    const challengeItem = await prismaClient.challengeItem.findUnique({
      where: {
        id: challengeItemId,
        challengeId: challenge.id,
      },
      select: {
        id: true,
      },
    });

    if (challengeItem == null) {
      throw new BadRequestError('can not find challenge item data');
    }

    const result = await prismaClient.challengeItemHistory.update({
      where: {
        id,
      },
      data: {
        complete,
        count,
        targetCount,
      },
    });

    return {
      id: result.id,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
      challengeItemId: t.String(),
      id: t.String(),
      complete: v.isHistoryComplete,
      count: v.isHistoryCount,
      targetCount: v.isHistoryTargetCount,
    }),
  }
);
