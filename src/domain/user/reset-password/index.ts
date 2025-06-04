import { patchResetPassword } from './reset-password.patch';
import { postVerifyEmailSend } from './verify-email-send.post';
import { postVerifyEmail } from './verify-email.post';

export const resetPassword = {
  postVerifyEmailSend,
  postVerifyEmail,
  patchResetPassword,
};
