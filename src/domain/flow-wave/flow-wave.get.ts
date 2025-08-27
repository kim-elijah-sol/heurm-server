import { createAPI } from '~/lib/create-api';

export const getFlowWaveCount = createAPI(async ({ userId, prismaClient }) => {
  const result = await prismaClient.wave.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: { flow: true },
      },
    },
  });

  return result.map((it) => ({
    id: it.id,
    name: it.name,
    flowWaveCount: it._count,
  }));
}, {});
