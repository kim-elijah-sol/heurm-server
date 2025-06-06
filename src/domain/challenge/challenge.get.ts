import { createAPI } from '~/lib/create-api';

export const getChallenge = createAPI(async ({ userId, prismaClient }) => {
  const challenges = await prismaClient.challenge.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      title: true,
      color: true,
    },
  });

  return challenges;
}, {});
