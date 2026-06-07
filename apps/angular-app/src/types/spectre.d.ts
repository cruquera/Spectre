export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export interface PortfolioAssetTargetDto {
  id: string;
  assetClass: string;
  optionalTickerDescription: string | null;
  allocationPercentage: number;
  minimumInvestment: number;
  fractionalAllowed: boolean;
  lotSize: number;
  templateId: string;
}

export interface PortfolioTemplateDto {
  id: string;
  name: string;
  description: string | null;
  strategy: string;
  benchmark: string | null;
  baseCurrency: string;
  isDefault: boolean;
  targets: PortfolioAssetTargetDto[];
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentPortfolioDto {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userProfileId: string;
  templateId: string;
  assetValues: Array<{
    id: string;
    assetClass: string;
    optionalTickerDescription: string | null;
    targetPercentage: number;
    currentValue: number;
    classTargetId: string | null;
  }>;
}

export interface LedgerEventDto {
  id: string;
  eventType: string;
  grossAmount: number;
  feesAmount: number;
  taxAmount: number;
  netAmount: number;
  currency: string;
  occurredAt: string;
  notes: string | null;
  createdAt: string;
  portfolioId: string;
  accountId: string;
  assetValueId: string;
  portfolioName?: string;
  accountName?: string;
  assetClassName?: string;
}

export interface DashboardSummaryDto {
  portfolioCount: number;
  totalInvested: number;
  totalAccounts: number;
  recentEvents: number;
  deviations: Array<{
    portfolioId: string;
    portfolioName: string;
    assetClass: string;
    targetPercent: number;
    realPercent: number;
    deviation: number;
    needsRebalance: boolean;
  }>;
}

export interface AllocationTimeSeriesDto {
  portfolioId: string;
  portfolioName: string;
  series: Array<{
    date: string;
    data: Array<{
      assetClass: string;
      label: string;
      percentage: number;
      value: number;
    }>;
  }>;
}

export interface MonthlyContributionSummaryDto {
  year: number;
  month: number;
  totalContributions: number;
  contributionsByAsset: Array<{
    assetClass: string;
    label: string;
    amount: number;
    count: number;
  }>;
}

export interface ContributionImpactDto {
  eventId: string;
  eventDate: string;
  eventType: string;
  amount: number;
  assetClass: string;
  deviationBefore: number;
  deviationAfter: number;
  reduction: number;
}

export interface PerformanceSummaryDto {
  portfolioId: string;
  portfolioName: string;
  totalInvested: number;
  currentValue: number;
  growthAmount: number;
  growthPercentage: number;
  lastSnapshotDate: string | null;
}

export interface MonthlyReportDto {
  year: number;
  month: number;
  totalContributions: number;
  performance: PerformanceSummaryDto;
  impacts: ContributionImpactDto[];
}

export interface SnapshotResultDto {
  id: string;
  snapshotDate: string;
}

export interface SpectreApi {
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>>;
  investmentPortfolio: {
    createFromTemplate(templateId: string): Promise<IpcResult<InvestmentPortfolioDto>>;
    list(): Promise<IpcResult<InvestmentPortfolioDto[]>>;
    findById(id: string): Promise<IpcResult<InvestmentPortfolioDto | null>>;
    updateAssetValues(portfolioId: string, values: Array<{ id: string; currentValue: number }>): Promise<IpcResult<void>>;
    delete(id: string): Promise<IpcResult<void>>;
    getDashboardSummary(): Promise<IpcResult<DashboardSummaryDto>>;
  };
  ledgerEvents: {
    record(data: { eventType: string; grossAmount: number; feesAmount?: number; taxAmount?: number; netAmount: number; currency: string; occurredAt: string; notes?: string | null; portfolioId: string; accountId: string; assetValueId: string }): Promise<IpcResult<LedgerEventDto>>;
    listByPortfolio(portfolioId: string): Promise<IpcResult<LedgerEventDto[]>>;
    getRecentEvents(limit?: number): Promise<IpcResult<LedgerEventDto[]>>;
    delete(id: string): Promise<IpcResult<void>>;
  };
  analytics: {
    recordSnapshot(portfolioId: string): Promise<IpcResult<SnapshotResultDto>>;
    getAllocationHistory(portfolioId: string): Promise<IpcResult<AllocationTimeSeriesDto>>;
    getContributionHistory(portfolioId: string): Promise<IpcResult<MonthlyContributionSummaryDto[]>>;
    getMonthlyReport(portfolioId: string, year: number, month: number): Promise<IpcResult<MonthlyReportDto>>;
    getPerformanceSummary(portfolioId: string): Promise<IpcResult<PerformanceSummaryDto>>;
  };
  identity: {
    listProfiles(): Promise<IpcResult<unknown[]>>;
    createProfile(data: unknown): Promise<IpcResult<unknown>>;
    login(data: unknown): Promise<IpcResult<{ displayName: string }>>;
    logout(): Promise<IpcResult<void>>;
    session(): Promise<IpcResult<{ displayName: string; username: string }>>;
  };
  onboarding: {
    getState(): Promise<IpcResult<{ status: string; currentStep: number }>>;
    updateStep(data: { step: number }): Promise<IpcResult<{ status: string; currentStep: number }>>;
    complete(): Promise<IpcResult<{ status: string; currentStep: number }>>;
    abort(): Promise<IpcResult<void>>;
  };
  accounts: {
    list(): Promise<IpcResult<Array<{ id: string; institutionName: string; nickname: string; currency: string }>>>;
    create(data: { institutionName: string; nickname: string; currency: string }): Promise<IpcResult<{ id: string; institutionName: string; nickname: string; currency: string }>>;
    update(id: string, data: Partial<{ institutionName: string; nickname: string; currency: string }>): Promise<IpcResult<{ id: string; institutionName: string; nickname: string; currency: string }>>;
    delete(id: string): Promise<IpcResult<void>>;
  };
  portfolioTemplates: {
    list(): Promise<IpcResult<PortfolioTemplateDto[]>>;
    findById(id: string): Promise<IpcResult<PortfolioTemplateDto | null>>;
    create(data: { name: string; description?: string | null; strategy?: string; baseCurrency?: string; isDefault?: boolean; benchmark?: string | null; targets: Array<{ assetClass: string; optionalTickerDescription?: string | null; allocationPercentage: number; minimumInvestment?: number; fractionalAllowed?: boolean; lotSize?: number; classTargetId?: string | null }> }): Promise<IpcResult<PortfolioTemplateDto>>;
    update(id: string, data: Partial<{ name: string; description?: string | null; strategy?: string; baseCurrency?: string; isDefault?: boolean; benchmark?: string | null; targets: Array<{ assetClass: string; optionalTickerDescription?: string | null; allocationPercentage: number; minimumInvestment?: number; fractionalAllowed?: boolean; lotSize?: number; classTargetId?: string | null }> }>): Promise<IpcResult<PortfolioTemplateDto>>;
    delete(id: string): Promise<IpcResult<void>>;
  };
}

declare global {
  interface Window {
    spectre: SpectreApi;
  }
}
