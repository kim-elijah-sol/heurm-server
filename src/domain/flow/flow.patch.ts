import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';
import { v } from '~/lib/validator';

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
      flowId: t.String(),

      name: v.isFlowName,
      type: v.isFlowType,
      color: v.isFlowColor,
      intervalType: v.isFlowIntervalType,

      repeatType: v.isFlowRepeatType,
      repeat: t.Optional(t.Nullable(t.Number())),
      rest: t.Optional(t.Nullable(t.Number())),

      days: t.Optional(t.Array(t.Number())),

      dates: t.Optional(t.Array(t.Number())),
      weeks: t.Optional(t.Array(t.Number())),

      months: t.Optional(t.Array(t.Number())),

      targetCount: t.Optional(t.Nullable(t.Number())),
      unit: t.Optional(t.Nullable(t.String())),
      accumulateType: t.Optional(t.Nullable(v.isFlowIntervalType)),

      startAt: v.isDate,
      endAt: t.Optional(t.Nullable(v.isDate)),

      startTime: t.Optional(t.Nullable(t.Number())),
      endTime: t.Optional(t.Nullable(t.Number())),
    }),
  }
);
