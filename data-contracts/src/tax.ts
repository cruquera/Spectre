import { z } from 'zod';

export const taxReportSchema = z.object({
  id: z.string(),
  year: z.number().int(),
  reportType: z.string(),
  createdAt: z.string(),
});

export const generateTaxPreviewSchema = z.object({
  year: z.number().int(),
});
