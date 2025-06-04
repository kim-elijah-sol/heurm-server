import { login, logout, profile, refresh } from '~/domain/user';
import { join, verifyEmail, verifyEmailSend } from '~/domain/user/join';
import { app } from './app';
import { postChallenge } from './domain/challenge';
import { patchProfile } from './domain/user/profile.patch';
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
          .get('/verify-email-send', verifyEmailSend, verifyEmailSend.model)
          .post('/verify-email', verifyEmail, verifyEmail.model)
          .post('', join, join.model)
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
      .post('/login', login, login.model)
      .delete('logout', logout, logout.model)
      .post('/refresh', refresh, refresh.model)
  );

app
  .derive(guardAccessToken)
  .group('/user', (app) =>
    app
      .get('/profile', profile, profile.model)
      .patch('/profile', patchProfile, patchProfile.model)
  )
  .group('/challenge', (app) =>
    app.post('/', postChallenge, postChallenge.model)
  );

app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
