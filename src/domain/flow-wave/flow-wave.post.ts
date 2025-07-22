import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const postFlowWave = createAPI(
  async ({ body: { flowId, waveId }, prismaClient }) => {
    await prismaClient.flowWave.create({
      data: {
        flowId,
        waveId,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      flowId: t.String(),
      waveId: t.String(),
    }),
  }
);
