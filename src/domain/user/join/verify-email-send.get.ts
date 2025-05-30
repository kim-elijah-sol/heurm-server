import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { EMAIL_VERIFY_EXPIRE } from '~/lib/constant';
import { createAPI } from '~/lib/create-api';
import { ConflictError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const verifyEmailSend = createAPI(
  async ({ query: { email }, prismaClient, redisClient }) => {
    const alreadyJoinedAccount = await prismaClient.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email,
      },
    });

    if (alreadyJoinedAccount !== null) {
      throw new ConflictError('Already joined email address.');
    }

    const id = SHA256(`${new Date().valueOf()}-${email}`).toString();

    const code = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');

    const redisKey = RedisKeyStore.verifyEmail(id, email);

    await redisClient.set(redisKey, code);
    await redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);

    return {
      id,
    };
  },
  {
    query: t.Object({
      email: v.isEmail,
    }),
  }
);
