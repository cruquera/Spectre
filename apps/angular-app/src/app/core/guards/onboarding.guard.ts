import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { IpcService } from '../services/ipc.service';

export const onboardingGuard: CanActivateFn = async () => {
  const ipc = inject(IpcService);
  const router = inject(Router);

  const res = await ipc.onboarding.getState();

  if (res.success) {
    if (res.data.status === 'COMPLETED') return true;

    return router.createUrlTree(['/dashboard']);
  }

  return router.createUrlTree(['/dashboard']);
};
