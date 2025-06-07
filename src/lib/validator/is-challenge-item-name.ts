import { t } from 'elysia';

export const isChallengeItemName = t.String({
  minLength: 1,
  maxLength: 16,
});
