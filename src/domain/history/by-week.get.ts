import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { filterChallengeableItem, getDay } from '~/lib/fx';
import { v } from '~/lib/validator';

const getDateRange = (start: string, end: string): string[] => {
  const result: string[] = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    result.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return result;
};

export const getByWeek = createAPI(
  async ({ query: { start, end }, userId, prismaClient }) => {
    const userTimezone = await getUserTimezone(userId!);

    const historyStartDate = fromZonedTime(
      new Date(`${start} 00:00:00`),
      userTimezone
    );

    const historyEndDate = fromZonedTime(
      new Date(`${end} 23:59:59`),
      userTimezone
    );

    const result = await prismaClient.challenge.findMany({
      where: {
        userId,
      },
      select: {
        items: {
          select: {
            days: true,
            type: true,
            startAt: true,
            endAt: true,
            history: {
              select: {
                complete: true,
                count: true,
                targetCount: true,
                date: true,
              },
              where: {
                date: {
                  gte: historyStartDate,
                  lte: historyEndDate,
                },
              },
            },
          },
        },
      },
    });

    const data: {
      [key in string]: {
        all: number;
        win: number;
      };
    } = {};

    console.log(JSON.stringify(result));

    for (const date of getDateRange(start, end)) {
      const day = getDay(new Date(date).getDay());

      const startDate = fromZonedTime(
        new Date(`${date} 00:00:00`),
        userTimezone
      );

      const endDate = fromZonedTime(new Date(`${date} 23:59:59`), userTimezone);

      const all = result
        .map(({ items }) =>
          items
            .filter(
              filterChallengeableItem({
                day,
                startDate: startDate,
                endDate: endDate,
              })
            )
            .flat()
        )
        .flat().length;

      data[date] = { all: all, win: 0 };
    }

    for (const { items } of result) {
      for (const challengeItem of items) {
        for (const history of challengeItem.history) {
          const historyDate = history.date;

          const userHistoryDate = toZonedTime(historyDate, userTimezone);

          const userHistoryDay = getDay(userHistoryDate.getDay());

          const formatedHistoryDate = userHistoryDate
            .toISOString()
            .split('T')[0];

          if (
            filterChallengeableItem({
              day: userHistoryDay,
              startDate: historyStartDate,
              endDate: historyEndDate,
            })(challengeItem)
          ) {
            if (challengeItem.type === 'COMPLETE' && history.complete) {
              data[formatedHistoryDate].win += 1;
            } else if (
              challengeItem.type === 'OVER' &&
              history.count !== null &&
              history.targetCount !== null &&
              history.count >= history.targetCount
            ) {
              data[formatedHistoryDate].win += 1;
            } else if (
              challengeItem.type === 'UNDER' &&
              history.count !== null &&
              history.targetCount !== null &&
              history.count <= history.targetCount
            ) {
              data[formatedHistoryDate].win += 1;
            }
          }
        }
      }
    }

    return data;
  },
  {
    query: t.Object({
      start: v.isDate,
      end: v.isDate,
    }),
  }
);
