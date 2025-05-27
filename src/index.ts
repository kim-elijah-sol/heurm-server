import { PrismaClient } from '@prisma/client';
import { Elysia, t } from 'elysia';
import { v } from './lib/validator';
import { redisClient } from './lib/app/redis-client';
import { SHA256 } from 'crypto-js';
import { RedisKeyStore } from './lib/redis-key-store';
import { EMAIL_VERIFY_EXPIRE, EMAIL_VERIFY_OK } from './lib/constant';
import jwt from '@elysiajs/jwt';
import { randomUUIDv7 } from 'bun';

const app = new Elysia();

const prismaClient = new PrismaClient({
  log: ['query', 'info', 'error', 'warn'],
});

app
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
  .group('/user', (app) =>
    app
      .group('/join', (app) =>
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
      .post(
        '/login',
        async ({ body: { email, password }, atJWT, rtJWT, set }) => {
          const user = await prismaClient.user.findUnique({
            select: {
              id: true,
            },
            where: {
              email: email,
              password: SHA256(password).toString(),
            },
          });

          if (user === null) {
            set.status = 401;
            throw new Error('can not find matching account');
          }

          const { id } = user;

          const accessToken = await atJWT.sign({
            id,
          });

          const clientId = randomUUIDv7();

          const refreshToken = await rtJWT.sign({
            clientId,
          });

          await redisClient.set(RedisKeyStore.refreshToken(refreshToken), id);

          return {
            accessToken,
            refreshToken,
            clientId,
          };
        },
        {
          body: t.Object({
            email: v.isEmail,
            password: v.isPassword,
          }),
        }
      )
      .delete(
        'logout',
        async ({ body: { refreshToken } }) => {
          await redisClient.del(RedisKeyStore.refreshToken(refreshToken));

          return {
            result: true,
          };
        },
        {
          body: t.Object({
            refreshToken: t.String(),
          }),
        }
      )
  );
app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
