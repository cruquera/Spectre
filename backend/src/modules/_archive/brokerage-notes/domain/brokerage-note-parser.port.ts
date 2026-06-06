/** Port for future OCR/PDF parsers per broker */
export type BrokerageNoteParserPort = {
  readonly brokerKey: string;
  parsePdf(buffer: Buffer): Promise<ParsedBrokerageNote>;
}

export type ParsedBrokerageNote = {
  operations: Array<{
    description: string;
    quantity?: number;
    unitPrice?: number;
  }>;
}

/** No implementation in v1 ??? manual entry only */
export class NoOpBrokerageNoteParser implements BrokerageNoteParserPort {
  public readonly brokerKey = 'manual';

  public parsePdf(): Promise<ParsedBrokerageNote> {
    return Promise.resolve({ operations: [] });
  }
}
