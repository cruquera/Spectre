import * as path from 'node:path';

export function getSpectreDataRoot(homeDir: string): string {
  return path.join(homeDir, 'spectre-data');
}

export function getProfilesRegistryPath(dataRoot: string): string {
  return path.join(dataRoot, 'profiles.json');
}

export function getUserDir(dataRoot: string, username: string): string {
  return path.join(dataRoot, 'users', username);
}

export function getUserDbPath(dataRoot: string, username: string): string {
  return path.join(getUserDir(dataRoot, username), 'database.db');
}

export function getUserSaltPath(dataRoot: string, username: string): string {
  return path.join(getUserDir(dataRoot, username), '.salt');
}

export function getUserAttachmentsPath(dataRoot: string, username: string): string {
  return path.join(getUserDir(dataRoot, username), 'attachments');
}

export function getBenchmarkDbPath(dataRoot: string): string {
  return path.join(dataRoot, 'app', 'benchmark-cache.db');
}
