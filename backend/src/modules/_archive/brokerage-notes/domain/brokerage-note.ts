export type BrokerageNote = {
  id: string;
  hashSha256: string;
  relativePath: string;
  brokerId: string;
  noteDate: Date;
  parsedStatus: string;
};

export type BrokerageNoteOperation = {
  id: string;
  noteId: string;
  transactionId: string | null;
  description: string | null;
};
