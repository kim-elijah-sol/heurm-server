import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { getDay } from '~/lib/fx';
import { v } from '~/lib/validator';

export const getOverview = createAPI(
  async ({ query: { date }, userId, prismaClient }) => {
    const userTimezone = await getUserTimezone(userId!);

    const historyStartDate = fromZonedTime(
      new Date(`${date} 00:00:00`),
      userTimezone
    );

    const historyEndDate = fromZonedTime(
      new Date(`${date} 23:59:59`),
      userTimezone
    );

    const userDate = toZonedTime(date, userTimezone);

    const userDay = getDay(userDate.getDay());

    const challenges = await prismaClient.challenge.findMany({
      where: { userId },
      select: {
        items: {
          select: {
            type: true,
            days: true,
            history: {
              where: {
                date: {
                  gte: historyStartDate,
                  lt: historyEndDate,
                },
              },
              select: {
                id: true,
                complete: true,
                count: true,
                targetCount: true,
              },
            },
          },
          where: {
            AND: [
              {
                startAt: {
                  lte: historyStartDate,
                },
              },
              {
                OR: [
                  {
                    endAt: {
                      equals: null,
                    },
                  },
                  {
                    endAt: {
                      gte: historyEndDate,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    });

    const todayChallenges = challenges
      .map((it) => it.items)
      .flat()
      .filter((it) => it.days.includes(userDay))
      .map((it) => ({
        ...it,
        history: it.history[0] ?? null,
      }));

    const inProgress = todayChallenges.filter((it) => {
      if (it.history === null) return true;
      if (it.type === 'COMPLETE' && it.history.complete === null) return true;
      if (it.type !== 'COMPLETE' && it.history.count === null) return true;

      return false;
    }).length;

    const win = todayChallenges.filter((it) => {
      if (it.history === null) return false;
      if (it.type === 'COMPLETE' && it.history.complete === true) return true;
      if (
        it.type === 'OVER' &&
        it.history.count !== null &&
        it.history.targetCount !== null &&
        it.history.count >= it.history.targetCount
      )
        return true;
      if (
        it.type === 'UNDER' &&
        it.history.count !== null &&
        it.history.targetCount !== null &&
        it.history.count <= it.history.targetCount
      )
        return true;

      return false;
    }).length;

    return {
      inProgress,
      win,
      lose: todayChallenges.length - inProgress - win,
    };
  },
  {
    query: t.Object({
      date: v.isDate,
    }),
  }
);
