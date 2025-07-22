import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const patchWave = createAPI(
  async ({ body: { name, id }, prismaClient, userId }) => {
    await prismaClient.wave.update({
      data: {
        name,
      },
      where: {
        id,
        userId,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      id: t.String(),
      name: t.String(),
    }),
  }
);
