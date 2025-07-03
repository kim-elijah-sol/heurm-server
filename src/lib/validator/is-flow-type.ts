import { t } from 'elysia';

export const isFlowType = t.Union([
  t.Literal('COMPLETE'),
  t.Literal('OVER'),
  t.Literal('UNDER'),
]);
