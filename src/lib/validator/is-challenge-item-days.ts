import { t } from 'elysia';

export const isChallengeItemDays = t.Array(t.String(), {
  maxItems: 7,
  minItems: 1,
});
