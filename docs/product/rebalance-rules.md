# Smart Contribution Rebalancer

## Algorithm

1. Calculate current portfolio distribution (by class, then by ticker)
2. Compare with target allocation from template
3. Identify underallocated and overallocated assets
4. Check executability for each asset:
   - `minimumInvestment` — minimum required
   - `fractionalAllowed` — can buy fractions
   - `lotSize` — minimum lot size
5. Skip assets where contribution is insufficient
6. Redistribute contribution among executable underallocated assets

## Executability

| Asset Class | minimumInvestment | fractionalAllowed | lotSize |
|------------|-------------------|-------------------|---------|
| crypto | 10 | true | 0 |
| stock_picking_b3 | 0 | true | 1 |
| investment_funds | 500 | false | 0 |

## UX Requirements

Every suggestion must include explanation:

- Why each asset was suggested ("underallocated by X%")
- Why an asset was NOT suggested ("minimum investment of R$ 1,200 required")

## Example

**Portfolio:** BTC 20%, ETF 40%, KLBN11 40%
**Current:** BTC 10%, ETF 60%, KLBN11 30%
**Contribution:** R$ 700
**KLBN11 minimum:** R$ 1,200

**Result:**
- BTC → R$ 450 (underallocated 10%, executable)
- ETF → R$ 250 (underallocated -20%, executable)
- KLBN11 → R$ 0 (minimum R$ 1,200 > R$ 700)
