import { HttpsError } from './https-error';

export class ConflictError extends HttpsError {
  public statusCode: number = 409;
}
