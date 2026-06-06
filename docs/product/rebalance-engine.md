# Smart Contribution Rebalancer

## Objective

Suggest where to invest new contributions to bring the portfolio closer to its target allocation.

## Rules

- **Only contribution-based rebalancing** — never suggest selling
- **Never reduce positions**
- **Never market timing**
- **Only invest in assets that are part of the portfolio**

## Algorithm

1. Calculate current portfolio distribution
2. Compare with target allocation from template
3. Identify underallocated and overallocated assets
4. Check executability for each asset:
   - `minimumInvestment` — minimum required
   - `fractionalAllowed` — can buy fractions
   - `lotSize` — minimum lot size
5. Redistribute contribution among executable underallocated assets

## Example

Contribution: R$ 2,000

| Asset | Target | Current | Deviation | Executable | Suggested |
|-------|--------|---------|-----------|------------|-----------|
| Bitcoin | 20% | 15% | -5% | Yes (min R$10) | R$ 700 |
| ETF Intl | 40% | 35% | -5% | Yes | R$ 800 |
| Gold | 10% | 8% | -2% | Yes | R$ 500 |
| KLBN11 | 10% | 10% | 0% | No (min R$1,200) | - |

## UX Requirement

Every suggestion must include explanation:
- Why each asset was suggested
- Why an asset was NOT suggested (e.g., "insufficient contribution")
