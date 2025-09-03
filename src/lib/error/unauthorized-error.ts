import { HttpsError } from './https-error';

export class UnauthorizedError extends HttpsError {
  public statusCode: number = 401;
}
