import { t } from 'elysia';

export const isChallengeItemIntervalType = t.Union([
  t.Literal('DAILY'),
  t.Literal('WEEKLY'),
  t.Literal('MONTHLY'),
  t.Literal('YEARLY'),
]);
