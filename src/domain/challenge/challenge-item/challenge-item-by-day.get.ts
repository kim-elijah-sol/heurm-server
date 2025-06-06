import { $Enums } from '@prisma/client';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { getDay } from '~/lib/fx';
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

export const challengeItemByDay = createAPI(
  async ({ params: { challengeId }, query: { day }, prismaClient, userId }) => {
    const userTimezone = await getUserTimezone(userId!);

    const utc = new Date();

    const historyStartDate = fromZonedTime(
      new Date(`${day} 00:00:00`),
      userTimezone
    );

    const historyEndDate = fromZonedTime(
      new Date(`${day} 23:59:59`),
      userTimezone
    );

    const userDate = toZonedTime(utc, userTimezone);

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
        history: {
          select: {
            complete: true,
            count: true,
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

    const todayChallengeItems = originalChallengeItems.filter((it) =>
      it.days.includes(userDay)
    );

    return {
      originalChallengeItems: originalChallengeItems.map(formatChallengeItem),
      todayChallengeItems: todayChallengeItems.map(formatChallengeItem),
    };
  },

  {
    params: t.Object({
      challengeId: t.String(),
    }),
    query: t.Object({
      day: v.isDay,
    }),
  }
);
