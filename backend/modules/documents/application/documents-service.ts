import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { DocumentRepository } from './document-repository.js';
import type { AppContext } from '../../../shared/app-context.js';
import { getUserAttachmentsPath } from '../../../shared/database/paths.js';
import { type Result, ok } from '../../../shared/kernel/result.js';
import type { FinancialDocument } from '../domain/financial-document.js';

export class DocumentsService {
  public constructor(
    private readonly ctx: AppContext,
    private readonly repo: DocumentRepository,
  ) {}

  public async list(): Promise<Result<FinancialDocument[], never>> {
    const items = await this.repo.list();

    return ok(items);
  }

  public async register(
    documentType: string,
    documentDate: string,
    fileName: string,
    base64Content: string,
  ): Promise<Result<FinancialDocument, never>> {
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

    const doc = await this.repo.register({
      documentDate: new Date(documentDate),
      documentType,
      hashSha256: hash,
      relativePath: relPath.replace(/\\/g, '/'),
    });

    return ok(doc);
  }
}
