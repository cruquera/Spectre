import type { Result } from '../../../shared/kernel/result.js';
import { AllocationService } from '../../allocation/application/allocation-service.js';
import type { AllocationDeviation, AssetDeviation } from '../../allocation/domain/allocation-calculator.js';

export class RebalancingService {
  public constructor(private readonly allocation: AllocationService) {}

  public async analyze(portfolioId: string, thresholdPercent: number): Promise<Result<{ assets: AssetDeviation[]; categories: AllocationDeviation[]; portfolioId: string; thresholdPercent: number }, never>> {
    return this.allocation.analyze(portfolioId, thresholdPercent);
  }
}
