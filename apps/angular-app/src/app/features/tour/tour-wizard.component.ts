import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

type Account = { id: string; institutionName: string; nickname: string; currency: string };

@Component({
  imports: [FormsModule],
  standalone: true,
  templateUrl: './tour-wizard.component.html',
})
export class TourWizardComponent implements OnInit {
  public readonly steps = [
    { label: 'Cadastro de Contas', number: 1 },
    { label: 'Projeto de Carteira', number: 2 },
  ];

  public readonly institutions = [
    'Banco Inter',
    'Banco Safra',
    'Nubank',
    'Nomad',
    'Banco Inter Global',
  ] as const;

  public readonly accounts = signal<Account[]>([]);
  public readonly currentStep = signal(1);
  public readonly saving = signal(false);

  public institutionName = '';
  public nickname = '';
  public currency = 'BRL';

  public get isFirstStep(): boolean {
    return this.currentStep() === 1;
  }

  public get isLastStep(): boolean {
    return this.currentStep() === this.steps.length;
  }

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);

  public async ngOnInit(): Promise<void> {
    await this.loadAccounts();
  }

  public async addAccount(): Promise<void> {
    if (!this.institutionName || !this.nickname || !this.currency) return;

    this.saving.set(true);

    try {
      const res = await this.ipc.accounts.create({
        institutionName: this.institutionName,
        nickname: this.nickname,
        currency: this.currency,
      });

      if (res.success) {
        this.accounts.update((list) => [...list, res.data]);
        this.institutionName = '';
        this.nickname = '';
        this.currency = 'BRL';
      }
    } finally {
      this.saving.set(false);
    }
  }

  public async removeAccount(id: string): Promise<void> {
    const res = await this.ipc.accounts.delete(id);

    if (res.success) {
      this.accounts.update((list) => list.filter((a) => a.id !== id));
    }
  }

  public nextStep(): void {
    if (this.isFirstStep && this.accounts().length === 0) return;

    if (this.isLastStep) {
      void this.completeTour();
    } else {
      this.currentStep.update((s) => s + 1);
    }
  }

  public prevStep(): void {
    if (this.isFirstStep) return;
    this.currentStep.update((s) => s - 1);
  }

  public async exitTour(): Promise<void> {
    await this.ipc.tour.abort();
    await this.router.navigate(['/']);
  }

  private async loadAccounts(): Promise<void> {
    const res = await this.ipc.accounts.list();

    if (res.success) {
      this.accounts.set(res.data);
    }
  }

  private async completeTour(): Promise<void> {
    await this.ipc.tour.complete();
    await this.router.navigate(['/dashboard']);
  }
}
