import type { PortfolioTemplateRepository } from './portfolio-template-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { PortfolioTemplate } from '../domain/portfolio-template.js';

export class PortfolioTemplateService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: PortfolioTemplateRepository,
  ) {}

  public async list(): Promise<Result<PortfolioTemplate[], never>> {
    const session = this.ctx.getSession();

    if (!session) return ok([]);

    return ok(await this.repo.findAll());
  }

  public async findById(id: string): Promise<Result<PortfolioTemplate | null, AppError>> {
    try {
      return ok(await this.repo.findById(id));
    } catch (e) {
      return err(new AppError('FIND_TEMPLATE_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async create(
    name: string,
    targets: Array<{
      assetClass: string;
      optionalTickerDescription?: string | null;
      allocationPercentage: number;
      classTargetId?: string | null;
      minimumInvestment?: number;
      fractionalAllowed?: boolean;
      lotSize?: number;
    }>,
    benchmark?: string | null,
    strategy?: string,
    description?: string | null,
    baseCurrency?: string,
    isDefault?: boolean,
  ): Promise<Result<PortfolioTemplate, AppError>> {
    try {
      this.ctx.requireSession();
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));

      const template = await this.repo.create({
        name,
        description: description ?? null,
        strategy: strategy ?? 'FREE_ALLOCATION',
        benchmark,
        baseCurrency: baseCurrency ?? 'BRL',
        isDefault: isDefault ?? false,
        userProfileId: profile.id,
        targets: targets.map((a) => ({
          assetClass: a.assetClass,
          optionalTickerDescription: a.optionalTickerDescription ?? null,
          allocationPercentage: a.allocationPercentage,
          classTargetId: a.classTargetId ?? null,
          minimumInvestment: a.minimumInvestment ?? 0,
          fractionalAllowed: a.fractionalAllowed ?? true,
          lotSize: a.lotSize ?? 1,
        })),
      });

      return ok(template);
    } catch (e) {
      return err(new AppError('CREATE_TEMPLATE_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async update(
    id: string,
    data: {
      name?: string;
      description?: string | null;
      strategy?: string;
      benchmark?: string | null;
      baseCurrency?: string;
      isDefault?: boolean;
      targets?: Array<{
        id?: string;
        assetClass: string;
        optionalTickerDescription?: string | null;
        allocationPercentage: number;
        classTargetId?: string | null;
        minimumInvestment?: number;
        fractionalAllowed?: boolean;
        lotSize?: number;
      }>;
    },
  ): Promise<Result<PortfolioTemplate, AppError>> {
    try {
      return ok(await this.repo.update(id, data));
    } catch (e) {
      return err(new AppError('UPDATE_TEMPLATE_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  public async delete(id: string): Promise<Result<void, AppError>> {
    try {
      await this.repo.delete(id);

      return ok(undefined);
    } catch (e) {
      return err(new AppError('DELETE_TEMPLATE_FAILED', e instanceof Error ? e.message : 'Unknown error'));
    }
  }
}
