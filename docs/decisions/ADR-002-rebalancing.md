# ADR-002: Contribution-Only Rebalancing

## Status

Accepted

## Context

Many rebalancing tools suggest selling assets, which triggers tax events and goes against buy-and-hold strategies.

## Decision

The Smart Contribution Rebalancer ONLY uses new money to correct allocation deviations. Never suggests selling.

## Consequences

- No tax events triggered by suggestions
- Aligned with long-term investment strategy
- May take longer to reach target allocation
- Requires minimum investment validation per asset
