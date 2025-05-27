import { t } from 'elysia';

const passwordPattern =
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,16}$';

export const isPassword = t.String({
  minLength: 8,
  maxLength: 16,
  pattern: passwordPattern,
});
