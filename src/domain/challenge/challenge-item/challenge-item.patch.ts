import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchChallengeItem = createAPI(
  async ({
    body: { challengeId, challengeItemId, name, type, days, unit, targetCount },
    userId,
    prismaClient,
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

    await prismaClient.challengeItem.update({
      where: {
        challengeId,
        id: challengeItemId,
      },
      data: {
        name,
        type,
        days,
        unit,
        targetCount,
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
      name: v.isChallengeItemName,
      type: v.isChallengeItemType,
      days: v.isChallengeItemDays,
      unit: t.Optional(t.Nullable(t.String())),
      targetCount: t.Optional(t.Nullable(t.Number())),
    }),
  }
);
