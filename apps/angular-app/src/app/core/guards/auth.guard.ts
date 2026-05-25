import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IpcService } from '../services/ipc.service';

export const authGuard: CanActivateFn = () => {
  const ipc = inject(IpcService);
  const router = inject(Router);
  if (ipc.session()) return true;
  return router.createUrlTree(['/auth']);
};
