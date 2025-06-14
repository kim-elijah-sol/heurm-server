import { prismaClient, redisClient } from '~/app';
import { UnauthorizedError } from '../error';
import { RedisKeyStore } from '../redis-key-store';

export const getUserTimezone = async (userId: string) => {
  const inRedis = await redisClient.get(RedisKeyStore.userTimezone(userId));

  if (inRedis) {
    return inRedis;
  }

  const userTimezone = (
    await prismaClient.user.findUnique({
      where: { id: userId },
      select: { timezone: true },
    })
  )?.timezone;

  if (!userTimezone) {
    throw new UnauthorizedError('can not find matching account');
  }

  await redisClient.set(RedisKeyStore.userTimezone(userId), userTimezone);

  return userTimezone;
};
