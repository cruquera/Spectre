import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <form
        class="bg-spectre-surface p-8 rounded-lg w-full max-w-md border border-slate-700"
        [formGroup]="form"
        (ngSubmit)="submit()"
      >
        <h2 class="text-2xl font-bold mb-6">Login — {{ slug() }}</h2>
        @if (error()) {
          <p class="text-red-400 text-sm mb-4">{{ error() }}</p>
        }
        <label class="block text-sm mb-4">
          Senha / PIN
          <input
            type="password"
            formControlName="password"
            class="mt-1 w-full px-3 py-2 rounded bg-slate-800 border border-slate-600"
          />
        </label>
        <button
          type="submit"
          class="w-full py-2 rounded bg-spectre-accent hover:bg-blue-600 font-medium"
          [disabled]="form.invalid"
        >
          Entrar
        </button>
      </form>
    </div>
  `,
})
export class LoginComponent {
  slug = input.required<string>();
  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  async submit() {
    const res = await this.ipc.identity.login({
      slug: this.slug(),
      password: this.form.value.password,
    });
    if (res.success && res.data) {
      this.ipc.session.set({
        slug: this.slug(),
        displayName: (res.data as { displayName: string }).displayName,
      });
      await this.router.navigate(['/dashboard']);
    } else {
      this.error.set(res.error?.message ?? 'Falha no login');
    }
  }
}
