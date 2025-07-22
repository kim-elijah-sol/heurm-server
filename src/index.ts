import { app } from '~/app';
import { user } from '~/domain/user';
import { guardAccessToken } from '~/lib/plugin';
import { flow } from './domain/flow';
import { flowWave } from './domain/flow-wave';
import { history } from './domain/history';
import { wave } from './domain/wave';

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
  .group('/flow', (app) =>
    app
      .get('/', flow.getFlow, flow.getFlow.model)
      .post('/', flow.postFlow, flow.postFlow.model)
      .patch('/', flow.patchFlow, flow.patchFlow.model)
      .delete('/', flow.deleteFlow, flow.deleteFlow.model)
  )
  .group('/history', (app) =>
    app
      .post('/', history.postHistory, history.postHistory.model)
      .patch('/', history.patchHistory, history.patchHistory.model)
      .get('/', history.getHistory, history.getHistory.model)
  )
  .group('/wave', (app) =>
    app
      .post('/', wave.postWave, wave.postWave.model)
      .patch('/', wave.patchWave, wave.patchWave.model)
      .get('/', wave.getWave, wave.getWave.model)
      .delete('/', wave.deleteWave, wave.deleteWave.model)
  )
  .group('/flow-wave', (app) =>
    app
      .post('/', flowWave.postFlowWave, flowWave.postFlowWave.model)
      .delete('/', flowWave.deleteFlowWave, flowWave.deleteFlowWave.model)
  );

app.listen(3000, () => {
  console.log('[Heurm]:: Server Start 3000 port');
});
