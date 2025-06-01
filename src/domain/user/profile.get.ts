import { createAPI } from '~/lib/create-api';
import { BadRequestError } from '~/lib/error';

export const profile = createAPI(async ({ userId, prismaClient }) => {
  const result = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      profileImage: true,
    },
  });

  if (result === null) {
    throw new BadRequestError('can not find user data');
  }

  return result;
}, {});
