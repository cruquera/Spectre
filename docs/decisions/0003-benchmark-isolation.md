# ADR-0003: Isolamento do Benchmark

## Status

Aceito

## Contexto

Privacidade exige que APIs externas não recebam patrimônio ou identificadores de conta.

## Decisão

- DB separado: `benchmark-cache.db`
- API interna aceita apenas `{ ticker, period, benchmarkType, source? }`
- Módulo `benchmark` não importa outros módulos de negócio
- MarketData usa ACL (`BenchmarkAclPort`)

## Consequências

- Testes de contrato obrigatórios
- Lint/review para imports cruzados no módulo benchmark
