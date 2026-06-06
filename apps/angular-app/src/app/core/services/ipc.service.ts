import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IpcService {
  public readonly session = signal<{ displayName: string; username: string } | null>(null);

  public async init(): Promise<void> {
    const res = await this.api.identity.session();

    if (res.success && res.data) {
      this.session.set(res.data);
    }
  }

  private get api(): Window['spectre'] {
    if (!window.spectre) {
      throw new Error('Spectre API not available (run inside Electron)');
    }

    return window.spectre;
  }

  public get identity(): Window['spectre']['identity'] {
    return this.api.identity;
  }

  public get tour(): Window['spectre']['tour'] {
    return this.api.tour;
  }

  public get accounts(): Window['spectre']['accounts'] {
    return this.api.accounts;
  }

  public get portfolioProjects(): Window['spectre']['portfolioProjects'] {
    return this.api.portfolioProjects;
  }
}
