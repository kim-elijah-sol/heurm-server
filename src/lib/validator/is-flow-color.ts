import { t } from 'elysia';

const colors = [
  'red',
  'yellow',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'pink',
] as const;

export const isFlowColor = t.Union(colors.map((color) => t.Literal(color)));
