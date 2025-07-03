import { t } from 'elysia';

export const isFlowRepeatType = t.Union([
  t.Literal('EVERY'),
  t.Literal('N'),
  t.Literal('NM'),
]);
