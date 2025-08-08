import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';

export const patchWave = createAPI(
  async ({ body: { name, id }, prismaClient, userId }) => {
    const conflictWaveForName = await prismaClient.wave.findFirst({
      where: {
        userId,
        name,
        id: { not: id },
      },
      select: {
        id: true,
      },
    });

    if (conflictWaveForName !== null) {
      throw new ConflictError(`${name} flow is already added.`);
    }

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
