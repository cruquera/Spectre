import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { TaxRepository } from '../application/tax-repository.js';
import type { TaxReport } from '../domain/tax-report.js';

export class PrismaTaxRepository implements TaxRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async createReport(data: {
    data: string;
    reportType: string;
    year: number;
  }): Promise<TaxReport> {
    return this.db.taxReport.create({ data });
  }

  public async listReports(): Promise<TaxReport[]> {
    return this.db.taxReport.findMany({ orderBy: { year: 'desc' } });
  }
}
