import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: './create-profile.component.html'
})
export class CreateProfileComponent {
  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  readonly error = signal<string | null>(null);

  form = this.fb.group({
  displayName: ['', Validators.required],
  password: ['', [Validators.required, Validators.minLength(4)]],
  slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]]
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
