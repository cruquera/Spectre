import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

const AVATAR_COLORS = [
  '#e50914', '#ff6b35', '#ffc107', '#4caf50', '#2196f3',
  '#9c27b0', '#ff4081', '#00bcd4', '#ff9800', '#607d8b',
  '#795548', '#03a9f4', '#8bc34a', '#e91e63', '#009688',
];

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: './profile-select.component.html',
})
export class ProfileSelectComponent implements OnInit {
  public readonly profiles = signal<Array<{ username: string; displayName: string }>>([]);
  public readonly error = signal<string | null>(null);
  public readonly selectedProfile = signal<string | null>(null);
  public readonly loggingIn = signal(false);
  public form: FormGroup;

  public readonly hashColor = hashColor;
  public readonly initials = initials;

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public constructor() {
    this.form = this.fb.group({
      password: ['', [(c: AbstractControl) => Validators.required(c), Validators.minLength(4)]],
    });
  }

  public ngOnInit(): void {
    void this.loadProfiles();
  }

  public selectProfile(username: string): void {
    this.selectedProfile.set(username);
    this.error.set(null);
    this.form.reset();
  }

  public backToSelection(): void {
    this.selectedProfile.set(null);
    this.error.set(null);
  }

  public async submit(): Promise<void> {
    const username = this.selectedProfile();

    if (!username || this.form.invalid) return;

    this.loggingIn.set(true);
    this.error.set(null);

    const v = this.form.value as { password: string };
    const res = await this.ipc.identity.login({
      password: v.password,
      username,
    });

    if (res.success) {
      this.ipc.session.set({
        displayName: res.data.displayName,
        username,
      });

      const tourRes = await this.ipc.tour.getState();

      if (tourRes.success && tourRes.data.completed) {
        await this.router.navigate(['/dashboard']);
      } else {
        await this.router.navigate(['/tour']);
      }
    } else {
      this.error.set('Senha incorreta');
      this.loggingIn.set(false);
    }
  }

  private async loadProfiles(): Promise<void> {
    try {
      await this.ipc.init();
      const res = await this.ipc.identity.listProfiles();

      if (res.success) {
        this.profiles.set(res.data as Array<{ username: string; displayName: string }>);
      } else {
        this.error.set(res.error?.message ?? 'Erro');
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'API indisponível');
    }
  }
}
