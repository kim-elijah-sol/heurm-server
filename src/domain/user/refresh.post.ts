import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { BadRequestError, UnauthorizedError } from '~/lib/error';

export const postRefresh = createAPI(
  async ({ body: { refreshToken, clientId }, rtJWT, atJWT, prismaClient }) => {
    const clientIdInDbResult = await prismaClient.refreshToken.findUnique({
      where: {
        refreshToken,
      },
      select: {
        clientId: true,
      },
    });

    if (!clientIdInDbResult) {
      throw new BadRequestError('refresh token is not available');
    }

    const clientIdInDb = clientIdInDbResult.clientId;

    if (clientIdInDb !== clientId) {
      throw new UnauthorizedError('authorization error');
    }

    const verifyResult = await rtJWT.verify(refreshToken);

    if (verifyResult === false) {
      throw new UnauthorizedError('authorization error');
    }

    const { id } = verifyResult as { id: string };

    const accessToken = await atJWT.sign({
      id,
    });

    return {
      accessToken,
    };
  },
  {
    body: t.Object({
      refreshToken: t.String(),
      clientId: t.String(),
    }),
  }
);
