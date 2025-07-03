import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const postHistory = createAPI(
  async ({
    body: { flowId, date: _date, complete, count, type },
    prismaClient,
    userId,
  }) => {
    const userTimezone = await getUserTimezone(userId!);

    const flow = await prismaClient.flow.findUnique({
      where: {
        id: flowId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (flow == null) {
      throw new BadRequestError('can not find flow data');
    }

    const date = fromZonedTime(new Date(`${_date} 00:00:00`), userTimezone);

    const result = await prismaClient.flowHistory.create({
      data: {
        flowId,
        type,
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
      flowId: t.String(),
      date: v.isDate,
      complete: v.isHistoryComplete,
      count: v.isHistoryCount,
      type: v.isFlowType,
    }),
  }
);
