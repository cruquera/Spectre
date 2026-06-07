import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { LedgerEventRepository } from '../application/ledger-event-repository.js';
import type { CreateLedgerEventData, LedgerEvent } from '../domain/ledger-event.js';

function toDomain(prisma: {
  id: string;
  eventType: string;
  grossAmount: number;
  feesAmount: number;
  taxAmount: number;
  netAmount: number;
  currency: string;
  occurredAt: Date;
  notes: string | null;
  createdAt: Date;
  portfolioId: string;
  accountId: string;
  assetValueId: string;
  portfolio?: { name: string } | null;
  account?: { nickname: string } | null;
  assetValue?: { optionalTickerDescription: string | null; assetClass: string } | null;
}): LedgerEvent {
  return {
    id: prisma.id,
    eventType: prisma.eventType as LedgerEvent['eventType'],
    grossAmount: prisma.grossAmount,
    feesAmount: prisma.feesAmount,
    taxAmount: prisma.taxAmount,
    netAmount: prisma.netAmount,
    currency: prisma.currency,
    occurredAt: prisma.occurredAt,
    notes: prisma.notes,
    createdAt: prisma.createdAt,
    portfolioId: prisma.portfolioId,
    accountId: prisma.accountId,
    assetValueId: prisma.assetValueId,
    portfolioName: prisma.portfolio?.name,
    accountName: prisma.account?.nickname,
    assetClassName: prisma.assetValue?.optionalTickerDescription ?? prisma.assetValue?.assetClass,
  };
}

export class PrismaLedgerEventRepository implements LedgerEventRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async create(data: CreateLedgerEventData): Promise<LedgerEvent> {
    const event = await this.db.ledgerEvent.create({
      data: {
        eventType: data.eventType,
        grossAmount: data.grossAmount,
        feesAmount: data.feesAmount ?? 0,
        taxAmount: data.taxAmount ?? 0,
        netAmount: data.netAmount,
        currency: data.currency,
        occurredAt: data.occurredAt,
        notes: data.notes ?? null,
        portfolioId: data.portfolioId,
        accountId: data.accountId,
        assetValueId: data.assetValueId,
      },
      include: {
        portfolio: { select: { name: true } },
        account: { select: { nickname: true } },
        assetValue: { select: { optionalTickerDescription: true, assetClass: true } },
      },
    });

    return toDomain(event);
  }

  public async findByPortfolioId(portfolioId: string): Promise<LedgerEvent[]> {
    const events = await this.db.ledgerEvent.findMany({
      include: {
        portfolio: { select: { name: true } },
        account: { select: { nickname: true } },
        assetValue: { select: { optionalTickerDescription: true, assetClass: true } },
      },
      orderBy: { occurredAt: 'desc' },
      where: { portfolioId },
    });

    return events.map(toDomain);
  }

  public async findRecent(limit: number): Promise<LedgerEvent[]> {
    const events = await this.db.ledgerEvent.findMany({
      include: {
        portfolio: { select: { name: true } },
        account: { select: { nickname: true } },
        assetValue: { select: { optionalTickerDescription: true, assetClass: true } },
      },
      orderBy: { occurredAt: 'desc' },
      take: limit,
    });

    return events.map(toDomain);
  }

  public async delete(id: string): Promise<void> {
    await this.db.ledgerEvent.delete({ where: { id } });
  }
}
