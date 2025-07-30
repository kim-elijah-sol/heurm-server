import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const patchReorder = createAPI(
  async ({ body: { ids }, prismaClient }) => {
    await prismaClient.$transaction(
      ids.map((id, index) =>
        prismaClient.wave.update({
          where: { id },
          data: { order: index + 1 },
        })
      )
    );

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      ids: t.Array(t.String()),
    }),
  }
);
