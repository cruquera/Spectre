import { BrokerageNotesService } from '../../backend/modules/brokerage-notes/application/brokerage-notes-service';
import { AppContext } from '../../backend/shared/app-context';

describe('BrokerageNotesService path validation', () => {
  const ctx = new AppContext('/tmp/spectre-test');
  const svc = new BrokerageNotesService(ctx);

  it('rejects path traversal', () => {
    expect(svc.validatePath('../etc/passwd')).toBe(false);
    expect(svc.validatePath('brokerage-notes/2026/note.pdf')).toBe(true);
  });
});
