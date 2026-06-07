import { contextBridge, ipcRenderer } from 'electron';

export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

const spectre = {
  identity: {
    createProfile: (data: unknown) => ipcRenderer.invoke('identity:createProfile', data),
    listProfiles: () => ipcRenderer.invoke('identity:listProfiles'),
    login: (data: unknown) => ipcRenderer.invoke('identity:login', data),
    logout: () => ipcRenderer.invoke('identity:logout'),
    session: () => ipcRenderer.invoke('identity:session'),
  },
  onboarding: {
    getState: () => ipcRenderer.invoke('onboarding:getState'),
    updateStep: (data: unknown) => ipcRenderer.invoke('onboarding:updateStep', data),
    complete: () => ipcRenderer.invoke('onboarding:complete'),
    abort: () => ipcRenderer.invoke('onboarding:abort'),
  },
  accounts: {
    list: () => ipcRenderer.invoke('accounts:list'),
    create: (data: unknown) => ipcRenderer.invoke('accounts:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('accounts:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('accounts:delete', id),
  },
  portfolioTemplates: {
    list: () => ipcRenderer.invoke('portfolioTemplates:list'),
    findById: (id: string) => ipcRenderer.invoke('portfolioTemplates:findById', id),
    create: (data: unknown) => ipcRenderer.invoke('portfolioTemplates:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('portfolioTemplates:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('portfolioTemplates:delete', id),
  },
  investmentPortfolio: {
    createFromTemplate: (templateId: string) => ipcRenderer.invoke('investmentPortfolio:createFromTemplate', templateId),
    list: () => ipcRenderer.invoke('investmentPortfolio:list'),
    findById: (id: string) => ipcRenderer.invoke('investmentPortfolio:findById', id),
    updateAssetValues: (portfolioId: string, values: unknown) => ipcRenderer.invoke('investmentPortfolio:updateAssetValues', portfolioId, values),
    delete: (id: string) => ipcRenderer.invoke('investmentPortfolio:delete', id),
    getDashboardSummary: () => ipcRenderer.invoke('investmentPortfolio:getDashboardSummary'),
  },
  ledgerEvents: {
    record: (data: unknown) => ipcRenderer.invoke('ledgerEvents:record', data),
    listByPortfolio: (portfolioId: string) => ipcRenderer.invoke('ledgerEvents:listByPortfolio', portfolioId),
    getRecentEvents: (limit?: number) => ipcRenderer.invoke('ledgerEvents:getRecentEvents', limit),
    delete: (id: string) => ipcRenderer.invoke('ledgerEvents:delete', id),
  },
  analytics: {
    recordSnapshot: (portfolioId: string) => ipcRenderer.invoke('analytics:recordSnapshot', portfolioId),
    getAllocationHistory: (portfolioId: string) => ipcRenderer.invoke('analytics:getAllocationHistory', portfolioId),
    getContributionHistory: (portfolioId: string) => ipcRenderer.invoke('analytics:getContributionHistory', portfolioId),
    getMonthlyReport: (portfolioId: string, year: number, month: number) => ipcRenderer.invoke('analytics:getMonthlyReport', portfolioId, year, month),
    getPerformanceSummary: (portfolioId: string) => ipcRenderer.invoke('analytics:getPerformanceSummary', portfolioId),
  },
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>> {
    return ipcRenderer.invoke(channel, payload) as Promise<IpcResult<T>>;
  },
};

contextBridge.exposeInMainWorld('spectre', spectre);
