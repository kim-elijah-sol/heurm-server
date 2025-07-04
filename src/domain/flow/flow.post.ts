import { fromZonedTime } from 'date-fns-tz';
import { t } from 'elysia';
import { getUserTimezone } from '~/lib/cache';
import { createAPI } from '~/lib/create-api';
import { v } from '~/lib/validator';

export const postFlow = createAPI(
  async ({
    body: {
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
    const userTimezone = await getUserTimezone(userId!);

    const result = await prismaClient.flow.create({
      data: {
        userId: userId!,
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
        startAt: fromZonedTime(new Date(`${startAt} 00:00:00`), userTimezone),
        endAt: endAt
          ? fromZonedTime(new Date(`${endAt} 23:59:59`), userTimezone)
          : null,

        startTime,
        endTime,
      },
      select: {
        id: true,
      },
    });

    return {
      id: result.id,
    };
  },
  {
    body: t.Object({
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
