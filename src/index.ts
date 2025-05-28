import { randomUUIDv7 } from 'bun';
import { SHA256 } from 'crypto-js';
import { t } from 'elysia';
import { join, verifyEmail, verifyEmailSend } from '~/domain/user/join';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { v } from '~/lib/validator';
import { app, prismaClient, redisClient } from './app';

app.group('/user', (app) =>
  app
    .group('/join', (app) =>
      app
        .get('/verify-email-send', verifyEmailSend, verifyEmailSend.model)
        .post('/verify-email', verifyEmail, verifyEmail.model)
        .post('', join, join.model)
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
          id,
        });

        await redisClient.set(
          RedisKeyStore.refreshToken(refreshToken),
          clientId
        );

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
    .post(
      '/refresh',
      async ({ body: { refreshToken, clientId }, set, rtJWT, atJWT }) => {
        const clientIdInRedis = await redisClient.get(
          RedisKeyStore.refreshToken(refreshToken)
        );

        if (clientIdInRedis !== clientId) {
          set.status = 401;
          throw new Error('authorization error');
        }

        const verifyResult = await rtJWT.verify(refreshToken);

        if (verifyResult === false) {
          set.status = 401;
          throw new Error('authorization error');
        }

        const { id } = verifyResult as { id: string };

        const accessToken = await atJWT.sign({
          id,
        });

        return {
          accessToken,
        };
      },
      {
        body: t.Object({
          refreshToken: t.String(),
          clientId: t.String(),
        }),
      }
    )
);
app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
