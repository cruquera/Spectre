import { z } from 'zod';

export const importQuotesCsvSchema = z.object({
  csvContent: z.string(),
});

export const importOperationsCsvSchema = z.object({
  accountId: z.string(),
  csvContent: z.string(),
});
