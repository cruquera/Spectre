import { deviation, needsRebalance, percentOf, round2 } from '../../../shared/kernel/percentage.js';

export type CategoryTarget = {
  category: string;
  targetPercent: number;
  value: number;
}

export type AssetTarget = {
  assetId: string;
  symbol: string;
  category: string;
  targetPercent: number;
  value: number;
}

export type AllocationDeviation = {
  category: string;
  targetPercent: number;
  realPercent: number;
  deviation: number;
  needsRebalance: boolean;
}

export type AssetDeviation = {
  assetId: string;
  symbol: string;
  targetPercent: number;
  realPercent: number;
  deviation: number;
  message: string;
  needsRebalance: boolean;
}

export function calculateCategoryDeviations(
  targets: CategoryTarget[],
  threshold: number,
): AllocationDeviation[] {
  const total = targets.reduce((s, t) => s + t.value, 0);

  return targets.map((t) => {
    const real = percentOf(t.value, total);
    const dev = deviation(real, t.targetPercent);

    return {
  category: t.category,
  deviation: dev,
  needsRebalance: needsRebalance(dev, threshold),
  realPercent: real,
  targetPercent: t.targetPercent
};
  });
}

export function calculateAssetDeviations(
  targets: AssetTarget[],
  categoryValues: Record<string, number>,
  threshold: number,
): AssetDeviation[] {
  return targets.map((t) => {
    const catTotal = categoryValues[t.category] ?? 0;
    const real = percentOf(t.value, catTotal);
    const dev = deviation(real, t.targetPercent);
    const sign = dev >= 0 ? '+' : '';

    return {
  assetId: t.assetId,
  deviation: dev,
  message: `${t.symbol} est?? ${sign}${round2(dev)}% em rela????o ?? aloca????o ideal na categoria`,
  needsRebalance: needsRebalance(dev, threshold),
  realPercent: real,
  symbol: t.symbol,
  targetPercent: t.targetPercent
};
  });
}
