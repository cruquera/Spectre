# Contratos IPC

## Convenção de canais

Formato: `{context}:{action}`

Exemplos:

- `system:healthcheck`
- `identity:listProfiles`
- `identity:login`
- `portfolio:create`
- `allocation:calculateDeviation`

## Fluxo

1. Angular invoca `window.spectre.invoke(channel, payload)`.
2. Preload encaminha `ipcRenderer.invoke`.
3. Main valida payload com **Zod** (`data-contracts`).
4. Use case executa e retorna `Result<T, AppError>`.

## Tipos de resposta

```typescript
type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };
```

## Segurança

- `contextIsolation: true`
- `nodeIntegration: false` no renderer
- Payloads serializáveis apenas (JSON-safe)

## Contratos compartilhados

Schemas Zod em `data-contracts/src/` — importados pelo Main e documentados aqui quando estáveis.
