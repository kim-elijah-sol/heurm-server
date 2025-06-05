import { join } from '~/domain/user/join';
import { app } from './app';
import { postChallenge } from './domain/challenge';
import { user } from './domain/user';
import { resetPassword } from './domain/user/reset-password';
import { guardAccessToken } from './lib/plugin';

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
            join.postVerifyEmailSend,
            join.postVerifyEmailSend.model
          )
          .post(
            '/verify-email',
            join.postVerifyEmail,
            join.postVerifyEmail.model
          )
          .post('', join.postJoin, join.postJoin.model)
      )
      .group('/reset-password', (app) =>
        app
          .post(
            '/verify-email-send',
            resetPassword.postVerifyEmailSend,
            resetPassword.postVerifyEmailSend.model
          )
          .post(
            '/verify-email',
            resetPassword.postVerifyEmail,
            resetPassword.postVerifyEmail.model
          )
          .patch(
            '/',
            resetPassword.patchResetPassword,
            resetPassword.patchResetPassword.model
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
    app.post('/', postChallenge, postChallenge.model)
  );

app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
