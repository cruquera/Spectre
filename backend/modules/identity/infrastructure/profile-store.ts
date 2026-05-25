import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { ProfileRegistryEntry } from '../domain/profile.js';
import { getProfilesRegistryPath } from '../../../shared/database/paths.js';

interface ProfilesFile {
  profiles: ProfileRegistryEntry[];
}

export class ProfileStore {
  constructor(private readonly dataRoot: string) {}

  private registryPath(): string {
    return getProfilesRegistryPath(this.dataRoot);
  }

  async ensureDataRoot(): Promise<void> {
    await fs.mkdir(this.dataRoot, { recursive: true });
    await fs.mkdir(path.join(this.dataRoot, 'app'), { recursive: true });
    await fs.mkdir(path.join(this.dataRoot, 'users'), { recursive: true });
  }

  async list(): Promise<ProfileRegistryEntry[]> {
    await this.ensureDataRoot();
    try {
      const raw = await fs.readFile(this.registryPath(), 'utf-8');
      const parsed = JSON.parse(raw) as ProfilesFile;
      return parsed.profiles;
    } catch {
      return [];
    }
  }

  async save(profiles: ProfileRegistryEntry[]): Promise<void> {
    await this.ensureDataRoot();
    await fs.writeFile(
      this.registryPath(),
      JSON.stringify({ profiles }, null, 2),
      'utf-8',
    );
  }

  async findBySlug(slug: string): Promise<ProfileRegistryEntry | null> {
    const profiles = await this.list();
    return profiles.find((p) => p.slug === slug) ?? null;
  }

  async add(displayName: string, slug: string): Promise<ProfileRegistryEntry> {
    const profiles = await this.list();
    if (profiles.some((p) => p.slug === slug)) {
      throw new Error('Profile slug already exists');
    }
    const entry: ProfileRegistryEntry = {
      id: randomUUID(),
      displayName,
      slug,
      lastLoginAt: null,
    };
    profiles.push(entry);
    await this.save(profiles);
    return entry;
  }

  async updateLastLogin(slug: string): Promise<void> {
    const profiles = await this.list();
    const idx = profiles.findIndex((p) => p.slug === slug);
    if (idx >= 0) {
      profiles[idx].lastLoginAt = new Date().toISOString();
      await this.save(profiles);
    }
  }
}
