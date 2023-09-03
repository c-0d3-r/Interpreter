export function isString(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  if (!(value[0] === '"') || !(value.at(-1) === '"')) return false;

  return true;
}
