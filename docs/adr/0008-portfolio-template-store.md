# ADR-0008: Portfolio Template Store (Angular Signals)

## Status

Aceito

## Contexto

O onboarding wizard precisa de estado compartilhado entre steps 3 (builder) e 4 (summary). Targets são construídos incrementalmente e validados em tempo real. Sem store dedicada, a lógica de validação, flatten e reset ficaria espalhada no componente.

## Decisão

- `PortfolioTemplateStore` é um **service Angular Signals** (`@Injectable({ providedIn: 'root' })`)
- Gerencia:
  - `targets` — array reativo de `AssetTarget` (com `subTargets` opcionais para ASSET_CLASS_ALLOCATION)
  - `meta` — metadados do template (name, description, strategy, benchmark, baseCurrency)
  - `totalPercentage` — computed que soma `allocationPercentage` dos targets
  - `percentageError` — computed que retorna mensagem se total ≠ 100%
  - `canFinish` — computed que valida total ≈ 100% (tolerância 0.01%) e sub-targets válidos
  - `flattenTargets()` — converte estrutura hierárquica em flat com `classTargetId` UUID
- Estratégia de flatten:
  - Para ASSET_CLASS_ALLOCATION: cada grupo pai recebe um UUID via `crypto.randomUUID()`, compartilhado com seus filhos como `classTargetId`
  - Para FREE_ALLOCATION: targets passam sem `classTargetId`
- `reset()` limpa tudo (usado ao reiniciar onboarding)

## Consequências

- Store pode ser reutilizada fora do onboarding (ex: edição de template existente)
- Sem dependência externa de estado (sem NgRx)
- Próximo sprint: adicionar carregamento de template existente na store
