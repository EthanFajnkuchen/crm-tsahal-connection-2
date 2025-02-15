export function parseLimitParam(value?: string): number | undefined {
  return value ? parseInt(value, 10) : undefined;
}
