# ADR-004: Fixed Asset Taxonomy

## Status

Accepted

## Context

Previous implementation had a mix of generic and specific asset classes, making rebalancing inconsistent.

## Decision

Use a fixed list of 20 asset classes. Users select from dropdown, never free input. Classes represent markets/exchanges/categories, not just countries.

## Consequences

- Consistent rebalancing by class
- No maintenance burden of arbitrary classes
- Clear mapping for investment rules
- Requires schema migration
