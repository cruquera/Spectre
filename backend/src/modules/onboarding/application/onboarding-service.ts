import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { OnboardingState } from '../domain/onboarding-state.js';

export class OnboardingService {
  public constructor(private readonly ctx: AppContext) {}

  public async getState(): Promise<Result<OnboardingState, AppError>> {
    try {
      const db = this.ctx.getUserClient();

      this.ctx.requireSession();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      return ok({
        status: profile.onboardingStatus,
        currentStep: profile.onboardingCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'ONBOARDING_STATE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async updateStep(step: number): Promise<Result<OnboardingState, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const updated = await db.userProfile.update({
        data: { onboardingStatus: 'IN_PROGRESS', onboardingCurrentStep: step },
        where: { id: profile.id },
      });

      return ok({
        status: 'IN_PROGRESS',
        currentStep: updated.onboardingCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'ONBOARDING_UPDATE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async complete(): Promise<Result<OnboardingState, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const updated = await db.userProfile.update({
        data: { onboardingStatus: 'COMPLETED', onboardingCurrentStep: 0 },
        where: { id: profile.id },
      });

      return ok({
        status: 'COMPLETED',
        currentStep: updated.onboardingCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'ONBOARDING_COMPLETE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async abort(): Promise<Result<void, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      await db.userProfile.update({
        data: { onboardingStatus: 'ABANDONED', onboardingCurrentStep: 0 },
        where: { id: profile.id },
      });

      return ok(undefined);
    } catch (e) {
      return err(
        new AppError(
          'ONBOARDING_ABORT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }
}
