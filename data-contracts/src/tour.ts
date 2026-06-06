import { z } from 'zod';

export const tourStateSchema = z.object({
  completed: z.boolean(),
  currentStep: z.number().int().min(0),
});

export const updateTourStepSchema = z.object({
  step: z.number().int().min(0).max(3),
});

export type TourStateDto = z.infer<typeof tourStateSchema>;
export type UpdateTourStepRequest = z.infer<typeof updateTourStepSchema>;
