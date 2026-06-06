# Ledger Domain

## Purpose

Event-based tracking of all portfolio movements. Every operation is an immutable event.

## Event Types

- `INVESTMENT_CONTRIBUTION` — money added
- `ASSET_PURCHASE` — asset bought
- `ASSET_SALE` — asset sold
- `DIVIDEND_INCOME` — dividends received
- `INTEREST_INCOME` — interest received
- `CRYPTO_STAKING` — staking rewards
- `MANUAL_ADJUSTMENT` — manual corrections

## Fields

- `id`, `portfolioId`, `accountId`, `assetId`, `eventType`, `grossAmount`, `feesAmount`, `taxAmount`, `netAmount`, `currency`, `occurredAt`, `notes`

## Architecture

Event sourcing: no snapshot-only approach. Each event is recorded with full metadata (fees, taxes, notes).

## Future-ready (not implemented yet)

- DARF generation
- Automatic tax calculation
- IR reporting
- Come-cotas
- Stock splits
- Grouping events
