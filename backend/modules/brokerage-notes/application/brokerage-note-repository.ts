import type { BrokerageNote, BrokerageNoteOperation } from '../domain/brokerage-note.js';

export type BrokerageNoteRepository = {
  list(): Promise<BrokerageNote[]>;
  register(data: {
    brokerId: string;
    hashSha256: string;
    noteDate: Date;
    parsedStatus: string;
    relativePath: string;
  }): Promise<BrokerageNote>;
  linkOperation(noteId: string, transactionId: string, description?: string): Promise<BrokerageNoteOperation>;
}
