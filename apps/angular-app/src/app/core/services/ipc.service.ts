import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class IpcService {
  readonly session = signal<{ displayName: string; slug: string } | null>(null);

  private get api() {
    if (!window.spectre) {
      throw new Error('Spectre API not available (run inside Electron)');
    }
    return window.spectre;
  }

  async healthcheck() {
    return this.api.healthcheck();
  }

  async init() {
    await this.api.initBenchmarkDb();
  }

  get identity() {
    return this.api.identity;
  }

  get institutions() {
    return this.api.institutions;
  }

  get accounts() {
    return this.api.accounts;
  }

  get assets() {
    return this.api.assets;
  }

  get portfolio() {
    return this.api.portfolio;
  }

  get allocation() {
    return this.api.allocation;
  }

  get benchmark() {
    return this.api.benchmark;
  }

  get contribution() {
    return this.api.contribution;
  }

  get rebalancing() {
    return this.api.rebalancing;
  }

  get brokerageNotes() {
    return this.api.brokerageNotes;
  }

  get patrimony() {
    return this.api.patrimony;
  }

  get tax() {
    return this.api.tax;
  }

  get import() {
    return this.api.import;
  }

  get documents() {
    return this.api.documents;
  }

  get valuation() {
    return this.api.valuation;
  }

  get analyticsApi() {
    return this.api.analyticsApi;
  }
}
