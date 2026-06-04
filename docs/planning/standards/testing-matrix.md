# Matriz de Testes Obrigatoria

> Todo modulo backend DEVE ter cobertura minima nos 3 niveis abaixo. A matriz e verificada no code review.

## Nivel 1 — Teste Unitario (Jest)

**Onde:** `backend/src/modules/<nome>/infrastructure/<nome>.unit.test.ts`

**O que testar:**

| Categoria | Obrigatorio | Exemplo |
|-----------|-------------|---------|
| Fluxo feliz (happy path) | Sim | `cria um bloco → retorna InvestmentBlock com id` |
| Validacao de entrada | Sim | `cria bloco com assetIds vazio → erro Zod` |
| Edge case matematico | Se houver calculo | `percentOf(0, 0) → 0` |
| Limite (threshold) | Se houver | `deviation = 4.9 com threshold 5 → needsRebalance = false` |
| Restricao de negocio | Sim | `confirmPlan com status EXECUTED → erro` |

**Padrao:** Repository mockado com objetos literais `jest.fn()` ou mocks inline.

## Nivel 2 — Teste de Integracao (Jest)

**Onde:** `tests/integration/<nome>.test.ts`

**O que testar:**

| Cenario | Obrigatorio |
|---------|-------------|
| Operacao CRUD completa | Sim |
| Transacao atomica (rollback) | Se houver `$transaction` |
| Seed de dados | Se houver |

**Padrao:** SQLite `:memory:` via Prisma.

## Nivel 3 — Teste de Componente (Karma/Jasmine)

**Onde:** `apps/angular-app/src/app/features/<nome>/<nome>.component.spec.ts`

**O que testar:**

| Cenario | Obrigatorio |
|---------|-------------|
| Renderizacao do formulario | Sim |
| Botao desabilitado com valor invalido | Sim |
| Exibicao de dados apos resposta da API | Sim |
| Estado de loading | Sim |

## Cobertura Minima

- **Unit:** 1 teste por metodo publico do service
- **Integracao:** 1 teste por cenario CRUD
- **Componente:** 3 testes (render, validacao, exibicao)
- **Lint:** Zero errors, zero warnings

## Verificacao Automatica

```bash
npm run lint        # ESLint
npm run test:unit   # Jest unitarios
npm run test:integration  # Jest integracao
npm run test:e2e    # Playwright
```
