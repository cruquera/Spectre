# Electron IPC Architecture

## Security Model

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- All communication via `contextBridge`

## IPC Channels

Channels follow the pattern `{context}:{action}`:

### Identity
- `identity:listProfiles`
- `identity:createProfile`
- `identity:login`
- `identity:logout`
- `identity:session`

### Onboarding
- `onboarding:getState`
- `onboarding:updateStep`
- `onboarding:complete`
- `onboarding:abort`

### Accounts
- `accounts:list`
- `accounts:create`
- `accounts:update`
- `accounts:delete`

### Portfolio Templates
- `portfolioTemplates:list`
- `portfolioTemplates:create`
- `portfolioTemplates:update`
- `portfolioTemplates:delete`

All channels use `ipcMain.handle` / `ipcRenderer.invoke` (async request-response pattern).
