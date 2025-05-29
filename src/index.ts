import { login, logout, refresh } from '~/domain/user';
import { join, verifyEmail, verifyEmailSend } from '~/domain/user/join';
import { app } from './app';

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
    .post('/refresh', refresh, refresh.model)
);
app.listen(3000, () => {
  console.log('[Win Yourself]:: Server Start 3000 port');
});
