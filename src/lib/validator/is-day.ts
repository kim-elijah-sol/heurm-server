import { t } from 'elysia';

export const isDay = t.String({
  format: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
});
