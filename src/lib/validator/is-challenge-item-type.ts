import { t } from 'elysia';

export const isChallengeItemType = t.Union([
  t.Literal('COMPLETE'),
  t.Literal('OVER'),
  t.Literal('UNDER'),
]);
