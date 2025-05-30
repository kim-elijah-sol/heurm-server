import cors from '@elysiajs/cors';
import jwt from '@elysiajs/jwt';
import Elysia, { InferContext, RouteSchema, status } from 'elysia';
import { BadRequestError, ConflictError } from '~/lib/error';

export const app = new Elysia()
  .use(
    jwt({
      name: 'atJWT',
      secret: process.env.AT_JWT!,
    })
  )
  .use(
    jwt({
      name: 'rtJWT',
      secret: process.env.RT_JWT!,
    })
  )
  .use(cors())
  .onError(({ error }) => {
    if (error instanceof ConflictError) {
      return status(409, error.message);
    } else if (error instanceof BadRequestError) {
      return status(400, error.message);
    }
  });

export type AppContext<Schema extends RouteSchema = {}> = InferContext<
  typeof app,
  '',
  Schema
>;
