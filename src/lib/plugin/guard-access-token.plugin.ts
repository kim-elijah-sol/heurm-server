import { jwtDecode } from 'jwt-decode';
import { AppContext } from '~/app';
import { UnauthorizedError } from '../error';

export const guardAccessToken = async (context: AppContext) => {
  const { headers, atJWT } = context;

  const authorization = headers['authorization'];

  if (!authorization) {
    throw new UnauthorizedError('Authorization header is not provided');
  }

  const bearer = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (bearer === null) {
    throw new UnauthorizedError('Authorization header is incorrect format');
  }

  const parseResult = await atJWT.verify(bearer);

  if (parseResult === false) {
    try {
      const decoded = jwtDecode(bearer);

      if (decoded.exp) {
        if (decoded.exp <= new Date().valueOf() / 1000) {
          throw new UnauthorizedError('Access token is expired');
        }
      }
    } catch {
      throw new UnauthorizedError('Access token is incorrect');
    }

    throw new UnauthorizedError('Access token is incorrect');
  }

  const userId = parseResult.id?.toString();

  if (!userId) {
    throw new UnauthorizedError('Access token is has not required data');
  }

  return {
    userId,
  };
};
