import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';
import { postFlow } from './flow.post';

export const patchFlow = createAPI(
  async ({
    body: {
      flowId,
      name,
      type,
      color,
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
    const conflictFlowForName = await prismaClient.flow.findFirst({
      where: {
        userId,
        name,
        id: { not: flowId },
      },
      select: { id: true },
    });

    if (conflictFlowForName !== null) {
      throw new ConflictError(`${name} flow is already added.`);
    }

    const userTimezone = await getUserTimezone(userId!);

    await prismaClient.flow.update({
      where: {
        id: flowId,
      },
      data: {
        name,
        color,
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
      ...postFlow.model.body.properties,
      flowId: t.String(),
    }),
  }
);
