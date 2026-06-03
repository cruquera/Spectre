import { contextBridge, ipcRenderer } from 'electron';

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

const spectre = {
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>> {
    return ipcRenderer.invoke(channel, payload) as Promise<IpcResult<T>>;
  },
  healthcheck: () =>
    ipcRenderer.invoke('system:healthcheck') as Promise<IpcResult<{ status: string; version: string; timestamp: string }>>,
  initBenchmarkDb: () => ipcRenderer.invoke('system:initBenchmarkDb'),
  identity: {
  createProfile: (data: unknown) => ipcRenderer.invoke('identity:createProfile', data),
  listProfiles: () => ipcRenderer.invoke('identity:listProfiles'),
  login: (data: unknown) => ipcRenderer.invoke('identity:login', data),
  logout: () => ipcRenderer.invoke('identity:logout')
},
  institutions: {
  create: (data: unknown) => ipcRenderer.invoke('institutions:create', data),
  list: () => ipcRenderer.invoke('institutions:list')
},
  accounts: {
  create: (data: unknown) => ipcRenderer.invoke('accounts:create', data),
  list: (institutionId?: string) => ipcRenderer.invoke('accounts:list', institutionId)
},
  assets: {
  create: (data: unknown) => ipcRenderer.invoke('assets:create', data),
  list: (category?: string) => ipcRenderer.invoke('assets:list', category)
},
  portfolio: {
  create: (data: unknown) => ipcRenderer.invoke('portfolio:create', data),
  createTransaction: (data: unknown) => ipcRenderer.invoke('portfolio:createTransaction', data),
  list: () => ipcRenderer.invoke('portfolio:list'),
  listPositions: (accountId?: string) => ipcRenderer.invoke('portfolio:listPositions', accountId)
},
  allocation: {
  analyze: (portfolioId: string, threshold?: number) =>
      ipcRenderer.invoke('allocation:analyze', portfolioId, threshold),
  setAsset: (data: unknown) => ipcRenderer.invoke('allocation:setAsset', data),
  setCategory: (data: unknown) => ipcRenderer.invoke('allocation:setCategory', data)
},
  benchmark: {
  listCached: (data: unknown) => ipcRenderer.invoke('benchmark:listCached', data),
  sync: (data: unknown) => ipcRenderer.invoke('benchmark:sync', data)
},
  marketData: {
    createQuote: (data: unknown) => ipcRenderer.invoke('marketData:createQuote', data),
    syncBenchmark: (assetId: string, ticker: string) =>
      ipcRenderer.invoke('marketData:syncBenchmark', assetId, ticker),
  },
  contribution: {
  createBlock: (data: unknown) => ipcRenderer.invoke('contribution:createBlock', data),
  setMonthlyBlock: (data: unknown) => ipcRenderer.invoke('contribution:setMonthlyBlock', data),
  simulate: (data: unknown) => ipcRenderer.invoke('contribution:simulate', data)
},
  rebalancing: {
    analyze: (portfolioId: string, threshold?: number) =>
      ipcRenderer.invoke('rebalancing:analyze', portfolioId, threshold),
  },
  brokerageNotes: {
  list: () => ipcRenderer.invoke('brokerageNotes:list'),
  register: (data: unknown) => ipcRenderer.invoke('brokerageNotes:register', data)
},
  patrimony: {
    capture: (data: unknown) => ipcRenderer.invoke('patrimony:capture', data),
    list: (portfolioId: string) => ipcRenderer.invoke('patrimony:list', portfolioId),
  },
  tax: {
    preview: (data: unknown) => ipcRenderer.invoke('tax:preview', data),
  },
  import: {
  operationsCsv: (data: unknown) => ipcRenderer.invoke('import:operationsCsv', data),
  quotesCsv: (data: unknown) => ipcRenderer.invoke('import:quotesCsv', data),
  syncFx: (from: string, to: string, ticker: string) =>
      ipcRenderer.invoke('import:syncFx', from, to, ticker)
},
  documents: {
  list: () => ipcRenderer.invoke('documents:list'),
  register: (data: unknown) => ipcRenderer.invoke('documents:register', data)
},
  valuation: {
    getPortfolioValue: (portfolioId: string) =>
      ipcRenderer.invoke('valuation:getPortfolioValue', portfolioId),
  },
  analyticsApi: {
    portfolioEvolution: (portfolioId: string) =>
      ipcRenderer.invoke('analytics:portfolioEvolution', portfolioId),
  },
};

contextBridge.exposeInMainWorld('spectre', spectre);
