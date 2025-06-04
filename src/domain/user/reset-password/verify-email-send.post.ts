import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { EMAIL_VERIFY_EXPIRE } from '~/lib/constant';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const postVerifyEmailSend = createAPI(
  async ({ body: { email }, prismaClient, redisClient }) => {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (user === null) {
      throw new BadRequestError('No account found with this email address');
    }

    const id = SHA256(`${new Date().valueOf()}-${email}`).toString();

    const code = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, '0');

    const redisKey = RedisKeyStore.resetPasswordVerifyEmail(id, email);

    await redisClient.set(redisKey, code);
    await redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);

    return {
      id,
    };
  },
  {
    body: t.Object({
      email: v.isEmail,
    }),
  }
);
