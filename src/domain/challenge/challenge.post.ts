import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { v } from '~/lib/validator';

export const postChallenge = createAPI(
  async ({ body: { title, color }, userId, prismaClient }) => {
    const result = await prismaClient.challenge.create({
      data: {
        title,
        color,
        userId: userId!,
      },
      select: {
        id: true,
        title: true,
      },
    });

    return {
      id: result.id,
      title: result.title,
    };
  },
  {
    body: t.Object({
      title: v.isChallengeTitle,
      color: v.isChallengeColor,
    }),
  }
);
