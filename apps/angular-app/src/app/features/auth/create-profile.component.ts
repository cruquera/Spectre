import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <form
        class="bg-spectre-surface p-8 rounded-lg w-full max-w-md border border-slate-700"
        [formGroup]="form"
        (ngSubmit)="submit()"
      >
        <h2 class="text-2xl font-bold mb-6">Criar perfil</h2>
        @if (error()) {
          <p class="text-red-400 text-sm mb-4">{{ error() }}</p>
        }
        <label class="block text-sm mb-3">
          Nome
          <input formControlName="displayName" class="mt-1 w-full px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        </label>
        <label class="block text-sm mb-3">
          Slug (a-z, 0-9, -)
          <input formControlName="slug" class="mt-1 w-full px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        </label>
        <label class="block text-sm mb-4">
          Senha / PIN
          <input type="password" formControlName="password" class="mt-1 w-full px-3 py-2 rounded bg-slate-800 border border-slate-600" />
        </label>
        <button type="submit" class="w-full py-2 rounded bg-spectre-accent font-medium" [disabled]="form.invalid">
          Criar
        </button>
        <a routerLink="/auth" class="block mt-4 text-sm text-slate-400 hover:underline">Voltar</a>
      </form>
    </div>
  `,
})
export class CreateProfileComponent {
  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
    displayName: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  async submit() {
    const v = this.form.getRawValue();
    const res = await this.ipc.identity.createProfile(v);
    if (res.success) {
      await this.router.navigate(['/auth/login', v.slug]);
    } else {
      this.error.set(res.error?.message ?? 'Erro ao criar');
    }
  }
}
