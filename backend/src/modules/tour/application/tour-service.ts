import type { AppContext } from '../../../shared/app-context.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { TourState } from '../domain/tour-state.js';

export class TourService {
  public constructor(private readonly ctx: AppContext) {}

  public async getState(): Promise<Result<TourState, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const session = this.ctx.requireSession();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      return ok({
        completed: profile.tourCompleted,
        currentStep: profile.tourCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'TOUR_STATE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async updateStep(step: number): Promise<Result<TourState, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const updated = await db.userProfile.update({
        data: { tourCurrentStep: step },
        where: { id: profile.id },
      });

      return ok({
        completed: updated.tourCompleted,
        currentStep: updated.tourCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'TOUR_UPDATE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async complete(): Promise<Result<TourState, AppError>> {
    try {
      const db = this.ctx.getUserClient();
      const profile = await db.userProfile.findFirst();

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'User profile not found'));
      }

      const updated = await db.userProfile.update({
        data: { tourCompleted: true, tourCurrentStep: 0 },
        where: { id: profile.id },
      });

      return ok({
        completed: updated.tourCompleted,
        currentStep: updated.tourCurrentStep,
      });
    } catch (e) {
      return err(
        new AppError(
          'TOUR_COMPLETE_FAILED',
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
        data: { tourCompleted: false, tourCurrentStep: 0 },
        where: { id: profile.id },
      });

      return ok(undefined);
    } catch (e) {
      return err(
        new AppError(
          'TOUR_ABORT_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }
}
