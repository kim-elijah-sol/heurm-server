import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const deleteFlow = createAPI(
  async ({ body: { flowId }, prismaClient, userId }) => {
    await prismaClient.flow.delete({
      where: {
        userId,
        id: flowId,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      flowId: t.String(),
    }),
  }
);
