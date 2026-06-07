import type { LedgerEventRepository } from './ledger-event-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { CreateLedgerEventData, LedgerEvent } from '../domain/ledger-event.js';

export class LedgerEventService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: LedgerEventRepository,
  ) {}

  public async record(data: CreateLedgerEventData): Promise<Result<LedgerEvent, AppError>> {
    try {
      this.ctx.requireSession();
      const event = await this.repo.create({
        ...data,
        feesAmount: data.feesAmount ?? 0,
        taxAmount: data.taxAmount ?? 0,
        notes: data.notes ?? null,
      });

      return ok(event);
    } catch (e) {
      return err(new AppError('RECORD_EVENT_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async listByPortfolio(portfolioId: string): Promise<Result<LedgerEvent[], AppError>> {
    try {
      return ok(await this.repo.findByPortfolioId(portfolioId));
    } catch (e) {
      return err(new AppError('LIST_EVENTS_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getRecentEvents(limit = 10): Promise<Result<LedgerEvent[], AppError>> {
    try {
      return ok(await this.repo.findRecent(limit));
    } catch (e) {
      return err(new AppError('RECENT_EVENTS_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async delete(id: string): Promise<Result<void, AppError>> {
    try {
      await this.repo.delete(id);

      return ok(undefined);
    } catch (e) {
      return err(new AppError('DELETE_EVENT_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }
}
