# Asset Taxonomy

## Principle

Fixed list of 20 asset classes. Users cannot create arbitrary classes. Selection via dropdown only.

## Classes

| # | Internal Key | Label | Examples |
|---|-------------|-------|----------|
| 1 | `cash_reserve` | Caixa e Reserva | dinheiro parado, reserva, conta remunerada |
| 2 | `fixed_income_post` | Renda Fixa Pós-Fixada | Tesouro Selic, CDB CDI, LCI/LCA pós |
| 3 | `fixed_income_pre` | Renda Fixa Prefixada | Tesouro Prefixado, CDB pré |
| 4 | `fixed_income_inflation` | Renda Fixa IPCA+ | Tesouro IPCA+, CDB IPCA |
| 5 | `debentures` | Debêntures | debêntures incentivadas e não incentivadas |
| 6 | `investment_funds` | Fundos de Investimento | multimercado, macro, quant, long biased |
| 7 | `retirement_funds` | Fundos Previdenciários | PGBL, VGBL |
| 8 | `real_estate_funds` | Fundos Imobiliários (FII) | FIIs de tijolo, papel, fundos |
| 9 | `etf_brazil` | ETF Brasil | BOVA11, IVVB11, SMAL11 |
| 10 | `etf_global` | ETF Internacional | IVVB11, ACWI, VT |
| 11 | `stock_picking_b3` | Stock Picking B3 (IBOVESPA) | PETR4, VALE3, KLBN11, ITSA4 |
| 12 | `stock_picking_nasdaq` | Stock Picking NASDAQ | Apple, Nvidia, Microsoft |
| 13 | `stock_picking_nyse` | Stock Picking NYSE | Berkshire, Coca-Cola |
| 14 | `stock_picking_europe` | Stock Picking Europa | ASML, LVMH |
| 15 | `stock_picking_asia` | Stock Picking Ásia | TSMC, Samsung |
| 16 | `reits` | REITs | O, PLD, VNQ |
| 17 | `commodities` | Commodities | petróleo, soja, milho |
| 18 | `precious_metals` | Ouro e Metais Preciosos | ouro, prata, paládio |
| 19 | `crypto` | Criptomoedas | Bitcoin, Ethereum |
| 20 | `alternative_assets` | Ativos Alternativos | arte, collectibles |

## Rebalance Order

Rebalancing happens **first by class**, then by ticker within each class if specified.

## Validation

- `assetClass` is required
- `allocationPercentage` is required (0-100)
- `optionalTickerDescription` is optional
- Sum of all `allocationPercentage` must equal 100%
