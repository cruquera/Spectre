import { z } from 'zod';

export const patrimonySnapshotSchema = z.object({
  id: z.string(),
  portfolioId: z.string(),
  totalValue: z.number(),
  currency: z.string(),
  capturedAt: z.string(),
});

export const captureSnapshotSchema = z.object({
  portfolioId: z.string(),
});
