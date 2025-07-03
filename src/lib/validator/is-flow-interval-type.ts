import { t } from 'elysia';

export const isFlowIntervalType = t.Union([
  t.Literal('DAILY'),
  t.Literal('WEEKLY'),
  t.Literal('MONTHLY'),
  t.Literal('YEARLY'),
]);
