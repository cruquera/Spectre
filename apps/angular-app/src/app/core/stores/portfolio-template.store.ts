import { Injectable, computed, signal } from '@angular/core';

export type AssetTarget = {
  assetClass: string;
  optionalTickerDescription: string;
  allocationPercentage: number;
  subTargets?: AssetTarget[];
};

export type TemplateMeta = {
  name: string;
  description: string;
  strategy: string;
  baseCurrency: string;
};

@Injectable({ providedIn: 'root' })
export class PortfolioTemplateStore {
  public readonly targets = signal<AssetTarget[]>([]);

  public readonly meta = signal<TemplateMeta>({
    name: '',
    description: '',
    strategy: '',
    baseCurrency: 'BRL',
  });

  public readonly totalPercentage = computed(() =>
    this.targets().reduce((sum, t) => sum + t.allocationPercentage, 0),
  );

  public readonly percentageError = computed<string | null>(() => {
    const targets = this.targets();

    if (targets.length === 0) {
      return null;
    }

    const total = targets.reduce((sum, t) => sum + t.allocationPercentage, 0);

    if (total < 100) {
      return `faltam ${(100 - total).toFixed(2)}%`;
    }

    if (total > 100) {
      return `excedeu ${(total - 100).toFixed(2)}%`;
    }

    return null;
  });

  public readonly canFinish = computed<boolean>(() => {
    const targets = this.targets();

    if (targets.length === 0) {
      return false;
    }

    const total = targets.reduce((sum, t) => sum + t.allocationPercentage, 0);

    if (Math.abs(total - 100) > 0.01) {
      return false;
    }

    for (const target of targets) {
      if (target.subTargets && target.subTargets.length > 0) {
        const subTotal = target.subTargets.reduce((s, st) => s + st.allocationPercentage, 0);

        if (Math.abs(subTotal - 100) > 0.01) {
          return false;
        }

        for (const sub of target.subTargets) {
          if (!sub.optionalTickerDescription || sub.optionalTickerDescription.trim() === '') {
            return false;
          }
        }
      }
    }

    return true;
  });

  public addTarget(target: AssetTarget): void {
    this.targets.update((list) => [...list, target]);
  }

  public removeTarget(index: number): void {
    this.targets.update((list) => list.filter((_, i) => i !== index));
  }

  public updateTargetPercentage(index: number, percentage: number): void {
    this.targets.update((list) =>
      list.map((t, i) => (i === index ? { ...t, allocationPercentage: percentage } : t)),
    );
  }

  public addSubTarget(parentIndex: number, sub: AssetTarget): void {
    this.targets.update((list) =>
      list.map((t, i) =>
        i === parentIndex
          ? { ...t, subTargets: [...(t.subTargets ?? []), sub] }
          : t,
      ),
    );
  }

  public removeSubTarget(parentIndex: number, childIndex: number): void {
    this.targets.update((list) =>
      list.map((t, i) =>
        i === parentIndex
          ? {
            ...t,
            subTargets: (t.subTargets ?? []).filter((_, ci) => ci !== childIndex),
          }
          : t,
      ),
    );
  }

  public flattenTargets(): Array<{
    assetClass: string;
    ticker?: string;
    allocationPercentage: number;
    classTargetId?: string;
  }> {
    const result: Array<{
      assetClass: string;
      ticker?: string;
      allocationPercentage: number;
      classTargetId?: string;
    }> = [];

    for (const target of this.targets()) {
      if (target.subTargets && target.subTargets.length > 0) {
        const parentId = crypto.randomUUID();
        const parentPct = target.allocationPercentage;

        for (const sub of target.subTargets) {
          result.push({
            assetClass: sub.assetClass,
            ticker: sub.optionalTickerDescription || undefined,
            allocationPercentage: sub.allocationPercentage * parentPct / 100,
            classTargetId: parentId,
          });
        }
      } else {
        result.push({
          assetClass: target.assetClass,
          ticker: target.optionalTickerDescription || undefined,
          allocationPercentage: target.allocationPercentage,
        });
      }
    }

    return result;
  }

  public reset(): void {
    this.targets.set([]);
    this.meta.set({
      name: '',
      description: '',
      strategy: '',
      baseCurrency: 'BRL',
    });
  }
}
