import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { CreatePortfolioData, InvestmentPortfolioRepository, UpdateAssetValueData } from '../application/investment-portfolio-repository.js';
import type { InvestmentPortfolio } from '../domain/investment-portfolio.js';

function toDomain(prisma: {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userProfileId: string;
  templateId: string;
  assetValues: Array<{
    id: string;
    assetClass: string;
    optionalTickerDescription: string | null;
    targetPercentage: number;
    currentValue: number;
    classTargetId: string | null;
  }>;
}): InvestmentPortfolio {
  return {
    id: prisma.id,
    name: prisma.name,
    status: prisma.status as InvestmentPortfolio['status'],
    createdAt: prisma.createdAt,
    updatedAt: prisma.updatedAt,
    userProfileId: prisma.userProfileId,
    templateId: prisma.templateId,
    assetValues: prisma.assetValues.map((av) => ({
      id: av.id,
      assetClass: av.assetClass,
      optionalTickerDescription: av.optionalTickerDescription,
      targetPercentage: av.targetPercentage,
      currentValue: av.currentValue,
      classTargetId: av.classTargetId,
    })),
  };
}

export class PrismaInvestmentPortfolioRepository implements InvestmentPortfolioRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findAll(): Promise<InvestmentPortfolio[]> {
    const portfolios = await this.db.investmentPortfolio.findMany({
      include: { assetValues: true },
      orderBy: { createdAt: 'desc' },
    });

    return portfolios.map(toDomain);
  }

  public async findById(id: string): Promise<InvestmentPortfolio | null> {
    const portfolio = await this.db.investmentPortfolio.findUnique({
      include: { assetValues: true },
      where: { id },
    });

    return portfolio ? toDomain(portfolio) : null;
  }

  public async create(data: CreatePortfolioData): Promise<InvestmentPortfolio> {
    const portfolio = await this.db.investmentPortfolio.create({
      data: {
        name: data.name,
        status: 'ACTIVE',
        userProfileId: data.userProfileId,
        templateId: data.templateId,
        assetValues: {
          create: data.assetValues.map((av) => ({
            assetClass: av.assetClass,
            optionalTickerDescription: av.optionalTickerDescription,
            targetPercentage: av.targetPercentage,
            currentValue: 0,
            classTargetId: av.classTargetId,
          })),
        },
      },
      include: { assetValues: true },
    });

    return toDomain(portfolio);
  }

  public async updateAssetValues(portfolioId: string, values: UpdateAssetValueData[]): Promise<void> {
    for (const v of values) {
      await this.db.portfolioAssetValue.update({
        data: { currentValue: v.currentValue },
        where: { id: v.id },
      });
    }
  }

  public async delete(id: string): Promise<void> {
    await this.db.investmentPortfolio.delete({ where: { id } });
  }
}
