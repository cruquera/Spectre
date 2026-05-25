export interface LocalProfile {
  id: string;
  displayName: string;
  slug: string;
  lastLoginAt: string | null;
}

export interface ProfileRegistryEntry {
  id: string;
  displayName: string;
  slug: string;
  lastLoginAt: string | null;
}
