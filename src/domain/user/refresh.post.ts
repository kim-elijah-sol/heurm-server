import { t } from 'elysia';
import { AppContext, redisClient } from '~/app';
import { RedisKeyStore } from '~/lib/redis-key-store';

export const refresh = async ({
  body: { refreshToken, clientId },
  set,
  rtJWT,
  atJWT,
}: AppContext<{
  body: typeof refreshBodyModel.static;
}>) => {
  const clientIdInRedis = await redisClient.get(
    RedisKeyStore.refreshToken(refreshToken)
  );

  if (clientIdInRedis !== clientId) {
    set.status = 401;
    throw new Error('authorization error');
  }

  const verifyResult = await rtJWT.verify(refreshToken);

  if (verifyResult === false) {
    set.status = 401;
    throw new Error('authorization error');
  }

  const { id } = verifyResult as { id: string };

  const accessToken = await atJWT.sign({
    id,
  });

  return {
    accessToken,
  };
};

const refreshBodyModel = t.Object({
  refreshToken: t.String(),
  clientId: t.String(),
});

refresh.model = {
  body: refreshBodyModel,
};
