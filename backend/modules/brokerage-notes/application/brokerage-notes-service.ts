import { createHash, randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import type { BrokerageNoteRepository } from './brokerage-note-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { getUserAttachmentsPath } from '../../../shared/database/paths.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { BrokerageNote, BrokerageNoteOperation } from '../domain/brokerage-note.js';

export class BrokerageNotesService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: BrokerageNoteRepository,
  ) {}

  public async list(): Promise<Result<BrokerageNote[], never>> {
    const items = await this.repo.list();

    return ok(items);
  }

  public async register(
    brokerId: string,
    noteDate: string,
    fileName: string,
    base64Content: string,
  ): Promise<Result<BrokerageNote, never>> {
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

    const note = await this.repo.register({
      brokerId,
      hashSha256: hash,
      noteDate: new Date(noteDate),
      parsedStatus: 'MANUAL',
      relativePath: relPath.replace(/\\/g, '/'),
    });

    return ok(note);
  }

  public async linkOperation(noteId: string, transactionId: string, description?: string): Promise<Result<BrokerageNoteOperation, never>> {
    const op = await this.repo.linkOperation(noteId, transactionId, description);

    return ok(op);
  }

  public validatePath(relativePath: string): boolean {
    const normalized = path.normalize(relativePath);

    return !normalized.includes('..') && !path.isAbsolute(normalized);
  }
}
