import fs from 'node:fs/promises';
import path from 'node:path';

import type { AppContext } from '../../../shared/app-context.js';
import {
  getUserAttachmentsPath,
  getUserDbPath,
  getUserDir,
  getUserSaltPath,
} from '../../../shared/database/paths.js';
import { createEncryptedUserClient } from '../../../shared/database/prisma-factory.js';
import { seedDefaultStrategies } from '../../../shared/database/seed-defaults.js';
import { AppError, type Result, err, ok } from '../../../shared/kernel/result.js';
import type { ProfileRegistryEntry } from '../domain/profile.js';
import { CryptoService } from '../infrastructure/crypto-service.js';
import { ProfileStore } from '../infrastructure/profile-store.js';

export class IdentityService {
  private readonly profileStore: ProfileStore;
  private readonly crypto = new CryptoService();

  public constructor(private readonly ctx: AppContext) {
    this.profileStore = new ProfileStore(ctx.getDataRoot());
  }

  public async listProfiles(): Promise<Result<ProfileRegistryEntry[], never>> {
    return ok(await this.profileStore.list());
  }

  public async createProfile(
    displayName: string,
    username: string,
    password: string,
  ): Promise<Result<{ username: string }, AppError>> {
    try {
      await this.profileStore.ensureDataRoot();
      const existing = await this.profileStore.findByUsername(username);

      if (existing) {
        return err(new AppError('PROFILE_EXISTS', 'Profile username already exists'));
      }

      const entry = await this.profileStore.add(displayName, username);
      const userDir = getUserDir(this.ctx.getDataRoot(), username);

      await fs.mkdir(userDir, { recursive: true });
      await fs.mkdir(getUserAttachmentsPath(this.ctx.getDataRoot(), username), {
        recursive: true,
      });
      await fs.mkdir(path.join(userDir, 'imports'), { recursive: true });

      const hash = await this.crypto.hashPassword(password);

      await fs.writeFile(path.join(userDir, '.password-hash'), hash, 'utf-8');

      const dbKey = await this.crypto.deriveDbKey(
        password,
        getUserSaltPath(this.ctx.getDataRoot(), username),
      );
      const dbPath = getUserDbPath(this.ctx.getDataRoot(), username);
      const client = createEncryptedUserClient(dbPath, dbKey);

      await client.$executeRaw`SELECT 1`;
      await client.userProfile.create({
        data: { displayName },
      });
      await seedDefaultStrategies(client);
      await client.$disconnect();

      return ok({ username: entry.username });
    } catch (e) {
      return err(
        new AppError(
          'CREATE_PROFILE_FAILED',
          e instanceof Error ? e.message : 'Unknown error',
        ),
      );
    }
  }

  public async login(
    username: string,
    password: string,
  ): Promise<Result<{ displayName: string }, AppError>> {
    try {
      const profile = await this.profileStore.findByUsername(username);

      if (!profile) {
        return err(new AppError('PROFILE_NOT_FOUND', 'Profile not found'));
      }

      const hashPath = path.join(
        getUserDir(this.ctx.getDataRoot(), username),
        '.password-hash',
      );
      const hash = await fs.readFile(hashPath, 'utf-8');
      const valid = await this.crypto.verifyPassword(hash, password);

      if (!valid) {
        return err(new AppError('INVALID_CREDENTIALS', 'Invalid password'));
      }

      const dbKey = await this.crypto.deriveDbKey(
        password,
        getUserSaltPath(this.ctx.getDataRoot(), username),
      );
      const dbPath = getUserDbPath(this.ctx.getDataRoot(), username);
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
      this.ctx.setSession({ displayName: profile.displayName, username });
      await this.profileStore.updateLastLogin(username);

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

  public async logout(): Promise<Result<void, AppError>> {
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
