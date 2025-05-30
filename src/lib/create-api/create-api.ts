import { RouteSchema } from 'elysia';
import { AppContext } from '~/app';

export const createAPI = <T, Schema extends RouteSchema = {}>(
  apiHandler: (context: AppContext<Schema>) => Promise<T>,
  model: Schema
): {
  (context: AppContext<Schema>): Promise<T>;
  model: Schema;
} => {
  return Object.assign(apiHandler, {
    model,
  });
};
