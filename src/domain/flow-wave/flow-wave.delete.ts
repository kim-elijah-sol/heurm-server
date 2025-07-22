import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const deleteFlowWave = createAPI(
  async ({ body: { flowId, waveId }, prismaClient }) => {
    await prismaClient.flowWave.delete({
      where: {
        flowId_waveId: {
          flowId,
          waveId,
        },
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
