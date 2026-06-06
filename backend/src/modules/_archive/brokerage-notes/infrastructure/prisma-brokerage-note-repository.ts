import type { PrismaClient as UserPrismaClient } from '../../../../node_modules/.prisma/user-client/index.js';
import type { BrokerageNoteRepository } from '../application/brokerage-note-repository.js';
import type { BrokerageNote, BrokerageNoteOperation } from '../domain/brokerage-note.js';

export class PrismaBrokerageNoteRepository implements BrokerageNoteRepository {
  public constructor(private readonly db: UserPrismaClient) {}

  public async list(): Promise<BrokerageNote[]> {
    return this.db.brokerageNote.findMany({ orderBy: { noteDate: 'desc' } });
  }

  public async register(data: {
    brokerId: string;
    hashSha256: string;
    noteDate: Date;
    parsedStatus: string;
    relativePath: string;
  }): Promise<BrokerageNote> {
    return this.db.brokerageNote.create({ data });
  }

  public async linkOperation(noteId: string, transactionId: string, description?: string): Promise<BrokerageNoteOperation> {
    return this.db.brokerageNoteOperation.create({
      data: { description, noteId, transactionId },
    });
  }
}
