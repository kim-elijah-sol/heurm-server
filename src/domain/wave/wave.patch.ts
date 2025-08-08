import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';
import { postWave } from './wave.post';

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
      ...postWave.model.body.properties,
      id: t.String(),
    }),
  }
);
