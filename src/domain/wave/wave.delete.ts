import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const deleteWave = createAPI(
  async ({ body: { id }, prismaClient, userId }) => {
    await prismaClient.wave.delete({
      where: {
        userId,
        id,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      id: t.String(),
    }),
  }
);
