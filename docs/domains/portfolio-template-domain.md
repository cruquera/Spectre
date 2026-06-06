# Portfolio Template Domain

## Purpose

Represents the user's target allocation (the "dream portfolio"). No real assets, only target composition.

## Models

### PortfolioTemplate
- `id`, `name`, `description` (nullable), `strategy` (FREE_ALLOCATION | ASSET_CLASS_ALLOCATION), `benchmark` (nullable BenchmarkType), `baseCurrency` (default BRL), `isDefault` (boolean), `userProfileId`, `createdAt`, `updatedAt`

### PortfolioAssetTarget
- `id`, `assetClass` (AssetClass enum), `optionalTickerDescription` (nullable), `allocationPercentage`, `classTargetId` (nullable self-relation for hierarchical targets), `minimumInvestment`, `fractionalAllowed`, `lotSize`, `templateId`

## Asset Classes (20)

1. Caixa e Reserva
2. Renda Fixa Pós-Fixada
3. Renda Fixa Prefixada
4. Renda Fixa IPCA+
5. Debêntures
6. Fundos de Investimento
7. Fundos Previdenciários
8. Fundos Imobiliários (FII)
9. ETF Brasil
10. ETF Internacional
11. Stock Picking B3 (IBOVESPA)
12. Stock Picking NASDAQ
13. Stock Picking NYSE
14. Stock Picking Europa
15. Stock Picking Ásia
16. REITs
17. Commodities
18. Ouro e Metais Preciosos
19. Criptomoedas
20. Ativos Alternativos

## Strategies

### FREE_ALLOCATION
- Each target is a direct allocation (sum = 100%)
- Ticker is required for each target
- Example: 30% Bitcoin, 70% ETF Brasil

### ASSET_CLASS_ALLOCATION
- Targets group by asset class, each group can have sub-targets
- Parent allocation = % of portfolio; child allocation = % within parent
- Effective % = (parent% / 100) * child%
- Ticker is hidden; "Copiar" button fills ticker from class label

## Validation

- Sum of all `allocationPercentage` must equal exactly 100% (tolerance ±0.01%)
- For ASSET_CLASS_ALLOCATION: each parent's sub-targets must also sum to 100%
- `classTargetId` links children to parent in the flat persistence model
