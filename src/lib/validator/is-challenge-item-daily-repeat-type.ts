import { t } from 'elysia';

export const isChallengeItemDailyRepeatType = t.Union([
  t.Literal('EVERY'),
  t.Literal('N'),
  t.Literal('NM'),
  t.Literal('ANY_N'),
]);
