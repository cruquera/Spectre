import fs from 'node:fs/promises';

import {
  benchmarkRequestSchema,
  captureSnapshotSchema,
  createAccountSchema,
  createAssetSchema,
  createInstitutionSchema,
  createInvestmentBlockSchema,
  createPortfolioSchema,
  createProfileRequestSchema,
  createQuoteSchema,
  createTransactionSchema,
  generateTaxPreviewSchema,
  healthcheckResponseSchema,
  importOperationsCsvSchema,
  importQuotesCsvSchema,
  loginRequestSchema,
  registerBrokerageNoteSchema,
  registerDocumentSchema,
  setAssetAllocationSchema,
  setCategoryAllocationSchema,
  setMonthlyBlockSchema,
  simulateContributionSchema,
} from '@spectre/data-contracts';
import { ipcMain } from 'electron';

import { AccountsService } from '../../modules/accounts/application/accounts-service.js';
import { PrismaAccountRepository } from '../../modules/accounts/infrastructure/prisma-account-repository.js';
import { AllocationService } from '../../modules/allocation/application/allocation-service.js';
import { PrismaAllocationRepository } from '../../modules/allocation/infrastructure/prisma-allocation-repository.js';
import { AnalyticsService } from '../../modules/analytics/application/analytics-service.js';
import { AssetsService } from '../../modules/assets/application/assets-service.js';
import { PrismaAssetRepository } from '../../modules/assets/infrastructure/prisma-asset-repository.js';
import { BenchmarkService } from '../../modules/benchmark/application/benchmark-service.js';
import { PrismaBenchmarkRepository } from '../../modules/benchmark/infrastructure/prisma-benchmark-repository.js';
import { BrokerageNotesService } from '../../modules/brokerage-notes/application/brokerage-notes-service.js';
import { PrismaBrokerageNoteRepository } from '../../modules/brokerage-notes/infrastructure/prisma-brokerage-note-repository.js';
import { ContributionService } from '../../modules/contribution-planning/application/contribution-service.js';
import { PrismaContributionRepository } from '../../modules/contribution-planning/infrastructure/prisma-contribution-repository.js';
import { DocumentsService } from '../../modules/documents/application/documents-service.js';
import { PrismaDocumentRepository } from '../../modules/documents/infrastructure/prisma-document-repository.js';
import { IdentityService } from '../../modules/identity/index.js';
import { ImportService } from '../../modules/import/application/import-service.js';
import { PrismaImportRepository } from '../../modules/import/infrastructure/prisma-import-repository.js';
import { InstitutionsService } from '../../modules/institutions/application/institutions-service.js';
import { PrismaInstitutionRepository } from '../../modules/institutions/infrastructure/prisma-institution-repository.js';
import { MarketDataService } from '../../modules/market-data/application/market-data-service.js';
import { PrismaMarketDataRepository } from '../../modules/market-data/infrastructure/prisma-market-data-repository.js';
import { PatrimonyService } from '../../modules/patrimony-history/application/patrimony-service.js';
import { PrismaPatrimonyRepository } from '../../modules/patrimony-history/infrastructure/prisma-patrimony-repository.js';
import { PortfolioService } from '../../modules/portfolio/application/portfolio-service.js';
import { PrismaPortfolioRepository } from '../../modules/portfolio/infrastructure/prisma-portfolio-repository.js';
import { RebalancingService } from '../../modules/rebalancing/application/rebalancing-service.js';
import { TaxService } from '../../modules/tax/application/tax-service.js';
import { PrismaTaxRepository } from '../../modules/tax/infrastructure/prisma-tax-repository.js';
import { ValuationService } from '../../modules/valuation/application/valuation-service.js';
import { PrismaValuationRepository } from '../../modules/valuation/infrastructure/prisma-valuation-repository.js';
import type { AppContext } from '../app-context.js';
import { getBenchmarkDbPath } from '../database/paths.js';
import { createBenchmarkClient } from '../database/prisma-factory.js';
import { ok, toIpcResult } from '../kernel/result.js';

export function registerIpcHandlers(ctx: AppContext): void {
  const identity = new IdentityService(ctx);
  const institutions = new InstitutionsService(ctx, new PrismaInstitutionRepository(ctx.getUserClient()));
  const accounts = new AccountsService(ctx, new PrismaAccountRepository(ctx.getUserClient()));
  const assets = new AssetsService(ctx, new PrismaAssetRepository(ctx.getUserClient()));
  const portfolioRepo = new PrismaPortfolioRepository(ctx.getUserClient());
  const allocationRepo = new PrismaAllocationRepository(ctx.getUserClient());
  const portfolio = new PortfolioService(portfolioRepo);
  const db = ctx.getUserClient();
  const valuation = new ValuationService(ctx, new PrismaValuationRepository(db));
  const allocation = new AllocationService(ctx, allocationRepo, valuation);
  const benchmark = new BenchmarkService(ctx, new PrismaBenchmarkRepository(ctx.getBenchmarkClient()));
  const marketData = new MarketDataService(ctx, new PrismaMarketDataRepository(db), benchmark);
  const rebalancing = new RebalancingService(allocation);
  const patrimony = new PatrimonyService(ctx, new PrismaPatrimonyRepository(db), valuation);
  const analytics = new AnalyticsService(patrimony);
  const contributionRepo = new PrismaContributionRepository(db);
  const contribution = new ContributionService(ctx, contributionRepo, allocation);
  const brokerageNotes = new BrokerageNotesService(ctx, new PrismaBrokerageNoteRepository(db));
  const tax = new TaxService(ctx, new PrismaTaxRepository(db));
  const importSvc = new ImportService(ctx, new PrismaImportRepository(db), benchmark);
  const documents = new DocumentsService(ctx, new PrismaDocumentRepository(db));

  ipcMain.handle('system:healthcheck', () => {
    const data = {
      status: 'ok' as const,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };

    healthcheckResponseSchema.parse(data);

    return toIpcResult(ok(data));
  });

  ipcMain.handle('system:initBenchmarkDb', async () => {
    const dbPath = getBenchmarkDbPath(ctx.getDataRoot());

    await fs.mkdir(dbPath.replace(/[^/\\]+$/, ''), { recursive: true });
    const client = createBenchmarkClient(dbPath);

    await client.$connect();
    ctx.setBenchmarkClient(client);

    return toIpcResult(ok(undefined));
  });

  ipcMain.handle('identity:listProfiles', async () =>
    toIpcResult(await identity.listProfiles()),
  );

  ipcMain.handle('identity:createProfile', async (_e, raw) => {
    const input = createProfileRequestSchema.parse(raw);

    return toIpcResult(
      await identity.createProfile(input.displayName, input.slug, input.password),
    );
  });

  ipcMain.handle('identity:login', async (_e, raw) => {
    const input = loginRequestSchema.parse(raw);

    return toIpcResult(await identity.login(input.slug, input.password));
  });

  ipcMain.handle('identity:logout', async () => toIpcResult(await identity.logout()));

  ipcMain.handle('institutions:list', async () => toIpcResult(await institutions.list()));
  ipcMain.handle('institutions:create', async (_e, raw) => {
    const input = createInstitutionSchema.parse(raw);

    return toIpcResult(await institutions.create(input.name, input.type));
  });

  ipcMain.handle('accounts:list', async (_e, institutionId?: string) =>
    toIpcResult(await accounts.list(institutionId)),
  );
  ipcMain.handle('accounts:create', async (_e, raw) => {
    const input = createAccountSchema.parse(raw);

    return toIpcResult(
      await accounts.create(input.institutionId, input.name, input.currency),
    );
  });

  ipcMain.handle('assets:list', async (_e, category?: string) =>
    toIpcResult(await assets.list(category as never)),
  );
  ipcMain.handle('assets:create', async (_e, raw) => {
    const input = createAssetSchema.parse(raw);

    return toIpcResult(await assets.create(input));
  });

  ipcMain.handle('portfolio:list', async () => toIpcResult(await portfolio.list()));
  ipcMain.handle('portfolio:create', async (_e, raw) => {
    const input = createPortfolioSchema.parse(raw);

    return toIpcResult(
      await portfolio.create(input.name, input.baseCurrency, input.accountIds),
    );
  });
  ipcMain.handle('portfolio:createTransaction', async (_e, raw) => {
    const input = createTransactionSchema.parse(raw);

    return toIpcResult(await portfolio.createTransaction(input));
  });
  ipcMain.handle('portfolio:listPositions', async (_e, accountId?: string) =>
    toIpcResult(await portfolio.listPositions(accountId)),
  );

  ipcMain.handle('allocation:setCategory', async (_e, raw) => {
    const input = setCategoryAllocationSchema.parse(raw);

    return toIpcResult(
      await allocation.setCategoryTarget(
        input.portfolioId,
        input.category,
        input.targetPercent,
      ),
    );
  });
  ipcMain.handle('allocation:setAsset', async (_e, raw) => {
    const input = setAssetAllocationSchema.parse(raw);

    return toIpcResult(
      await allocation.setAssetTarget(
        input.portfolioId,
        input.assetId,
        input.targetPercent,
      ),
    );
  });
  ipcMain.handle('allocation:analyze', async (_e, portfolioId: string, threshold: number = 5) =>
    toIpcResult(await allocation.analyze(portfolioId, threshold)),
  );

  ipcMain.handle('benchmark:sync', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await benchmark.sync(input));
  });
  ipcMain.handle('benchmark:listCached', async (_e, raw) => {
    const input = benchmarkRequestSchema.parse(raw);

    return toIpcResult(await benchmark.listCached(input));
  });

  ipcMain.handle('marketData:syncBenchmark', async (_e, assetId: string, ticker: string) =>
    toIpcResult(await marketData.syncFromBenchmark(assetId, ticker)),
  );

  ipcMain.handle('marketData:createQuote', async (_e, raw) => {
    const input = createQuoteSchema.parse(raw);

    return toIpcResult(
      await marketData.createManualQuote(
        input.assetId,
        input.price,
        input.currency,
        input.asOf,
      ),
    );
  });

  ipcMain.handle('contribution:createBlock', async (_e, raw) => {
    const input = createInvestmentBlockSchema.parse(raw);

    return toIpcResult(await contribution.createBlock(input.name, input.assetIds));
  });
  ipcMain.handle('contribution:setMonthlyBlock', async (_e, raw) => {
    const input = setMonthlyBlockSchema.parse(raw);

    return toIpcResult(
      await contribution.setMonthlyBlock(input.year, input.month, input.blockId),
    );
  });
  ipcMain.handle('contribution:simulate', async (_e, raw) => {
    const input = simulateContributionSchema.parse(raw);

    return toIpcResult(
      await contribution.simulate(
        input.portfolioId,
        input.amount,
        input.currency,
        input.year,
        input.month,
      ),
    );
  });

  ipcMain.handle('rebalancing:analyze', async (_e, portfolioId: string, threshold: number = 5) =>
    toIpcResult(await rebalancing.analyze(portfolioId, threshold)),
  );

  ipcMain.handle('brokerageNotes:list', async () =>
    toIpcResult(await brokerageNotes.list()),
  );
  ipcMain.handle('brokerageNotes:register', async (_e, raw) => {
    const input = registerBrokerageNoteSchema.parse(raw);

    return toIpcResult(
      await brokerageNotes.register(
        input.brokerId,
        input.noteDate,
        input.fileName,
        input.base64Content,
      ),
    );
  });

  ipcMain.handle('patrimony:capture', async (_e, raw) => {
    const input = captureSnapshotSchema.parse(raw);

    return toIpcResult(await patrimony.captureSnapshot(input.portfolioId));
  });
  ipcMain.handle('patrimony:list', async (_e, portfolioId: string) =>
    toIpcResult(await patrimony.listHistory(portfolioId)),
  );

  ipcMain.handle('tax:preview', async (_e, raw) => {
    const input = generateTaxPreviewSchema.parse(raw);

    return toIpcResult(await tax.generatePreview(input.year));
  });

  ipcMain.handle('import:quotesCsv', async (_e, raw) => {
    const input = importQuotesCsvSchema.parse(raw);

    return toIpcResult(await importSvc.importQuotesCsv(input.csvContent));
  });
  ipcMain.handle('import:syncFx', async (_e, from: string, to: string, ticker: string) =>
    toIpcResult(await importSvc.syncFxFromBenchmark(from, to, ticker)),
  );

  ipcMain.handle('import:operationsCsv', async (_e, raw) => {
    const input = importOperationsCsvSchema.parse(raw);

    return toIpcResult(
      await importSvc.importOperationsCsv(input.accountId, input.csvContent),
    );
  });

  ipcMain.handle('documents:list', async () => toIpcResult(await documents.list()));
  ipcMain.handle('documents:register', async (_e, raw) => {
    const input = registerDocumentSchema.parse(raw);

    return toIpcResult(
      await documents.register(
        input.documentType,
        input.documentDate,
        input.fileName,
        input.base64Content,
      ),
    );
  });

  ipcMain.handle('valuation:getPortfolioValue', async (_e, portfolioId: string) => {
    const db = ctx.getUserClient();
    const p = await db.portfolio.findUniqueOrThrow({ where: { id: portfolioId } });

    return toIpcResult(await valuation.getPortfolioValue(portfolioId, p.baseCurrency));
  });

  ipcMain.handle('analytics:portfolioEvolution', async (_e, portfolioId: string) =>
    toIpcResult(await analytics.portfolioEvolution(portfolioId)),
  );
}
