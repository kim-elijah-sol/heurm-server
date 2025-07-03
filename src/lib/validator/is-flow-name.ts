import { t } from 'elysia';

export const isFlowName = t.String({
  minLength: 1,
  maxLength: 16,
});
