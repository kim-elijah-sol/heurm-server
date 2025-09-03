import { HttpsError } from './https-error';

export class BadRequestError extends HttpsError {
  public statusCode: number = 400;
}
