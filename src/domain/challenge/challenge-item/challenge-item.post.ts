import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const postChallengeItem = createAPI(
  async ({
    body: { challengeId, name, type, days, unit, targetCount },
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

    const result = await prismaClient.challengeItem.create({
      data: {
        challengeId,
        name,
        type,
        days,
        unit,
        targetCount,
      },
      select: {
        id: true,
      },
    });

    return {
      id: result.id,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
      name: v.isChallengeItemName,
      type: v.isChallengeItemType,
      days: v.isChallengeItemDays,
      unit: t.Optional(t.Nullable(t.String())),
      targetCount: t.Optional(t.Nullable(t.Number())),
    }),
  }
);
