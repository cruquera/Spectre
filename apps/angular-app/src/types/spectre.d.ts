export interface IpcResult<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface SpectreApi {
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>>;
  healthcheck(): Promise<IpcResult<{ status: string; version: string; timestamp: string }>>;
  initBenchmarkDb(): Promise<IpcResult<void>>;
  identity: {
    listProfiles(): Promise<IpcResult<unknown[]>>;
    createProfile(data: unknown): Promise<IpcResult<unknown>>;
    login(data: unknown): Promise<IpcResult<{ displayName: string }>>;
    logout(): Promise<IpcResult<void>>;
  };
  institutions: { list(): Promise<IpcResult<unknown[]>>; create(data: unknown): Promise<IpcResult<unknown>> };
  accounts: { list(id?: string): Promise<IpcResult<unknown[]>>; create(data: unknown): Promise<IpcResult<unknown>> };
  assets: { list(cat?: string): Promise<IpcResult<unknown[]>>; create(data: unknown): Promise<IpcResult<unknown>> };
  portfolio: {
    list(): Promise<IpcResult<unknown[]>>;
    create(data: unknown): Promise<IpcResult<unknown>>;
    createTransaction(data: unknown): Promise<IpcResult<unknown>>;
    listPositions(id?: string): Promise<IpcResult<unknown[]>>;
  };
  allocation: {
    setCategory(data: unknown): Promise<IpcResult<void>>;
    analyze(id: string, t?: number): Promise<IpcResult<unknown>>;
  };
  benchmark: { sync(data: unknown): Promise<IpcResult<unknown>>; listCached(data: unknown): Promise<IpcResult<unknown>> };
  marketData: { createQuote(data: unknown): Promise<IpcResult<unknown>> };
  contribution: { simulate(data: unknown): Promise<IpcResult<unknown[]>> };
  rebalancing: { analyze(id: string, t?: number): Promise<IpcResult<unknown>> };
  brokerageNotes: { list(): Promise<IpcResult<unknown[]>>; register(data: unknown): Promise<IpcResult<unknown>> };
  patrimony: { capture(data: unknown): Promise<IpcResult<unknown>>; list(id: string): Promise<IpcResult<unknown[]>> };
  tax: { preview(data: unknown): Promise<IpcResult<unknown>> };
  import: {
    quotesCsv(data: unknown): Promise<IpcResult<unknown>>;
    operationsCsv(data: unknown): Promise<IpcResult<unknown>>;
    syncFx(from: string, to: string, ticker: string): Promise<IpcResult<unknown>>;
  };
  documents: { list(): Promise<IpcResult<unknown[]>>; register(data: unknown): Promise<IpcResult<unknown>> };
  valuation: { getPortfolioValue(portfolioId: string): Promise<IpcResult<unknown>> };
  analyticsApi: { portfolioEvolution(portfolioId: string): Promise<IpcResult<unknown>> };
}

declare global {
  interface Window {
    spectre: SpectreApi;
  }
}
