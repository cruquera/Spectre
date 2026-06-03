import { z } from 'zod';

export const taxReportSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  reportType: z.string(),
  year: z.number().int(),
});

export const generateTaxPreviewSchema = z.object({
  year: z.number().int(),
});
