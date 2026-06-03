export function deviation(real: number, target: number): number {
  return round2(real - target);
}

export function needsRebalance(dev: number, threshold: number): boolean {
  return Math.abs(dev) >= threshold;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function percentOf(part: number, total: number): number {
  if (total === 0) return 0;

  return round2((part / total) * 100);
}
