import { t } from 'elysia';

export const isChallengeItemNotDailyRepeatType = t.Union([
  t.Literal('EVERY'),
  t.Literal('N'),
  t.Literal('NM'),
]);
