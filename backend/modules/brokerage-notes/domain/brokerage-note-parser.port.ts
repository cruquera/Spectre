/** Port for future OCR/PDF parsers per broker */
export interface BrokerageNoteParserPort {
  readonly brokerKey: string;
  parsePdf(buffer: Buffer): Promise<ParsedBrokerageNote>;
}

export interface ParsedBrokerageNote {
  operations: Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}

/** No implementation in v1 — manual entry only */
export class NoOpBrokerageNoteParser implements BrokerageNoteParserPort {
  readonly brokerKey = 'manual';

  async parsePdf(): Promise<ParsedBrokerageNote> {
    return { operations: [] };
  }
}
