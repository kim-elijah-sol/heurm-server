import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { EMAIL_VERIFY_OK } from '~/lib/constant';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const patchResetPassword = createAPI(
  async ({ body: { email, id, newPassword }, redisClient, prismaClient }) => {
    const redisKey = RedisKeyStore.resetPasswordVerifyEmail(id, email);

    const codeInRedis = await redisClient.get(redisKey);

    if (codeInRedis !== EMAIL_VERIFY_OK) {
      throw new BadRequestError('not exist verify infomation');
    }

    await redisClient.del(redisKey);

    await prismaClient.user.update({
      where: {
        email,
      },
      data: {
        password: SHA256(newPassword).toString(),
        updatedAt: new Date(),
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      email: v.isEmail,
      id: t.String(),
      newPassword: v.isPassword,
    }),
  }
);
