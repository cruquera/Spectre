import type { ContributionStrategy } from '../domain/contribution-strategy.js';
import { WeightedRebalanceStrategy } from '../infrastructure/weighted-rebalance-strategy.js';

export class StrategyRegistry {
  private readonly strategies = new Map<string, ContributionStrategy>();

  public constructor() {
    this.register(new WeightedRebalanceStrategy());
  }

  public register(strategy: ContributionStrategy): void {
    this.strategies.set(strategy.key, strategy);
  }

  public get(key: string): ContributionStrategy | undefined {
    return this.strategies.get(key);
  }

  public list(): string[] {
    return [...this.strategies.keys()];
  }
}
