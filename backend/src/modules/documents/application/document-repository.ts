import type { FinancialDocument } from '../domain/financial-document.js';

export type DocumentRepository = {
  list(): Promise<FinancialDocument[]>;
  register(data: {
    documentDate: Date;
    documentType: string;
    hashSha256: string;
    relativePath: string;
  }): Promise<FinancialDocument>;
}
