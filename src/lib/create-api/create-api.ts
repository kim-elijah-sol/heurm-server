import { RouteSchema, t } from 'elysia';
import { AppContext } from '~/app';

type ParseSchemaEntity<
  Key extends keyof RouteSchema,
  Schema extends RouteSchema = {}
> = Schema[Key] extends ReturnType<(typeof t)['Object']>
  ? Schema[Key]['static']
  : unknown;

type ParseSchema<Schema extends RouteSchema = {}> = {
  body: ParseSchemaEntity<'body', Schema>;
  headers: ParseSchemaEntity<'headers', Schema>;
  query: ParseSchemaEntity<'query', Schema>;
  params: ParseSchemaEntity<'params', Schema>;
  cookie: ParseSchemaEntity<'cookie', Schema>;
  response: ParseSchemaEntity<'response', Schema>;
};

export const createAPI = <T, Schema extends RouteSchema = {}>(
  apiHandler: (context: AppContext<ParseSchema<Schema>>) => Promise<T>,
  model: Schema
): {
  (context: AppContext<ParseSchema<Schema>>): Promise<T>;
  model: Schema;
} => {
  return Object.assign(apiHandler, {
    model,
  });
};
