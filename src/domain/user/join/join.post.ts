import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { EMAIL_VERIFY_OK } from '~/lib/constant';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const join = createAPI(
  async ({
    body: { email, id, password, timezone, timezoneOffset },
    prismaClient,
    redisClient,
  }) => {
    const redisKey = RedisKeyStore.verifyEmail(id, email);

    const codeInRedis = await redisClient.get(redisKey);

    if (codeInRedis !== EMAIL_VERIFY_OK) {
      throw new BadRequestError('not exist verify infomation');
    }

    await redisClient.del(redisKey);

    await prismaClient.user.create({
      data: {
        email,
        password: SHA256(password).toString(),
        name: email.split('@')[0],
        timezone,
        timezoneOffset,
      },
    });
  },
  {
    body: t.Object({
      email: v.isEmail,
      id: t.String(),
      password: v.isPassword,
      timezone: t.String(),
      timezoneOffset: t.Number(),
    }),
  }
);
