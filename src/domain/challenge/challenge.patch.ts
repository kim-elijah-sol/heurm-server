import { t } from 'elysia';
import { createAPI } from '~/lib/create-api';
import { v } from '~/lib/validator';

export const patchChallenge = createAPI(
  async ({ body: { challengeId, title, color }, userId, prismaClient }) => {
    await prismaClient.challenge.update({
      where: {
        id: challengeId,
        userId,
      },
      data: {
        title,
        color,
      },
    });

    return {
      result: true,
    };
  },
  {
    body: t.Object({
      challengeId: t.String(),
      title: v.isChallengeTitle,
      color: v.isChallengeColor,
    }),
  }
);
