# ADR-005: Contribution-Only Rebalancing with Executability Check

## Status

Accepted

## Context

Simple rebalancing ignores real-world constraints like minimum investments and lot sizes.

## Decision

The rebalancer checks executability before suggesting. Assets below minimum investment are skipped. Fractional and lot size rules are respected.

## Consequences

- Realistic suggestions
- Prevent user frustration with unexecutable recommendations
- More complex algorithm
- Requires metadata per asset class
