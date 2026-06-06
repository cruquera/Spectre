import {
  createAccountSchema,
  createPortfolioProjectSchema,
  createProfileRequestSchema,
  loginRequestSchema,
  updateTourStepSchema,
} from '@spectre/data-contracts';
import { ipcMain } from 'electron';

import { AccountsService } from '../../modules/accounts/index.js';
import { PrismaAccountRepository } from '../../modules/accounts/index.js';
import { IdentityService } from '../../modules/identity/index.js';
import { PortfolioProjectService, PrismaPortfolioProjectRepository } from '../../modules/portfolio-projects/index.js';
import { TourService } from '../../modules/tour/index.js';
import type { AppContext } from '../app-context.js';
import { AppError, err, ok, toIpcResult } from '../kernel/result.js';

export function registerIpcHandlers(ctx: AppContext): void {
  const identity = new IdentityService(ctx);
  const tour = new TourService(ctx);

  const getAccountsService = () => {
    const db = ctx.getUserClient();

    return new AccountsService(ctx, new PrismaAccountRepository(db));
  };

  const getPortfolioProjectService = () => {
    const db = ctx.getUserClient();

    return new PortfolioProjectService(ctx, new PrismaPortfolioProjectRepository(db));
  };

  ipcMain.handle('identity:listProfiles', async () =>
    toIpcResult(await identity.listProfiles()),
  );

  ipcMain.handle('identity:createProfile', async (_e, raw) => {
    const input = createProfileRequestSchema.parse(raw);

    return toIpcResult(
      await identity.createProfile(input.displayName, input.username, input.password),
    );
  });

  ipcMain.handle('identity:login', async (_e, raw) => {
    const input = loginRequestSchema.parse(raw);

    return toIpcResult(await identity.login(input.username, input.password));
  });

  ipcMain.handle('identity:logout', async () => toIpcResult(await identity.logout()));

  ipcMain.handle('identity:session', async () => {
    const session = ctx.getSession();

    if (session) {
      return toIpcResult(ok(session));
    }

    return toIpcResult(err(new AppError('NO_SESSION', 'Not logged in')));
  });

  ipcMain.handle('tour:getState', async () => toIpcResult(await tour.getState()));
  ipcMain.handle('tour:updateStep', async (_e, raw) => {
    const input = updateTourStepSchema.parse(raw);

    return toIpcResult(await tour.updateStep(input.step));
  });
  ipcMain.handle('tour:complete', async () => toIpcResult(await tour.complete()));
  ipcMain.handle('tour:abort', async () => toIpcResult(await tour.abort()));

  ipcMain.handle('accounts:list', async () =>
    toIpcResult(await getAccountsService().list()),
  );
  ipcMain.handle('accounts:create', async (_e, raw) => {
    const input = createAccountSchema.parse(raw);

    return toIpcResult(
      await getAccountsService().create(input.institutionName, input.nickname, input.currency),
    );
  });
  ipcMain.handle('accounts:update', async (_e, id: string, raw: unknown) => {
    const input = createAccountSchema.partial().parse(raw);

    return toIpcResult(await getAccountsService().update(id, input));
  });
  ipcMain.handle('accounts:delete', async (_e, id: string) =>
    toIpcResult(await getAccountsService().delete(id)),
  );

  ipcMain.handle('portfolioProjects:list', async () =>
    toIpcResult(await getPortfolioProjectService().list()),
  );
  ipcMain.handle('portfolioProjects:create', async (_e, raw) => {
    const input = createPortfolioProjectSchema.parse(raw);

    return toIpcResult(
      await getPortfolioProjectService().create(input.name, input.assets),
    );
  });
  ipcMain.handle('portfolioProjects:update', async (_e, id: string, raw: unknown) => {
    const input = createPortfolioProjectSchema.partial().parse(raw);

    return toIpcResult(await getPortfolioProjectService().update(id, input));
  });
  ipcMain.handle('portfolioProjects:delete', async (_e, id: string) =>
    toIpcResult(await getPortfolioProjectService().delete(id)),
  );
}
