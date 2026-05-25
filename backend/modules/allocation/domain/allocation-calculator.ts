import { deviation, needsRebalance, percentOf, round2 } from '../../../shared/kernel/percentage.js';

export interface CategoryTarget {
  category: string;
  targetPercent: number;
  value: number;
}

export interface AssetTarget {
  assetId: string;
  symbol: string;
  category: string;
  targetPercent: number;
  value: number;
}

export interface AllocationDeviation {
  category: string;
  targetPercent: number;
  realPercent: number;
  deviation: number;
  needsRebalance: boolean;
}

export interface AssetDeviation {
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
      targetPercent: t.targetPercent,
      realPercent: real,
      deviation: dev,
      needsRebalance: needsRebalance(dev, threshold),
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
      symbol: t.symbol,
      targetPercent: t.targetPercent,
      realPercent: real,
      deviation: dev,
      message: `${t.symbol} está ${sign}${round2(dev)}% em relação à alocação ideal na categoria`,
      needsRebalance: needsRebalance(dev, threshold),
    };
  });
}
