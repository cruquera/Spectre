import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { IpcService } from '../services/ipc.service';

export const tourGuard: CanActivateFn = async () => {
  const ipc = inject(IpcService);
  const router = inject(Router);

  const res = await ipc.tour.getState();

  if (res.success) {
    if (res.data.completed) return true;

    return router.createUrlTree(['/dashboard']);
  }

  return router.createUrlTree(['/dashboard']);
};
