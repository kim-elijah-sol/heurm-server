import { SHA256 } from 'crypto-js';
import { AppContext, prismaClient, redisClient } from '../../../app';
import { EMAIL_VERIFY_EXPIRE } from '../../../lib/constant';
import { RedisKeyStore } from '../../../lib/redis-key-store';
import { t } from 'elysia';
import { v } from '../../../lib/validator';

export const verifyEmailSend = async ({
  query: { email },
  set,
}: AppContext) => {
  const alreadyJoinedAccount = await prismaClient.user.findUnique({
    select: {
      id: true,
    },
    where: {
      email,
    },
  });

  if (alreadyJoinedAccount !== null) {
    set.status = 409;

    throw new Error('Already joined email address.');
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
};

verifyEmailSend.model = {
  query: t.Object({
    email: v.isEmail,
  }),
};
