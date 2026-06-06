# ADR-001: Event Ledger Architecture

## Status

Accepted

## Context

The system needs to track all portfolio movements. Previous approach used snapshot-only (RealPortfolioAsset with single actualValue).

## Decision

Use event-ledger architecture. Every portfolio movement is an immutable event with full metadata.

## Consequences

- Full audit trail of all operations
- Support for fees, taxes, and notes per event
- Future tax calculation becomes possible
- More storage space required (vs snapshots)
- Querying current state requires aggregating events
