import { t } from 'elysia';
import { AppContext, redisClient } from '~/app';
import { RedisKeyStore } from '~/lib/redis-key-store';

export const logout = async ({
  body: { refreshToken },
}: AppContext<{
  body: typeof logoutBodyModel.static;
}>) => {
  await redisClient.del(RedisKeyStore.refreshToken(refreshToken));

  return {
    result: true,
  };
};

const logoutBodyModel = t.Object({
  refreshToken: t.String(),
});

logout.model = {
  body: logoutBodyModel,
};
