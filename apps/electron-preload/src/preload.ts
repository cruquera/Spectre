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
  invoke<T>(channel: string, payload?: unknown): Promise<IpcResult<T>> {
    return ipcRenderer.invoke(channel, payload) as Promise<IpcResult<T>>;
  },
};

contextBridge.exposeInMainWorld('spectre', spectre);
