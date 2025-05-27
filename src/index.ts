import { PrismaClient } from '@prisma/client';
import { Elysia, t } from 'elysia';
import { v } from './lib/validator';
import { redisClient } from './lib/app/redis-client';
import { SHA256 } from 'crypto-js';
import { RedisKeyStore } from './lib/redis-key-store';
import { isEmail } from './lib/validator/is-email';

const app = new Elysia();

const prisma = new PrismaClient();

app.group('/user', (app) =>
  app.group('/join', (app) =>
    app
      .get(
        '/verify-email-send',
        async ({ query: { email }, set }) => {
          const 이미_가입된_계정 = await prisma.user.findUnique({
            select: {
              id: true,
            },
            where: {
              email,
            },
          });

          if (이미_가입된_계정 !== null) {
            set.status = 409;

            throw new Error('Already joined email address.');
          }

          const id = SHA256(`${new Date().valueOf()}-${email}`).toString();

          const code = Math.floor(Math.random() * 999999)
            .toString()
            .padStart(6, '0');

          await redisClient.set(RedisKeyStore.verifyEmail(id, email), code);

          return {
            id,
            code,
          };
        },
        {
          query: t.Object({
            email: v.isEmail,
          }),
        }
      )
      .get(
        '/verify-email',
        async ({ query: { code, id, email }, set }) => {
          const codeInRedis = await redisClient.get(
            RedisKeyStore.verifyEmail(id, email)
          );

          if (codeInRedis === null) {
            set.status = 400;
            throw new Error('not exist verify infomation');
          }

          return {
            result: code === codeInRedis,
          };
        },
        {
          query: t.Object({
            code: t.String({ maxLength: 6, minLength: 6 }),
            id: t.String(),
            email: isEmail,
          }),
        }
      )
  )
);
app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
