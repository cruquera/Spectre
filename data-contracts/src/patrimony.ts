import { z } from 'zod';

export const patrimonySnapshotSchema = z.object({
  capturedAt: z.string(),
  currency: z.string(),
  id: z.string(),
  portfolioId: z.string(),
  totalValue: z.number(),
});

export const captureSnapshotSchema = z.object({
  portfolioId: z.string(),
});
