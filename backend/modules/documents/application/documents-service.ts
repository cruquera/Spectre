import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { AppContext } from '../../../shared/app-context.js';
import { getUserAttachmentsPath } from '../../../shared/database/paths.js';
import { ok } from '../../../shared/kernel/result.js';

export class DocumentsService {
  constructor(private readonly ctx: AppContext) {}

  async list() {
    const db = this.ctx.getUserClient();
    const items = await db.financialDocument.findMany({
      orderBy: { documentDate: 'desc' },
    });

    return ok(items);
  }

  async register(
    documentType: string,
    documentDate: string,
    fileName: string,
    base64Content: string,
  ) {
    const session = this.ctx.requireSession();
    const buffer = Buffer.from(base64Content, 'base64');
    const hash = createHash('sha256').update(buffer).digest('hex');
    const year = new Date(documentDate).getFullYear();
    const relDir = path.join('documents', String(year));
    const relPath = path.join(relDir, `${randomUUID()}-${fileName}`);
    const absDir = path.join(
      getUserAttachmentsPath(this.ctx.getDataRoot(), session.slug),
      relDir,
    );

    await fs.mkdir(absDir, { recursive: true });
    await fs.writeFile(path.join(absDir, path.basename(relPath)), buffer);

    const db = this.ctx.getUserClient();
    const doc = await db.financialDocument.create({
      data: {
  documentDate: new Date(documentDate),
  documentType,
  hashSha256: hash,
  relativePath: relPath.replace(/\\/g, '/')
},
    });

    return ok(doc);
  }
}
