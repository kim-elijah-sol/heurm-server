import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { AppContext, prismaClient, redisClient } from '~/app';
import { EMAIL_VERIFY_OK } from '~/lib/constant';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';

export const join = async ({
  body: { email, id, password, timezone, timezoneOffset },
  set,
}: AppContext<{
  body: typeof joinBodyModel.static;
}>) => {
  const redisKey = RedisKeyStore.verifyEmail(id, email);

  const codeInRedis = await redisClient.get(redisKey);

  if (codeInRedis === EMAIL_VERIFY_OK) {
    set.status = 400;
    throw new Error('not exist verify infomation');
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
};

const joinBodyModel = t.Object({
  email: v.isEmail,
  id: t.String(),
  password: v.isPassword,
  timezone: t.String(),
  timezoneOffset: t.Number(),
});

join.model = {
  body: joinBodyModel,
};
