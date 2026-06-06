# ADR-0007: Benchmark Type as String Column

## Status

Aceito

## Contexto

Portfolio templates precisam de um benchmark de referência (ex: S&P 500, CDI, IPCA) para comparação de performance. O banco de dados de usuário é SQLite via SQLCipher, e SQLite não suporta enum nativo.

## Decisão

- `BenchmarkType` é definido como **enum Prisma** mapeado para **string column** no SQLite
- 6 opções iniciais: `SP500`, `CDI`, `IPCA`, `IBOVESPA`, `NASDAQ100`, `BITCOIN`
- O campo é **nullable** no template (template pode não ter benchmark definido)
- `isDefault` (`boolean`, default `false`) marca o template padrão do usuário
- `baseCurrency` (`string`, default `'BRL'`) define a moeda base da carteira
- `description` (`string`, nullable) permite descrição livre do template

## Consequências

- Benchmark é validado via Zod enum no backend (`benchmarkSchema`)
- SQL migrations usam `ALTER TABLE ADD COLUMN benchmark TEXT`
- IPC aceita `benchmark: string | null` — a validação ocorre no handler via Zod
- Expansão futura: adicionar novo valor ao enum Prisma + BENCHMARKS array no data-contract
