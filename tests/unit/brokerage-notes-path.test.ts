import type { BrokerageNoteRepository } from '../../backend/src/modules/brokerage-notes/application/brokerage-note-repository.js';
import { BrokerageNotesService } from '../../backend/src/modules/brokerage-notes/application/brokerage-notes-service.js';
import { AppContext } from '../../backend/src/shared/app-context.js';

const mockRepo: BrokerageNoteRepository = {
  linkOperation: () => Promise.resolve({
    description: null,
    id: '',
    noteId: '',
    transactionId: null,
  }),
  list: () => Promise.resolve([]),
  register: () => Promise.resolve({
    brokerId: '',
    hashSha256: '',
    id: '',
    noteDate: new Date(),
    parsedStatus: 'MANUAL',
    relativePath: '',
  }),
};

describe('BrokerageNotesService path validation', () => {
  const ctx = new AppContext('/tmp/spectre-test');
  const svc = new BrokerageNotesService(ctx, mockRepo);

  it('rejects path traversal', () => {
    expect(svc.validatePath('../etc/passwd')).toBe(false);
    expect(svc.validatePath('brokerage-notes/2026/note.pdf')).toBe(true);
  });
});
