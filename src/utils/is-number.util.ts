export function isNumber(value: unknown): value is number {
  if (typeof value !== 'number') return false;

  if (Number.isNaN(value)) return false;

  return true;
}
