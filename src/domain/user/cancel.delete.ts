import { createAPI } from '~/lib/create-api';
import { RedisKeyStore } from '~/lib/redis-key-store';

export const deleteCancel = createAPI(
  async ({ userId, prismaClient, redisClient }) => {
    await redisClient.del(RedisKeyStore.userTimezone(userId!));

    await prismaClient.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      good: 'bye',
    };
  },
  {}
);
