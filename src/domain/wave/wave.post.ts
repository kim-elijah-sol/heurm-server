import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';

export const postWave = createAPI(
  async ({ body: { name }, prismaClient, userId }) => {
    const conflictWaveForName = await prismaClient.wave.findFirst({
      where: {
        userId,
        name,
      },
      select: {
        id: true,
      },
    });

    if (conflictWaveForName !== null) {
      throw new ConflictError(`${name} flow is already added.`);
    }

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
