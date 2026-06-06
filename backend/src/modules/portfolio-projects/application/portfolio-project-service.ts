import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { PortfolioProject } from '../domain/portfolio-project.js';
import type { PortfolioProjectRepository } from './portfolio-project-repository.js';

export class PortfolioProjectService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: PortfolioProjectRepository,
  ) {}

  public async list(): Promise<Result<PortfolioProject[], never>> {
    const session = this.ctx.getSession();

    if (!session) {
      return ok([]);
    }

    return ok(await this.repo.findAll());
  }

  public async create(
    name: string,
    assets: Array<{ type: string; targetPercentage: number; initialValue: number; name?: string | null }>,
  ): Promise<Result<PortfolioProject, AppError>> {
    try {
      const session = this.ctx.requireSession();
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const sum = assets.reduce((acc, a) => acc + a.targetPercentage, 0);

      if (Math.abs(sum - 100) > 0.01) {
        return err(new AppError('INVALID_PERCENTAGE_SUM', 'A soma dos percentuais deve ser exatamente 100%'));
      }

      const project = await this.repo.create({
        name,
        userProfileId: profile.id,
        assets: assets.map((a) => ({
          ...a,
          name: a.name ?? null,
        })),
      });

      return ok(project);
    } catch (e) {
      return err(
        new AppError(
          'CREATE_PROJECT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async update(
    id: string,
    data: { name?: string; assets?: Array<{ id?: string; type: string; targetPercentage: number; initialValue: number; name?: string | null }> },
  ): Promise<Result<PortfolioProject, AppError>> {
    try {
      if (data.assets) {
        const sum = data.assets.reduce((acc, a) => acc + a.targetPercentage, 0);

        if (Math.abs(sum - 100) > 0.01) {
          return err(new AppError('INVALID_PERCENTAGE_SUM', 'A soma dos percentuais deve ser exatamente 100%'));
        }
      }

      return ok(await this.repo.update(id, data));
    } catch (e) {
      return err(
        new AppError(
          'UPDATE_PROJECT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async delete(id: string): Promise<Result<void, AppError>> {
    try {
      await this.repo.delete(id);
      return ok(undefined);
    } catch (e) {
      return err(
        new AppError(
          'DELETE_PROJECT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }
}
