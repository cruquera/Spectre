import type { AssetClass as PrismaAssetClass, PortfolioStrategy as PrismaPortfolioStrategy, PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { PortfolioTemplateRepository } from '../application/portfolio-template-repository.js';
import type { PortfolioAssetTarget, PortfolioTemplate } from '../domain/portfolio-template.js';

function toDomain(prisma: {
  id: string;
  name: string;
  description: string | null;
  strategy: string;
  benchmark: string | null;
  baseCurrency: string;
  isDefault: boolean;
  userProfileId: string;
  createdAt: Date;
  updatedAt: Date;
  targets: Array<{
    id: string;
    assetClass: string;
    optionalTickerDescription: string | null;
    allocationPercentage: number;
    classTargetId: string | null;
    minimumInvestment: number;
    fractionalAllowed: boolean;
    lotSize: number;
    templateId: string;
  }>;
}): PortfolioTemplate {
  return {
    id: prisma.id,
    name: prisma.name,
    description: prisma.description ?? null,
    strategy: prisma.strategy as PortfolioTemplate['strategy'],
    benchmark: prisma.benchmark ?? null,
    baseCurrency: prisma.baseCurrency,
    isDefault: prisma.isDefault,
    userProfileId: prisma.userProfileId,
    createdAt: prisma.createdAt,
    updatedAt: prisma.updatedAt,
    targets: prisma.targets.map((a) => ({
      id: a.id,
      assetClass: a.assetClass as PortfolioAssetTarget['assetClass'],
      optionalTickerDescription: a.optionalTickerDescription,
      allocationPercentage: a.allocationPercentage,
      minimumInvestment: a.minimumInvestment,
      fractionalAllowed: a.fractionalAllowed,
      lotSize: a.lotSize,
      templateId: a.templateId,
    })),
  };
}

export class PrismaPortfolioTemplateRepository implements PortfolioTemplateRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findAll(): Promise<PortfolioTemplate[]> {
    const projects = await this.db.portfolioTemplate.findMany({
      include: { targets: true },
      orderBy: { createdAt: 'desc' },
    });

    return projects.map(toDomain);
  }

  public async findById(id: string): Promise<PortfolioTemplate | null> {
    const project = await this.db.portfolioTemplate.findUnique({
      include: { targets: true },
      where: { id },
    });

    return project ? toDomain(project) : null;
  }

  public async create(data: {
    name: string;
    description?: string | null;
    strategy?: string;
    benchmark?: string | null;
    baseCurrency?: string;
    isDefault?: boolean;
    userProfileId: string;
    targets: Array<{
      assetClass: string;
      optionalTickerDescription?: string | null;
      allocationPercentage: number;
      classTargetId?: string | null;
      minimumInvestment?: number;
      fractionalAllowed?: boolean;
      lotSize?: number;
    }>;
  }): Promise<PortfolioTemplate> {
    const project = await this.db.portfolioTemplate.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        strategy: (data.strategy ?? 'FREE_ALLOCATION') as PrismaPortfolioStrategy,
        benchmark: data.benchmark ?? null,
        baseCurrency: data.baseCurrency ?? 'BRL',
        isDefault: data.isDefault ?? false,
        userProfileId: data.userProfileId,
        targets: {
          create: data.targets.map((a) => ({
            assetClass: a.assetClass as PrismaAssetClass,
            optionalTickerDescription: a.optionalTickerDescription ?? null,
            allocationPercentage: a.allocationPercentage,
            classTargetId: a.classTargetId ?? null,
            minimumInvestment: a.minimumInvestment ?? 0,
            fractionalAllowed: a.fractionalAllowed ?? true,
            lotSize: a.lotSize ?? 1,
          })),
        },
      },
      include: { targets: true },
    });

    return toDomain(project);
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
  ): Promise<PortfolioTemplate> {
    if (data.targets) {
      await this.db.portfolioAssetTarget.deleteMany({ where: { templateId: id } });
      for (const a of data.targets) {
        await this.db.portfolioAssetTarget.create({
          data: {
            assetClass: a.assetClass as PrismaAssetClass,
            optionalTickerDescription: a.optionalTickerDescription ?? null,
            allocationPercentage: a.allocationPercentage,
            classTargetId: a.classTargetId ?? null,
            minimumInvestment: a.minimumInvestment ?? 0,
            fractionalAllowed: a.fractionalAllowed ?? true,
            lotSize: a.lotSize ?? 1,
            templateId: id,
          },
        });
      }
    }

    const project = await this.db.portfolioTemplate.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        strategy: data.strategy as PrismaPortfolioStrategy | undefined,
        benchmark: data.benchmark,
        baseCurrency: data.baseCurrency,
        isDefault: data.isDefault,
      },
      include: { targets: true },
    });

    return toDomain(project);
  }

  public async delete(id: string): Promise<void> {
    await this.db.portfolioTemplate.delete({ where: { id } });
  }
}
