import { toZonedTime } from 'date-fns-tz';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';

export const getFlow = createAPI(async ({ prismaClient, userId }) => {
  const userTimezone = await getUserTimezone(userId!);

  const result = await prismaClient.flow.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      color: true,
      type: true,
      intervalType: true,
      repeatType: true,
      repeat: true,
      rest: true,
      days: true,
      dates: true,
      weeks: true,
      months: true,
      targetCount: true,
      unit: true,
      accumulateType: true,
      startAt: true,
      endAt: true,
      startTime: true,
      endTime: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return result.map((it) => ({
    ...it,
    startAt: toZonedTime(it.startAt, userTimezone),
    endAt: it.endAt ? toZonedTime(it.endAt, userTimezone) : null,
  }));
}, {});
