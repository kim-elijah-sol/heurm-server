import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const postWave = createAPI(
  async ({ body: { name }, prismaClient, userId }) => {
    const result = await prismaClient.wave.create({
      data: {
        userId: userId!,
        name,
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
      name: t.String(),
    }),
  }
);
