# ADR-0006: Alocação de Ativo Dentro da Categoria

## Status

Aceito

## Contexto

Ambiguidade se % do Bitcoin é sobre portfolio total ou categoria CRYPTO.

## Decisão

- `CategoryAllocation`: % do **portfolio total** (soma = 100%)
- `AssetTargetAllocation`: % **dentro da categoria** (soma = 100% por categoria)
- % real do ativo = valor do ativo / valor total da **categoria**

## Consequências

- `AllocationCalculator` implementa essa regra
- UI exibe hierarquia categoria → ativos
