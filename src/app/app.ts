import cors from '@elysiajs/cors';
import jwt from '@elysiajs/jwt';
import Elysia, { InferContext, RouteSchema } from 'elysia';

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
  .use(cors());

export type AppContext<Schema extends RouteSchema = {}> = InferContext<
  typeof app,
  '',
  Schema
>;
