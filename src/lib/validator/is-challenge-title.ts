import { t } from 'elysia';

export const isChallengeTitle = t.String({
  minLength: 2,
  maxLength: 16,
});
