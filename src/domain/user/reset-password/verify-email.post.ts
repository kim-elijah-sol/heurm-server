import { t } from 'elysia';
import { EMAIL_VERIFY_EXPIRE, EMAIL_VERIFY_OK } from '~/lib/constant';
import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const postVerifyEmail = createAPI(
  async ({ body: { code, id, email }, redisClient }) => {
    const redisKey = RedisKeyStore.resetPasswordVerifyEmail(id, email);

    const codeInRedis = await redisClient.get(redisKey);

    if (codeInRedis === null) {
      throw new BadRequestError('not exist verify infomation');
    }

    const result = code === codeInRedis;

    if (result) {
      redisClient.set(redisKey, EMAIL_VERIFY_OK);
      redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);
    }

    return {
      result,
    };
  },
  {
    body: t.Object({
      code: v.isVerifyCode,
      id: t.String(),
      email: v.isEmail,
    }),
  }
);
