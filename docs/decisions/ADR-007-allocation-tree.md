# ADR-007: Allocation Tree Abstraction

## Status

Accepted

## Context

Two strategies (FREE_ALLOCATION, ASSET_CLASS_ALLOCATION) produce different target structures. The rebalance engine must consume a unified format.

## Decision

Introduce a normalization layer (`normalizeAllocation`) that converts any strategy into `NormalizedAllocation[]`. The rebalance engine only sees flat effective percentages.

## Consequences

- No if/switch hell in rebalance engine
- Strategy validation is separate from rebalancing
- New strategies can be added by extending the normalizer
