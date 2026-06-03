import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IpcService {
  public readonly session = signal<{ displayName: string; slug: string } | null>(null);

  private get api(): Window['spectre'] {
    if (!window.spectre) {
      throw new Error('Spectre API not available (run inside Electron)');
    }

    return window.spectre;
  }

  public async healthcheck(): ReturnType<Window['spectre']['healthcheck']> {
    return this.api.healthcheck();
  }

  public async init(): Promise<void> {
    await this.api.initBenchmarkDb();
  }

  public get identity(): Window['spectre']['identity'] {
    return this.api.identity;
  }

  public get institutions(): Window['spectre']['institutions'] {
    return this.api.institutions;
  }

  public get accounts(): Window['spectre']['accounts'] {
    return this.api.accounts;
  }

  public get assets(): Window['spectre']['assets'] {
    return this.api.assets;
  }

  public get portfolio(): Window['spectre']['portfolio'] {
    return this.api.portfolio;
  }

  public get allocation(): Window['spectre']['allocation'] {
    return this.api.allocation;
  }

  public get benchmark(): Window['spectre']['benchmark'] {
    return this.api.benchmark;
  }

  public get contribution(): Window['spectre']['contribution'] {
    return this.api.contribution;
  }

  public get rebalancing(): Window['spectre']['rebalancing'] {
    return this.api.rebalancing;
  }

  public get brokerageNotes(): Window['spectre']['brokerageNotes'] {
    return this.api.brokerageNotes;
  }

  public get patrimony(): Window['spectre']['patrimony'] {
    return this.api.patrimony;
  }

  public get tax(): Window['spectre']['tax'] {
    return this.api.tax;
  }

  public get import(): Window['spectre']['import'] {
    return this.api.import;
  }

  public get documents(): Window['spectre']['documents'] {
    return this.api.documents;
  }

  public get valuation(): Window['spectre']['valuation'] {
    return this.api.valuation;
  }

  public get analyticsApi(): Window['spectre']['analyticsApi'] {
    return this.api.analyticsApi;
  }
}
