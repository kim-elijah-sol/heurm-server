import { t } from 'elysia';

export const isFlowAccumulateType = t.Union([
  t.Literal('WEEKLY'),
  t.Literal('MONTHLY'),
  t.Literal('YEARLY'),
]);
