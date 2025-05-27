import { PrismaClient } from '@prisma/client';
import { Elysia, t } from 'elysia';
import { v } from './lib/validator';
import { redisClient } from './lib/app/redis-client';
import { SHA256 } from 'crypto-js';
import { RedisKeyStore } from './lib/redis-key-store';
import { EMAIL_VERIFY_EXPIRE, EMAIL_VERIFY_OK } from './lib/constant';

const app = new Elysia();

const prismaClient = new PrismaClient({
  log: ['query', 'info', 'error', 'warn'],
});

app.group('/user', (app) =>
  app.group('/join', (app) =>
    app
      .get(
        '/verify-email-send',
        async ({ query: { email }, set }) => {
          const alreadyJoinedAccount = await prismaClient.user.findUnique({
            select: {
              id: true,
            },
            where: {
              email,
            },
          });

          if (alreadyJoinedAccount !== null) {
            set.status = 409;

            throw new Error('Already joined email address.');
          }

          const id = SHA256(`${new Date().valueOf()}-${email}`).toString();

          const code = Math.floor(Math.random() * 999999)
            .toString()
            .padStart(6, '0');

          const redisKey = RedisKeyStore.verifyEmail(id, email);

          await redisClient.set(redisKey, code);
          await redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);

          return {
            id,
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
          const redisKey = RedisKeyStore.verifyEmail(id, email);

          const codeInRedis = await redisClient.get(redisKey);

          if (codeInRedis === null) {
            set.status = 400;
            throw new Error('not exist verify infomation');
          }

          const result = code === codeInRedis;

          if (result) {
            redisClient.set(redisKey, EMAIL_VERIFY_OK);
            redisClient.expire(redisKey, EMAIL_VERIFY_EXPIRE);
          }

          return {
            result,
          };
        },
        {
          query: t.Object({
            code: v.isVerifyCode,
            id: t.String(),
            email: v.isEmail,
          }),
        }
      )
      .post(
        '',
        async ({
          body: { email, id, password, timezone, timezoneOffset },
          set,
        }) => {
          const redisKey = RedisKeyStore.verifyEmail(id, email);

          const codeInRedis = await redisClient.get(redisKey);

          if (codeInRedis === EMAIL_VERIFY_OK) {
            set.status = 400;
            throw new Error('not exist verify infomation');
          }

          await redisClient.del(redisKey);

          await prismaClient.user.create({
            data: {
              email,
              password: SHA256(password).toString(),
              name: email.split('@')[0],
              timezone,
              timezoneOffset,
            },
          });
        },
        {
          body: t.Object({
            email: v.isEmail,
            id: t.String(),
            password: v.isPassword,
            timezone: t.String(),
            timezoneOffset: t.Number(),
          }),
        }
      )
  )
);
app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
