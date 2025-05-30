import { randomUUIDv7 } from 'bun';
import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { AppContext, prismaClient, redisClient } from '~/app';
import { UnauthorizedError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const login = async ({
  body: { email, password },
  atJWT,
  rtJWT,
}: AppContext<{
  body: typeof loginBodyModel.static;
}>) => {
  const user = await prismaClient.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email: email,
      password: SHA256(password).toString(),
    },
  });

  if (user === null) {
    throw new UnauthorizedError('can not find matching account');
  }

  const { id } = user;

  const accessToken = await atJWT.sign({
    id,
  });

  const clientId = randomUUIDv7();

  const refreshToken = await rtJWT.sign({
    id,
  });

  await redisClient.set(RedisKeyStore.refreshToken(refreshToken), clientId);

  return {
    accessToken,
    refreshToken,
    clientId,
  };
};

const loginBodyModel = t.Object({
  email: v.isEmail,
  password: v.isPassword,
});

login.model = {
  body: loginBodyModel,
};
