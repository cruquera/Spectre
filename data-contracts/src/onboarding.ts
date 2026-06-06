import { z } from 'zod';

export const onboardingStateSchema = z.object({
  currentStep: z.number().int().min(0),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'ABANDONED', 'COMPLETED']),
});

export const updateOnboardingStepSchema = z.object({
  step: z.number().int().min(0).max(4),
});

export type OnboardingStateDto = z.infer<typeof onboardingStateSchema>;
export type UpdateOnboardingStepRequest = z.infer<typeof updateOnboardingStepSchema>;
