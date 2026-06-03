import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html'
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
  password: this.form.value.password,
  slug: this.slug()
});

    if (res.success && res.data) {
      this.ipc.session.set({
  displayName: (res.data).displayName,
  slug: this.slug()
});
      await this.router.navigate(['/dashboard']);
    } else {
      this.error.set(res.error?.message ?? 'Falha no login');
    }
  }
}
