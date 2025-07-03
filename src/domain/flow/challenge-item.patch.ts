import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchChallengeItem = createAPI(
  async ({
    body: {
      challengeId,
      challengeItemId,
      name,
      type,
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

      startTime,
      endTime,
    },
    userId,
    prismaClient,
  }) => {
    const userTimezone = await getUserTimezone(userId!);

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

        startAt: fromZonedTime(new Date(`${startAt} 00:00:00`), userTimezone),
        endAt: endAt
          ? fromZonedTime(new Date(`${endAt} 23:59:59`), userTimezone)
          : null,

        startTime,
        endTime,
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
      intervalType: v.isChallengeItemIntervalType,

      repeatType: v.isChallengeItemRepeatType,
      repeat: t.Optional(t.Nullable(t.Number())),
      rest: t.Optional(t.Nullable(t.Number())),

      days: t.Optional(t.Array(t.Number())),

      dates: t.Optional(t.Array(t.Number())),
      weeks: t.Optional(t.Array(t.Number())),

      months: t.Optional(t.Array(t.Number())),

      targetCount: t.Optional(t.Nullable(t.Number())),
      unit: t.Optional(t.Nullable(t.String())),
      accumulateType: t.Optional(t.Nullable(v.isChallengeItemIntervalType)),

      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),

      startTime: t.Optional(t.Nullable(t.Number())),
      endTime: t.Optional(t.Nullable(t.Number())),
    }),
  }
);
