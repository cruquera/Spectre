import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { DocumentRepository } from '../application/document-repository.js';
import type { FinancialDocument } from '../domain/financial-document.js';

export class PrismaDocumentRepository implements DocumentRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(): Promise<FinancialDocument[]> {
    return this.db.financialDocument.findMany({ orderBy: { documentDate: 'desc' } });
  }

  public async register(data: {
    documentDate: Date;
    documentType: string;
    hashSha256: string;
    relativePath: string;
  }): Promise<FinancialDocument> {
    return this.db.financialDocument.create({ data });
  }
}
