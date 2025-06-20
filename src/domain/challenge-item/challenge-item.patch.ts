import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchChallengeItem = createAPI(
  async ({
    body: {
      challengeId,
      challengeItemId,
      name,
      intervalType,

      repeatType,
      repeat,
      rest,

      days,

      dates,
      weeks,

      months,

      targetCount,
      unit,
      accumulateType,

      startAt,
      endAt,
    },
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
        intervalType,

        repeatType,
        repeat,
        rest,

        days,

        dates,
        weeks,

        months,

        targetCount,
        unit,
        accumulateType,

        startAt,
        endAt,
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
      intervalType: v.isChallengeItemIntervalType,

      repeatType: v.isChallengeItemRepeatType,
      repeat: t.Optional(t.Nullable(t.Number())),
      rest: t.Optional(t.Nullable(t.Number())),

      days: t.Optional(v.isChallengeItemDays),

      dates: t.Optional(t.Array(t.Number())),
      weeks: t.Optional(t.Array(t.Number())),

      months: t.Optional(t.Array(t.String())),

      targetCount: t.Optional(t.Nullable(t.Number())),
      unit: t.Optional(t.Nullable(t.String())),
      accumulateType: t.Optional(t.Nullable(v.isChallengeItemIntervalType)),

      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),
    }),
  }
);
