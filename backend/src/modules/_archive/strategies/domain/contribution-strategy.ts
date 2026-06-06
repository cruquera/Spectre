export type StrategyContext = {
  totalAmount: number;
  currency: string;
  deviations: Array<{ assetId: string; symbol: string; deviation: number; needsRebalance: boolean }>;
  blockAssetIds: string[];
  thresholdPercent: number;
  minLot: number;
  brokerageCost: number;
}

export type StrategySuggestion = {
  assetId: string;
  symbol: string;
  suggestedAmount: number;
  rationale: string;
}

export type ContributionStrategy = {
  readonly key: string;
  evaluate(context: StrategyContext): StrategySuggestion[];
}
