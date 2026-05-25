import { cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../shared/database/sql');
const dest = path.join(__dirname, '../dist/shared/database/sql');
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
