import cors from '@elysiajs/cors';
import jwt from '@elysiajs/jwt';
import swagger from '@elysiajs/swagger';
import Elysia, { InferContext, RouteSchema, status } from 'elysia';
import * as e from '~/lib/error';
import { prismaClient } from './prisma-client';
import { redisClient } from './redis-client';

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
  .use(swagger())
  .decorate('prismaClient', prismaClient)
  .decorate('redisClient', redisClient)
  .onError(({ error }) => {
    if (error instanceof e.BadRequestError) {
      return status(400, error.message);
    } else if (error instanceof e.UnauthorizedError) {
      return status(401, error.message);
    } else if (error instanceof e.ConflictError) {
      return status(409, error.message);
    }
  });

export type AppContext<Schema extends RouteSchema = {}> = InferContext<
  typeof app,
  '',
  Schema
>;
