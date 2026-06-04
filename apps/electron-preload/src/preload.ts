import { contextBridge, ipcRenderer } from 'electron';

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

const spectre = {
  accounts: {
    create: (data: unknown) => ipcRenderer.invoke('accounts:create', data),
    list: (institutionId?: string) => ipcRenderer.invoke('accounts:list', institutionId),
  },
  allocation: {
    analyze: (portfolioId: string, threshold?: number) =>
      ipcRenderer.invoke('allocation:analyze', portfolioId, threshold),
    setAsset: (data: unknown) => ipcRenderer.invoke('allocation:setAsset', data),
    setCategory: (data: unknown) => ipcRenderer.invoke('allocation:setCategory', data),
  },
  analyticsApi: {
    portfolioEvolution: (portfolioId: string) =>
      ipcRenderer.invoke('analytics:portfolioEvolution', portfolioId),
  },
  assets: {
    create: (data: unknown) => ipcRenderer.invoke('assets:create', data),
    list: (category?: string) => ipcRenderer.invoke('assets:list', category),
  },
  benchmark: {
    listCached: (data: unknown) => ipcRenderer.invoke('benchmark:listCached', data),
    sync: (data: unknown) => ipcRenderer.invoke('benchmark:sync', data),
  },
  brokerageNotes: {
    list: () => ipcRenderer.invoke('brokerageNotes:list'),
    register: (data: unknown) => ipcRenderer.invoke('brokerageNotes:register', data),
  },
  contribution: {
    createBlock: (data: unknown) => ipcRenderer.invoke('contribution:createBlock', data),
    setMonthlyBlock: (data: unknown) => ipcRenderer.invoke('contribution:setMonthlyBlock', data),
    simulate: (data: unknown) => ipcRenderer.invoke('contribution:simulate', data),
  },
  documents: {
    list: () => ipcRenderer.invoke('documents:list'),
    register: (data: unknown) => ipcRenderer.invoke('documents:register', data),
  },
  healthcheck: () =>
    ipcRenderer.invoke('system:healthcheck') as Promise<IpcResult<{ status: string; version: string; timestamp: string }>>,
  identity: {
    createProfile: (data: unknown) => ipcRenderer.invoke('identity:createProfile', data),
    listProfiles: () => ipcRenderer.invoke('identity:listProfiles'),
    login: (data: unknown) => ipcRenderer.invoke('identity:login', data),
    logout: () => ipcRenderer.invoke('identity:logout'),
  },
  import: {
    operationsCsv: (data: unknown) => ipcRenderer.invoke('import:operationsCsv', data),
    quotesCsv: (data: unknown) => ipcRenderer.invoke('import:quotesCsv', data),
    syncFx: (from: string, to: string, ticker: string) =>
      ipcRenderer.invoke('import:syncFx', from, to, ticker),
  },
  initBenchmarkDb: () => ipcRenderer.invoke('system:initBenchmarkDb'),
  institutions: {
    create: (data: unknown) => ipcRenderer.invoke('institutions:create', data),
    list: () => ipcRenderer.invoke('institutions:list'),
  },
  investmentBlocks: {
    create: (data: unknown) => ipcRenderer.invoke('investmentBlocks:create', data),
    getById: (id: string) => ipcRenderer.invoke('investmentBlocks:getById', id),
    getSchedule: (year: number) => ipcRenderer.invoke('investmentBlocks:getSchedule', year),
    list: () => ipcRenderer.invoke('investmentBlocks:list'),
    remove: (data: unknown) => ipcRenderer.invoke('investmentBlocks:remove', data),
    setMonthlyBlock: (data: unknown) => ipcRenderer.invoke('investmentBlocks:setMonthlyBlock', data),
    update: (data: unknown) => ipcRenderer.invoke('investmentBlocks:update', data),
  },
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>> {
    return ipcRenderer.invoke(channel, payload) as Promise<IpcResult<T>>;
  },
  marketData: {
    createQuote: (data: unknown) => ipcRenderer.invoke('marketData:createQuote', data),
    syncBenchmark: (assetId: string, ticker: string) =>
      ipcRenderer.invoke('marketData:syncBenchmark', assetId, ticker),
  },
  patrimony: {
    capture: (data: unknown) => ipcRenderer.invoke('patrimony:capture', data),
    list: (portfolioId: string) => ipcRenderer.invoke('patrimony:list', portfolioId),
  },
  portfolio: {
    create: (data: unknown) => ipcRenderer.invoke('portfolio:create', data),
    createTransaction: (data: unknown) => ipcRenderer.invoke('portfolio:createTransaction', data),
    list: () => ipcRenderer.invoke('portfolio:list'),
    listPositions: (accountId?: string) => ipcRenderer.invoke('portfolio:listPositions', accountId),
  },
  rebalancing: {
    analyze: (portfolioId: string, threshold?: number) =>
      ipcRenderer.invoke('rebalancing:analyze', portfolioId, threshold),
  },
  tax: {
    preview: (data: unknown) => ipcRenderer.invoke('tax:preview', data),
  },
  valuation: {
    getPortfolioValue: (portfolioId: string) =>
      ipcRenderer.invoke('valuation:getPortfolioValue', portfolioId),
  },
};

contextBridge.exposeInMainWorld('spectre', spectre);
