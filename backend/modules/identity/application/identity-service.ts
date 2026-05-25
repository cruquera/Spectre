import fs from 'node:fs/promises';
import path from 'node:path';
import type { AppContext } from '../../../shared/app-context.js';
import { AppError, ok, err, type Result } from '../../../shared/kernel/result.js';
import {
  getUserDbPath,
  getUserDir,
  getUserSaltPath,
  getUserAttachmentsPath,
} from '../../../shared/database/paths.js';
import { createEncryptedUserClient } from '../../../shared/database/prisma-factory.js';
import { seedDefaultStrategies } from '../../../shared/database/seed-defaults.js';
import { ProfileStore } from '../infrastructure/profile-store.js';
import { CryptoService } from '../infrastructure/crypto-service.js';

export class IdentityService {
  private readonly profileStore: ProfileStore;
  private readonly crypto = new CryptoService();
  private readonly passwordHashes = new Map<string, string>();

  constructor(private readonly ctx: AppContext) {
    this.profileStore = new ProfileStore(ctx.getDataRoot());
  }

  async listProfiles() {
    return ok(await this.profileStore.list());
  }

  async createProfile(
    displayName: string,
    slug: string,
    password: string,
  ): Promise<Result<{ slug: string }, AppError>> {
    try {
      await this.profileStore.ensureDataRoot();
      const existing = await this.profileStore.findBySlug(slug);
      if (existing) {
        return err(new AppError('PROFILE_EXISTS', 'Profile slug already exists'));
      }

      const entry = await this.profileStore.add(displayName, slug);
      const userDir = getUserDir(this.ctx.getDataRoot(), slug);
      await fs.mkdir(userDir, { recursive: true });
      await fs.mkdir(getUserAttachmentsPath(this.ctx.getDataRoot(), slug), {
        recursive: true,
      });
      await fs.mkdir(path.join(userDir, 'imports'), { recursive: true });

      const hash = await this.crypto.hashPassword(password);
      await fs.writeFile(
        path.join(userDir, '.password-hash'),
        hash,
        'utf-8',
      );

      const dbKey = await this.crypto.deriveDbKey(
        password,
        getUserSaltPath(this.ctx.getDataRoot(), slug),
      );
      const dbPath = getUserDbPath(this.ctx.getDataRoot(), slug);
      const client = createEncryptedUserClient(dbPath, dbKey);
      await client.$executeRaw`SELECT 1`;
      await client.userProfile.create({
        data: { displayName },
      });
      await seedDefaultStrategies(client);
      await client.$disconnect();

      return ok({ slug: entry.slug });
    } catch (e) {
      return err(
        new AppError(
          'CREATE_PROFILE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  async login(
    slug: string,
    password: string,
  ): Promise<Result<{ displayName: string }, AppError>> {
    try {
      const profile = await this.profileStore.findBySlug(slug);
      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'Profile not found'));
      }

      const hashPath = path.join(
        getUserDir(this.ctx.getDataRoot(), slug),
        '.password-hash',
      );
      const hash = await fs.readFile(hashPath, 'utf-8');
      const valid = await this.crypto.verifyPassword(hash, password);
      if (!valid) {
        return err(new AppError('INVALID_CREDENTIALS', 'Invalid password'));
      }

      const dbKey = await this.crypto.deriveDbKey(
        password,
        getUserSaltPath(this.ctx.getDataRoot(), slug),
      );
      const dbPath = getUserDbPath(this.ctx.getDataRoot(), slug);
      const client = createEncryptedUserClient(dbPath, dbKey);
      await client.$connect();
      await seedDefaultStrategies(client);

      try {
        const prev = this.ctx.getUserClient();
        await prev.$disconnect();
      } catch {
        // no previous session
      }
      this.ctx.setUserClient(client);
      this.ctx.setSession({ slug, displayName: profile.displayName });
      await this.profileStore.updateLastLogin(slug);

      return ok({ displayName: profile.displayName });
    } catch (e) {
      return err(
        new AppError(
          'LOGIN_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  async logout(): Promise<Result<void, AppError>> {
    try {
      const client = this.ctx.getUserClient();
      await client.$disconnect();
    } catch {
      // not logged in
    }
    this.ctx.setUserClient(null);
    this.ctx.setSession(null);
    return ok(undefined);
  }
}
