import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const postChallengeItem = createAPI(
  async ({
    body: {
      challengeId,
      name,
      type,
      intervalType,

      dailyType,
      dailyInterval,
      dailyRest,
      dailyAnyInterval,

      weeklyType,
      weeklyInterval,
      weeklyRest,
      days,

      monthlyType,
      monthlyInterval,
      monthlyRest,
      dates,
      weeks,

      yearlyType,
      yearlyInterval,
      yearlyRest,
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

    const result = await prismaClient.challengeItem.create({
      data: {
        challengeId,
        name,
        type,
        intervalType,

        dailyType,
        dailyInterval,
        dailyRest,
        dailyAnyInterval,

        weeklyType,
        weeklyInterval,
        weeklyRest,
        days,

        monthlyType,
        monthlyInterval,
        monthlyRest,
        dates,
        weeks,

        yearlyType,
        yearlyInterval,
        yearlyRest,
        months,

        targetCount,
        unit,
        accumulateType,

        startAt,
        endAt,
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
      intervalType: v.isChallengeItemIntervalType,

      dailyType: t.Optional(v.isChallengeItemDailyRepeatType),
      dailyInterval: t.Optional(t.Nullable(t.Number())),
      dailyRest: t.Optional(t.Nullable(t.Number())),
      dailyAnyInterval: t.Optional(t.Nullable(t.Number())),

      weeklyType: t.Optional(v.isChallengeItemNotDailyRepeatType),
      weeklyInterval: t.Optional(t.Nullable(t.Number())),
      weeklyRest: t.Optional(t.Nullable(t.Number())),
      days: t.Optional(v.isChallengeItemDays),

      monthlyType: t.Optional(v.isChallengeItemNotDailyRepeatType),
      monthlyInterval: t.Optional(t.Nullable(t.Number())),
      monthlyRest: t.Optional(t.Nullable(t.Number())),
      dates: t.Optional(t.Array(t.Number())),
      weeks: t.Optional(t.Array(t.Number())),

      yearlyType: t.Optional(v.isChallengeItemNotDailyRepeatType),
      yearlyInterval: t.Optional(t.Nullable(t.Number())),
      yearlyRest: t.Optional(t.Nullable(t.Number())),
      months: t.Optional(t.Array(t.String())),

      targetCount: t.Optional(t.Nullable(t.Number())),
      unit: t.Optional(t.Nullable(t.String())),
      accumulateType: t.Optional(t.Nullable(v.isChallengeItemIntervalType)),

      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),
    }),
  }
);
