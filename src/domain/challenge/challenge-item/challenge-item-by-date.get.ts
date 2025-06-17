import { $Enums } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { filterChallengeableItem, getDay } from '~/lib/fx';
import { v } from '~/lib/validator';

const formatChallengeItem = ({
  id,
  name,
  type,
  targetCount,
  unit,
  history,
}: {
  id: string;
  name: string;
  type: $Enums.ChallengeItemType;
  days: string[];
  targetCount: number | null;
  unit: string | null;
  history: {
    complete: boolean | null;
    count: number | null;
  }[];
}) => ({
  id,
  name,
  type,
  targetCount,
  unit,
  history: history[0] ?? null,
});

export const getChallengeItemByDate = createAPI(
  async ({ query: { date, challengeId }, prismaClient, userId }) => {
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

    const originalChallengeItems = await prismaClient.challengeItem.findMany({
      where: {
        challengeId,
      },
      select: {
        id: true,
        name: true,
        type: true,
        days: true,
        targetCount: true,
        unit: true,
        startAt: true,
        endAt: true,
        history: {
          select: {
            id: true,
            complete: true,
            count: true,
            targetCount: true,
          },
          where: {
            date: {
              gte: historyStartDate,
              lte: historyEndDate,
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const todayChallengeItems = originalChallengeItems.filter(
      filterChallengeableItem({
        day: userDay,
        startDate: historyStartDate,
        endDate: historyEndDate,
      })
    );

    return {
      originalChallengeItems: originalChallengeItems.map(formatChallengeItem),
      todayChallengeItems: todayChallengeItems.map(formatChallengeItem),
    };
  },

  {
    query: t.Object({
      challengeId: t.String(),
      date: v.isDate,
    }),
  }
);
