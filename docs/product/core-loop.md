# Core Product Loop

1. User defines **portfolio templates** (target allocation with 17 asset classes)
2. User creates **investment portfolios** based on templates
3. User records **ledger events** (contributions, purchases, dividends)
4. System calculates **current allocation vs target**
5. User inputs **available contribution amount**
6. Smart Contribution Rebalancer suggests **where to invest**
7. User executes and records the event
8. Loop repeats monthly

## Core Domain Levels

```
User
├── Accounts (financial institutions)
├── Portfolio Templates (target allocation)
└── Investment Portfolios (real portfolios)
      └── Ledger Events (all movements)
```
