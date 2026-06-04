import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { getProfilesRegistryPath } from '../../../shared/database/paths.js';
import type { ProfileRegistryEntry } from '../domain/profile.js';

type ProfilesFile = {
  profiles: ProfileRegistryEntry[];
}

export class ProfileStore {
  public constructor(private readonly dataRoot: string) {}

  public async ensureDataRoot(): Promise<void> {
    await fs.mkdir(this.dataRoot, { recursive: true });
    await fs.mkdir(path.join(this.dataRoot, 'app'), { recursive: true });
    await fs.mkdir(path.join(this.dataRoot, 'users'), { recursive: true });
  }

  public async list(): Promise<ProfileRegistryEntry[]> {
    await this.ensureDataRoot();
    try {
      const raw = await fs.readFile(this.registryPath(), 'utf-8');
      const parsed = JSON.parse(raw) as ProfilesFile;

      return parsed.profiles;
    } catch {
      return [];
    }
  }

  public async save(profiles: ProfileRegistryEntry[]): Promise<void> {
    await this.ensureDataRoot();
    await fs.writeFile(
      this.registryPath(),
      JSON.stringify({ profiles }, null, 2),
      'utf-8',
    );
  }

  public async findByUsername(username: string): Promise<ProfileRegistryEntry | null> {
    const profiles = await this.list();

    return profiles.find((p) => p.username === username) ?? null;
  }

  public async add(displayName: string, username: string): Promise<ProfileRegistryEntry> {
    const profiles = await this.list();

    if (profiles.some((p) => p.username === username)) {
      throw new Error('Profile username already exists');
    }
    const entry: ProfileRegistryEntry = {
      displayName,
      id: randomUUID(),
      lastLoginAt: null,
      username,
    };

    profiles.push(entry);
    await this.save(profiles);

    return entry;
  }

  public async updateLastLogin(username: string): Promise<void> {
    const profiles = await this.list();
    const idx = profiles.findIndex((p) => p.username === username);

    if (idx >= 0) {
      profiles[idx].lastLoginAt = new Date().toISOString();
      await this.save(profiles);
    }
  }

  private registryPath(): string {
    return getProfilesRegistryPath(this.dataRoot);
  }
}
