import path from 'node:path';

export function getSpectreDataRoot(homeDir: string): string {
  return path.join(homeDir, 'spectre-data');
}

export function getProfilesRegistryPath(dataRoot: string): string {
  return path.join(dataRoot, 'profiles.json');
}

export function getUserDir(dataRoot: string, slug: string): string {
  return path.join(dataRoot, 'users', slug);
}

export function getUserDbPath(dataRoot: string, slug: string): string {
  return path.join(getUserDir(dataRoot, slug), 'database.db');
}

export function getUserSaltPath(dataRoot: string, slug: string): string {
  return path.join(getUserDir(dataRoot, slug), '.salt');
}

export function getUserAttachmentsPath(dataRoot: string, slug: string): string {
  return path.join(getUserDir(dataRoot, slug), 'attachments');
}

export function getBenchmarkDbPath(dataRoot: string): string {
  return path.join(dataRoot, 'app', 'benchmark-cache.db');
}
