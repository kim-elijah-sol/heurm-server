import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { v } from '~/lib/validator';

export const patchHistory = createAPI(
  async ({ body: { flowId, id, complete, count }, prismaClient, userId }) => {
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

    const result = await prismaClient.flowHistory.update({
      where: {
        id,
      },
      data: {
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
      id: t.String(),
      complete: v.isHistoryComplete,
      count: v.isHistoryCount,
    }),
  }
);
