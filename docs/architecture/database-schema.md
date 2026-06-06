# Database Schema

## User Database (per profile)

### UserProfile
- `id`, `displayName`, `onboardingStatus` (enum), `createdAt`, `updatedAt`

### Account
- `id`, `institutionName`, `nickname`, `currency`, `userProfileId`

### PortfolioTemplate
- `id`, `name`, `benchmark`, `userProfileId`

### PortfolioAssetTarget
- `id`, `type` (enum: 17 asset classes), `assetName`, `allocationPercentage`, `tickerDescription`, `minimumInvestment`, `fractionalAllowed`, `lotSize`, `templateId`

### InvestmentPortfolio
- `id`, `name`, `userProfileId`, `templateId`

### LedgerEvent
- `id`, `eventType` (enum: 7 types), `grossAmount`, `feesAmount`, `taxAmount`, `netAmount`, `currency`, `occurredAt`, `notes`, `portfolioId`, `accountId`, `assetTargetId`

## Benchmark Database (shared)

### BenchmarkSeries
- `id`, `symbol`, `source`, `benchmarkType`

### BenchmarkDataPoint
- `id`, `date`, `value`

### SyncJob
- `id`, `lastSyncAt`, `status`, `error`
