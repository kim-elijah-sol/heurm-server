import { t } from 'elysia';
import { login, logout } from '~/domain/user';
import { join, verifyEmail, verifyEmailSend } from '~/domain/user/join';
import { RedisKeyStore } from '~/lib/redis-key-store';
import { app, redisClient } from './app';

app.group('/user', (app) =>
  app
    .group('/join', (app) =>
      app
        .get('/verify-email-send', verifyEmailSend, verifyEmailSend.model)
        .post('/verify-email', verifyEmail, verifyEmail.model)
        .post('', join, join.model)
    )
    .post('/login', login, login.model)
    .delete('logout', logout, logout.model)
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
