import { t } from 'elysia';

export const isChallengeItemRepeatType = t.Union([
  t.Literal('EVERY'),
  t.Literal('N'),
  t.Literal('NM'),
]);
