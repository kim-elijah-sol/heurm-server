import { t } from 'elysia';

export const isVerifyCode = t.String({
  maxLength: 6,
  minLength: 6,
});
