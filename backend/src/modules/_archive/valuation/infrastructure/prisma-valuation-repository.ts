import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { ValuationRepository } from '../application/valuation-repository.js';
import type { ExchangeRate, PositionWithAsset, Quote } from '../domain/valuation-types.js';

export class PrismaValuationRepository implements ValuationRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async findAccountIdsByPortfolio(portfolioId: string): Promise<string[]> {
    const links = await this.db.portfolioAccount.findMany({
      select: { accountId: true },
      where: { portfolioId },
    });

    return links.map((l) => l.accountId);
  }

  public async findPositionsWithAssets(accountIds: string[]): Promise<PositionWithAsset[]> {
    return this.db.position.findMany({
      include: { asset: true },
      where: { accountId: { in: accountIds } },
    });
  }

  public async findLatestQuote(assetId: string): Promise<Quote | null> {
    return this.db.quote.findFirst({
      orderBy: { asOf: 'desc' },
      where: { assetId },
    });
  }

  public async findLatestExchangeRate(from: string, to: string): Promise<ExchangeRate | null> {
    return this.db.exchangeRate.findFirst({
      orderBy: { asOf: 'desc' },
      where: { fromCurrency: from, toCurrency: to },
    });
  }
}
