import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';

export const deleteLogout = createAPI(
  async ({ body: { refreshToken }, prismaClient }) => {
    await prismaClient.refreshToken.delete({
      where: {
        refreshToken,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      refreshToken: t.String(),
    }),
  }
);
