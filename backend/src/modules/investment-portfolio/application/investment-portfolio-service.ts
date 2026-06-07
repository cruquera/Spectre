import type { InvestmentPortfolioRepository } from './investment-portfolio-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { LedgerEventRepository } from '../../ledger-event/application/ledger-event-repository.js';
import type { PortfolioTemplateRepository } from '../../portfolio-template/application/portfolio-template-repository.js';
import type { DashboardSummary, InvestmentPortfolio } from '../domain/investment-portfolio.js';

export class InvestmentPortfolioService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: InvestmentPortfolioRepository,
    private readonly templateRepo: PortfolioTemplateRepository,
    private readonly ledgerRepo: LedgerEventRepository,
  ) {}

  public async createFromTemplate(templateId: string): Promise<Result<InvestmentPortfolio, AppError>> {
    try {
      this.ctx.requireSession();
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));

      const template = await this.templateRepo.findById(templateId);

      if (!template) return err(new AppError('TEMPLATE_NOT_FOUND', 'Portfolio template not found'));

      const portfolio = await this.repo.create({
        name: template.name,
        userProfileId: profile.id,
        templateId: template.id,
        assetValues: template.targets.map((t) => ({
          assetClass: t.assetClass,
          optionalTickerDescription: t.optionalTickerDescription,
          targetPercentage: t.allocationPercentage,
          classTargetId: null,
        })),
      });

      return ok(portfolio);
    } catch (e) {
      return err(new AppError('CREATE_PORTFOLIO_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async list(): Promise<Result<InvestmentPortfolio[], never>> {
    const session = this.ctx.getSession();

    if (!session) return ok([]);

    return ok(await this.repo.findAll());
  }

  public async findById(id: string): Promise<Result<InvestmentPortfolio | null, AppError>> {
    try {
      return ok(await this.repo.findById(id));
    } catch (e) {
      return err(new AppError('FIND_PORTFOLIO_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async updateAssetValues(
    portfolioId: string,
    values: Array<{ id: string; currentValue: number }>,
  ): Promise<Result<void, AppError>> {
    try {
      await this.repo.updateAssetValues(portfolioId, values);

      return ok(undefined);
    } catch (e) {
      return err(new AppError('UPDATE_ASSET_VALUES_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async delete(id: string): Promise<Result<void, AppError>> {
    try {
      await this.repo.delete(id);

      return ok(undefined);
    } catch (e) {
      return err(new AppError('DELETE_PORTFOLIO_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async getDashboardSummary(): Promise<Result<DashboardSummary, AppError>> {
    try {
      this.ctx.requireSession();
      const portfolios = await this.repo.findAll();

      const recentEvents = await this.ledgerRepo.findRecent(5);

      const totalInvested = portfolios.reduce((sum, p) => {
        return sum + p.assetValues.reduce((s, av) => s + av.currentValue, 0);
      }, 0);

      const deviations: DashboardSummary['deviations'] = [];

      for (const portfolio of portfolios) {
        const totalValue = portfolio.assetValues.reduce((s, av) => s + av.currentValue, 0);

        if (totalValue === 0) continue;

        for (const av of portfolio.assetValues) {
          const realPercent = (av.currentValue / totalValue) * 100;
          const dev = realPercent - av.targetPercentage;
          const threshold = 5;

          deviations.push({
            portfolioId: portfolio.id,
            portfolioName: portfolio.name,
            assetClass: av.assetClass,
            targetPercent: av.targetPercentage,
            realPercent: Math.round(realPercent * 100) / 100,
            deviation: Math.round(dev * 100) / 100,
            needsRebalance: Math.abs(dev) > threshold,
          });
        }
      }

      return ok({
        portfolioCount: portfolios.length,
        totalInvested: Math.round(totalInvested * 100) / 100,
        totalAccounts: 0,
        recentEvents: recentEvents.length,
        deviations,
      });
    } catch (e) {
      return err(new AppError('DASHBOARD_SUMMARY_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }
}
