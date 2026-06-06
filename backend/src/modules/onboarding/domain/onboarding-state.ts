export type OnboardingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ABANDONED' | 'COMPLETED';

export type OnboardingState = {
  status: OnboardingStatus;
  currentStep: number;
};
