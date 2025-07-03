import { toZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';

export const getHistory = createAPI(
  async ({ query: { flowId }, prismaClient, userId }) => {
    const userTimezone = await getUserTimezone(userId!);

    const flowTypeResult = await prismaClient.flow.findUnique({
      where: {
        id: flowId,
        userId,
      },
      select: {
        type: true,
      },
    });

    const flowType = flowTypeResult?.type;

    const result = await prismaClient.flow.findUnique({
      where: {
        id: flowId,
        userId,
      },
      select: {
        history: {
          select: { id: true, count: true, complete: true, date: true },
          where: {
            flowId,
            type: flowType,
          },
        },
      },
    });

    if (!result) {
      throw new BadRequestError('can not find flow data');
    }

    const historys = result.history ?? [];

    return historys.map((it) => ({
      ...it,
      date: toZonedTime(it.date, userTimezone),
    }));
  },
  {
    query: t.Object({
      flowId: t.String(),
    }),
  }
);
