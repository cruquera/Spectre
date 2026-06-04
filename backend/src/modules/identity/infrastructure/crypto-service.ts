import { randomBytes } from 'node:crypto';
import fs from 'node:fs/promises';

import argon2 from 'argon2';

export class CryptoService {
  public async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, { type: argon2.argon2id });
  }

  public async verifyPassword(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  public async deriveDbKey(password: string, saltPath: string): Promise<string> {
    const salt = await this.getOrCreateSalt(saltPath);
    const raw = await argon2.hash(password, {
      raw: true,
      salt: Buffer.from(salt, 'hex'),
      type: argon2.argon2id,
    });

    return Buffer.from(raw).toString('hex').slice(0, 64);
  }

  private async getOrCreateSalt(saltPath: string): Promise<string> {
    try {
      return (await fs.readFile(saltPath, 'utf-8')).trim();
    } catch {
      const salt = Buffer.from(cryptoRandom(32)).toString('hex');

      await fs.mkdir(saltPath.replace(/[^/\\]+$/, ''), { recursive: true });
      await fs.writeFile(saltPath, salt, 'utf-8');

      return salt;
    }
  }
}

function cryptoRandom(bytes: number): Uint8Array {
  return randomBytes(bytes);
}
