import type { TaxReport } from '../domain/tax-report.js';

export type TaxRepository = {
  createReport(data: {
    data: string;
    reportType: string;
    year: number;
  }): Promise<TaxReport>;
  listReports(): Promise<TaxReport[]>;
}
