import { t } from 'elysia';
import { redisClient } from '~/app';
import { createAPI } from '~/lib/create-api';
import { RedisKeyStore } from '~/lib/redis-key-store';

export const logout = createAPI(
  async ({ body: { refreshToken } }) => {
    await redisClient.del(RedisKeyStore.refreshToken(refreshToken));

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
