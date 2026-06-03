export type ContributionPlan = {
  id: string;
  portfolioId: string;
  amount: number;
  currency: string;
  plannedDate: Date;
  status: string;
};

export type ContributionSuggestion = {
  id: string;
  planId: string;
  assetId: string;
  suggestedAmount: number;
  rationale: string;
};
