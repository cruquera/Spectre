import type { AppContext } from '../../../shared/app-context.js';
import { AllocationService } from '../../allocation/application/allocation-service.js';
import { ok } from '../../../shared/kernel/result.js';

export class RebalancingService {
  private readonly allocation: AllocationService;

  constructor(ctx: AppContext) {
    this.allocation = new AllocationService(ctx);
  }

  async analyze(portfolioId: string, thresholdPercent: number) {
    return this.allocation.analyze(portfolioId, thresholdPercent);
  }
}
