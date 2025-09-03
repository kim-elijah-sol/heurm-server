import cors from '@elysiajs/cors';
import jwt from '@elysiajs/jwt';
import swagger from '@elysiajs/swagger';
import Elysia, { InferContext, RouteSchema, status } from 'elysia';
import { HttpsError } from '~/lib/error/https-error';
import { prismaClient } from './prisma-client';
import { redisClient } from './redis-client';

export const app = new Elysia()
  .use(
    jwt({
      name: 'atJWT',
      secret: process.env.AT_JWT!,
      exp: '30m',
    })
  )
  .use(
    jwt({
      name: 'rtJWT',
      secret: process.env.RT_JWT!,
    })
  )
  .use(cors())
  .use(swagger())
  .decorate('prismaClient', prismaClient)
  .decorate('redisClient', redisClient)
  .onError(({ error }) => {
    if (error instanceof HttpsError) {
      return status(error.statusCode, error.message);
    }

    return status(500, 'Internal Server Error');
  });

export type AppContext<Schema extends RouteSchema = {}> = InferContext<
  typeof app,
  '',
  Schema
> & {
  userId?: string;
};
