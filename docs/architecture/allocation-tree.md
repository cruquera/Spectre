# Allocation Tree

## Purpose

Normalize both FREE_ALLOCATION and ASSET_CLASS_ALLOCATION into a common flat format for the rebalance engine.

## Interface

```ts
type AllocationNode = {
  assetClass: string;
  percentage: number;
  optionalTickerDescription?: string | null;
  children?: AllocationNode[];
};

type NormalizedAllocation = {
  assetClass: string;
  effectivePercentage: number;
  optionalTickerDescription: string | null;
};

function normalizeAllocation(
  nodes: AllocationNode[],
  strategy: PortfolioStrategy,
): NormalizedAllocation[];
```

## FREE_ALLOCATION → Pass-through

Nodes are returned as-is (effectivePercentage = percentage).

## ASSET_CLASS_ALLOCATION → Flatten

Children's effectivePercentage = parentPercentage * (childPercentage / 100).

## Location

`backend/src/shared/kernel/allocation-tree.ts`
