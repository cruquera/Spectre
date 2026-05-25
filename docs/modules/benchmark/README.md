# Módulo: Benchmark (isolado)

## 1. Objetivo

Buscar e cachear séries de referência (CDI, Ibovespa, etc.) sem acesso a dados do usuário.

## 2. Escopo

- Adapters: Yahoo, BCB, IBGE
- Cache em `benchmark-cache.db`
- Sync manual

## 3. Regras de negócio

- Request aceita apenas ticker, período, tipo, fonte
- Sem userId, portfolioId ou saldos

## 8. Dependências

- Nenhum módulo de negócio do usuário

## 9. Testes

- `tests/unit/benchmark-isolation.test.ts`

Ver ADR-0003.
