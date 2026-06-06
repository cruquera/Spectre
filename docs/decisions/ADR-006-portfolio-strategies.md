# ADR-006: Portfolio Strategies

## Status

Accepted

## Context

Users have different needs for structuring their portfolio. Some want simple flat allocation, others want hierarchical class-based allocation.

## Decision

Introduce PortfolioStrategy enum (FREE_ALLOCATION, ASSET_CLASS_ALLOCATION) on PortfolioTemplate. The strategy determines how targets are interpreted and normalized for rebalancing.

## Consequences

- New onboarding step for strategy selection
- Single rebalance engine consumes normalized form
- ASSET_CLASS_ALLOCATION UI deferred to later sprint
