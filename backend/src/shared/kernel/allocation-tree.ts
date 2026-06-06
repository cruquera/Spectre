import { round2 } from './percentage.js';

export type PortfolioStrategy = 'FREE_ALLOCATION' | 'ASSET_CLASS_ALLOCATION';

export const PORTFOLIO_STRATEGIES: PortfolioStrategy[] = [
  'FREE_ALLOCATION',
  'ASSET_CLASS_ALLOCATION',
];

export const strategyLabel: Record<PortfolioStrategy, string> = {
  FREE_ALLOCATION: 'Livre (Recomendado)',
  ASSET_CLASS_ALLOCATION: 'Por Classe de Ativo',
};

export const strategyDescription: Record<PortfolioStrategy, string> = {
  FREE_ALLOCATION: 'Defina diretamente o percentual de cada investimento da carteira.',
  ASSET_CLASS_ALLOCATION: 'Defina categorias e depois distribua os ativos dentro delas.',
};

export type AllocationNode = {
  assetClass: string;
  percentage: number;
  optionalTickerDescription?: string | null;
  children?: AllocationNode[];
};

export type NormalizedAllocation = {
  assetClass: string;
  effectivePercentage: number;
  optionalTickerDescription: string | null;
};

export function normalizeAllocation<T extends AllocationNode>(
  nodes: T[],
  strategy: PortfolioStrategy,
): NormalizedAllocation[] {
  if (strategy === 'FREE_ALLOCATION') {
    return nodes.map((n) => ({
      assetClass: n.assetClass,
      effectivePercentage: n.percentage,
      optionalTickerDescription: n.optionalTickerDescription ?? null,
    }));
  }

  const result: NormalizedAllocation[] = [];

  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        result.push({
          assetClass: child.assetClass,
          effectivePercentage: round2(node.percentage * (child.percentage / 100)),
          optionalTickerDescription: child.optionalTickerDescription ?? null,
        });
      }
    } else {
      result.push({
        assetClass: node.assetClass,
        effectivePercentage: node.percentage,
        optionalTickerDescription: node.optionalTickerDescription ?? null,
      });
    }
  }

  return result;
}
