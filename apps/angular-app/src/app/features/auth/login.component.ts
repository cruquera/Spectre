import { Component, OnInit, inject, input, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public readonly slug = input.required<string>();
  public readonly error = signal<string | null>(null);
  public form!: FormGroup;

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [(c: AbstractControl) => Validators.required(c), Validators.minLength(4)]],
    });
  }

  public async submit(): Promise<void> {
    const v = this.form.value as { password: string };
    const res = await this.ipc.identity.login({
      password: v.password,
      slug: this.slug(),
    });

    if (res.success && res.data) {
      this.ipc.session.set({
        displayName: (res.data).displayName,
        slug: this.slug(),
      });
      await this.router.navigate(['/dashboard']);
    } else {
      this.error.set(res.error?.message ?? 'Falha no login');
    }
  }
}
