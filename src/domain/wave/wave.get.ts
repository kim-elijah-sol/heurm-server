import { createAPI } from '~/lib/create-api';

export const getWave = createAPI(async ({ prismaClient, userId }) => {
  const result = await prismaClient.wave.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: [
      { order: { sort: 'asc', nulls: 'first' } },
      {
        createdAt: 'desc',
      },
    ],
  });

  return result;
}, {});
