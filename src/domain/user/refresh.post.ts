import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { UnauthorizedError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';

export const refresh = createAPI(
  async ({ body: { refreshToken, clientId }, rtJWT, atJWT, redisClient }) => {
    const clientIdInRedis = await redisClient.get(
      RedisKeyStore.refreshToken(refreshToken)
    );

    if (clientIdInRedis !== clientId) {
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
