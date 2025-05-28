import jwt from '@elysiajs/jwt';
import Elysia, { InferContext } from 'elysia';

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
  );

export type AppContext = InferContext<typeof app>;
