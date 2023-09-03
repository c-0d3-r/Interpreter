export function isVariableName(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value);
}
