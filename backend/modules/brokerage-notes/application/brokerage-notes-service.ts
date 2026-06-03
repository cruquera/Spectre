import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { AppContext } from '../../../shared/app-context.js';
import { getUserAttachmentsPath } from '../../../shared/database/paths.js';
import { ok } from '../../../shared/kernel/result.js';

export class BrokerageNotesService {
  constructor(private readonly ctx: AppContext) {}

  async list() {
    const db = this.ctx.getUserClient();
    const items = await db.brokerageNote.findMany({ orderBy: { noteDate: 'desc' } });

    return ok(items);
  }

  async register(
    brokerId: string,
    noteDate: string,
    fileName: string,
    base64Content: string,
  ) {
    const session = this.ctx.requireSession();
    const buffer = Buffer.from(base64Content, 'base64');
    const hash = createHash('sha256').update(buffer).digest('hex');
    const year = new Date(noteDate).getFullYear();
    const relDir = path.join('brokerage-notes', String(year));
    const relPath = path.join(relDir, `${randomUUID()}-${fileName}`);
    const absDir = path.join(
      getUserAttachmentsPath(this.ctx.getDataRoot(), session.slug),
      relDir,
    );

    await fs.mkdir(absDir, { recursive: true });
    const absPath = path.join(absDir, path.basename(relPath));

    await fs.writeFile(absPath, buffer);

    const db = this.ctx.getUserClient();
    const note = await db.brokerageNote.create({
      data: {
  brokerId,
  hashSha256: hash,
  noteDate: new Date(noteDate),
  parsedStatus: 'MANUAL',
  relativePath: relPath.replace(/\\/g, '/')
},
    });

    return ok(note);
  }

  async linkOperation(noteId: string, transactionId: string, description?: string) {
    const db = this.ctx.getUserClient();
    const op = await db.brokerageNoteOperation.create({
      data: { noteId, transactionId, description },
    });

    return ok(op);
  }

  validatePath(relativePath: string): boolean {
    const normalized = path.normalize(relativePath);

    return !normalized.includes('..') && !path.isAbsolute(normalized);
  }
}
