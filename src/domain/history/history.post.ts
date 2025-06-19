import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const postHistory = createAPI(
  async ({
    body: { challengeId, challengeItemId, date: _date, complete, count },
    prismaClient,
    userId,
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

    const date = fromZonedTime(new Date(`${_date} 00:00:00`), userTimezone);

    const result = await prismaClient.challengeItemHistory.create({
      data: {
        challengeItemId,
        date,
        complete,
        count,
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
      date: v.isDate,
      complete: v.isHistoryComplete,
      count: v.isHistoryCount,
    }),
  }
);
