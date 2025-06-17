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
      days,
      date: _date,
      unit,
      targetCount,
      startAt,
      endAt,
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

    if (
      type !== 'COMPLETE' &&
      targetCount !== null &&
      targetCount !== undefined
    ) {
      const date = fromZonedTime(new Date(`${_date} 00:00:00`), userTimezone);

      await prismaClient.challengeItemHistory.updateMany({
        where: {
          challengeItemId,
          date,
        },
        data: {
          targetCount,
        },
      });
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
      type: v.isChallengeItemType,
      days: v.isChallengeItemDays,
      date: v.isDate,
      unit: t.Optional(t.Nullable(t.String())),
      targetCount: t.Optional(t.Nullable(t.Number())),
      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),
    }),
  }
);
