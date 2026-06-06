import { deviation, needsRebalance, percentOf, round2 } from './percentage.js';

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
      targetPercent: t.targetPercent,
    };
  });
}

export type ContributeInput = {
  id: string;
  deviation: number;
}

export type ContributionSplit = {
  id: string;
  amount: number;
}

export function allocationForCategory(
  totalAmount: number,
  underDevs: ContributeInput[],
): ContributionSplit[] {
  const negativeDevs = underDevs.filter((d) => d.deviation < -0.01);

  if (negativeDevs.length === 0) return [];

  const totalDeviation = Math.abs(negativeDevs.reduce((s, d) => s + d.deviation, 0));

  if (totalDeviation === 0) return [];

  return negativeDevs.map((d) => ({
    id: d.id,
    amount: round2(totalAmount * (Math.abs(d.deviation) / totalDeviation)),
  }));
}

export type SuggestInput = {
  contributionAmount: number;
  deviation: number;
  targetPercent: number;
  realPercent: number;
  minimumInvestment: number;
  fractionalAllowed: boolean;
  lotSize: number;
}

export type SuggestResult = {
  amount: number;
  executable: boolean;
  skipReason?: string;
}

export function suggestAssetAllocation(input: SuggestInput): SuggestResult {
  const { contributionAmount, minimumInvestment, fractionalAllowed, lotSize } = input;

  if (input.deviation >= 0) {
    return { amount: 0, executable: false, skipReason: 'Ativo já está na alocação alvo ou acima' };
  }

  if (contributionAmount < minimumInvestment) {
    return {
      amount: 0,
      executable: false,
      skipReason: `Investimento mínimo de R$ ${minimumInvestment} não atingido`,
    };
  }

  const shares = fractionalAllowed ? 1 : Math.max(1, lotSize);
  const proposed = round2(Math.min(contributionAmount, Math.abs(input.deviation) * 100));

  const adjusted = fractionalAllowed ? proposed : Math.floor(proposed / shares) * shares;

  return {
    amount: adjusted,
    executable: adjusted >= minimumInvestment,
    skipReason: adjusted < minimumInvestment ? `Aporte mínimo de R$ ${minimumInvestment} exigido` : undefined,
  };
}

export function calculateAssetDeviations(
  targets: AssetTarget[],
  categoryValues: Record<string, number>,
  threshold: number,
): AssetDeviation[] {
  return targets.map((t) => {
    const catTotal = categoryValues[t.category] ?? 0;
    const real = catTotal === 0 ? 0 : percentOf(t.value, catTotal);
    const dev = deviation(real, t.targetPercent);
    const sign = dev >= 0 ? '+' : '';

    return {
      assetId: t.assetId,
      deviation: dev,
      message: catTotal === 0
        ? `${t.symbol} sem valuation disponivel para a categoria ${t.category}`
        : `${t.symbol} esta ${sign}${round2(dev)}% em relacao a alocacao ideal na categoria`,
      needsRebalance: needsRebalance(dev, threshold),
      realPercent: real,
      symbol: t.symbol,
      targetPercent: t.targetPercent,
    };
  });
}
