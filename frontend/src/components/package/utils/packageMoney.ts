export function parsePackagePriceValue(value: string | number | undefined | null): number {
  if (value === undefined || value === null) return Number.NaN;
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NaN;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : Number.NaN;
}

export function discountPercent(current: number, original: number | null): number | null {
  if (original === null || !Number.isFinite(original) || original <= 0) return null;
  if (!Number.isFinite(current) || current >= original) return null;
  return Math.round(((original - current) / original) * 100);
}
