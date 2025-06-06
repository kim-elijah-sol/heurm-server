import { app } from '~/app';
import { challenge } from '~/domain/challenge';
import { user } from '~/domain/user';
import { guardAccessToken } from '~/lib/plugin';

app
  .get('/uploads/:fileName', ({ params }) =>
    Bun.file(`./uploads/${params.fileName}`)
  )
  .group('/user', (app) =>
    app
      .group('/join', (app) =>
        app
          .post(
            '/verify-email-send',
            user.join.postVerifyEmailSend,
            user.join.postVerifyEmailSend.model
          )
          .post(
            '/verify-email',
            user.join.postVerifyEmail,
            user.join.postVerifyEmail.model
          )
          .post('', user.join.postJoin, user.join.postJoin.model)
      )
      .group('/reset-password', (app) =>
        app
          .post(
            '/verify-email-send',
            user.resetPassword.postVerifyEmailSend,
            user.resetPassword.postVerifyEmailSend.model
          )
          .post(
            '/verify-email',
            user.resetPassword.postVerifyEmail,
            user.resetPassword.postVerifyEmail.model
          )
          .patch(
            '/',
            user.resetPassword.patchResetPassword,
            user.resetPassword.patchResetPassword.model
          )
      )
      .post('/login', user.postLogin, user.postLogin.model)
      .delete('logout', user.deleteLogout, user.deleteLogout.model)
      .post('/refresh', user.postRefresh, user.postRefresh.model)
  );

app
  .derive(guardAccessToken)
  .group('/user', (app) =>
    app
      .get('/profile', user.getProfile, user.getProfile.model)
      .patch('/profile', user.patchProfile, user.patchProfile.model)
  )
  .group('/challenge', (app) =>
    app
      .post('/', challenge.postChallenge, challenge.postChallenge.model)
      .get('/', challenge.getChallenge, challenge.getChallenge.model)
      .get(
        '/:challengeId/challenge-item/by-day',
        challenge.challengeItem.challengeItemByDay
      )
  );

app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
