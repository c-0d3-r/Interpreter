export function isBoolean(value: unknown): value is boolean {
  if (typeof value !== 'boolean') return false;

  return true;
}
