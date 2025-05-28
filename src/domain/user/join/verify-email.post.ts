import { t } from 'elysia';
import { AppContext, redisClient } from '~/app';
import { EMAIL_VERIFY_EXPIRE, EMAIL_VERIFY_OK } from '~/lib/constant';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const verifyEmail = async ({
  query: { code, id, email },
  set,
}: AppContext) => {
  const redisKey = RedisKeyStore.verifyEmail(id, email);

  const codeInRedis = await redisClient.get(redisKey);

  if (codeInRedis === null) {
    set.status = 400;
    throw new Error('not exist verify infomation');
  }

  const result = code === codeInRedis;

  if (result) {
    redisClient.set(redisKey, EMAIL_VERIFY_OK);
    redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);
  }

  return {
    result,
  };
};

verifyEmail.model = {
  query: t.Object({
    code: v.isVerifyCode,
    id: t.String(),
    email: v.isEmail,
  }),
};
