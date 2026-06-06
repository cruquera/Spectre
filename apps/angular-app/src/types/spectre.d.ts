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

export interface SpectreApi {
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>>;
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
