import { randomUUIDv7 } from 'bun';
import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { UnauthorizedError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const postLogin = createAPI(
  async ({
    body: { email, password },
    atJWT,
    rtJWT,
    prismaClient,
    redisClient,
  }) => {
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
  },
  {
    body: t.Object({
      email: v.isEmail,
      password: v.isPassword,
    }),
  }
);
