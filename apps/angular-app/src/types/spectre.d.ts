export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export interface AssetDto {
  id: string;
  type: string;
  targetPercentage: number;
  initialValue: number;
  name: string | null;
  portfolioProjectId: string;
}

export interface PortfolioProjectDto {
  id: string;
  name: string;
  assets: AssetDto[];
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
  tour: {
    getState(): Promise<IpcResult<{ completed: boolean; currentStep: number }>>;
    updateStep(data: { step: number }): Promise<IpcResult<{ completed: boolean; currentStep: number }>>;
    complete(): Promise<IpcResult<{ completed: boolean; currentStep: number }>>;
    abort(): Promise<IpcResult<void>>;
  };
  accounts: {
    list(): Promise<IpcResult<Array<{ id: string; institutionName: string; nickname: string; currency: string }>>>;
    create(data: { institutionName: string; nickname: string; currency: string }): Promise<IpcResult<{ id: string; institutionName: string; nickname: string; currency: string }>>;
    update(id: string, data: Partial<{ institutionName: string; nickname: string; currency: string }>): Promise<IpcResult<{ id: string; institutionName: string; nickname: string; currency: string }>>;
    delete(id: string): Promise<IpcResult<void>>;
  };
  portfolioProjects: {
    list(): Promise<IpcResult<PortfolioProjectDto[]>>;
    create(data: { name: string; assets: Array<{ type: string; targetPercentage: number; initialValue: number; name?: string | null }> }): Promise<IpcResult<PortfolioProjectDto>>;
    update(id: string, data: Partial<{ name: string; assets: Array<{ type: string; targetPercentage: number; initialValue: number; name?: string | null }> }>): Promise<IpcResult<PortfolioProjectDto>>;
    delete(id: string): Promise<IpcResult<void>>;
  };
}

declare global {
  interface Window {
    spectre: SpectreApi;
  }
}
