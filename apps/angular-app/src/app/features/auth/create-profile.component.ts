import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  templateUrl: './create-profile.component.html',
})
export class CreateProfileComponent implements OnInit {
  public readonly error = signal<string | null>(null);
  public form!: FormGroup;

  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      displayName: ['', (c: AbstractControl) => Validators.required(c)],
      password: ['', [(c: AbstractControl) => Validators.required(c), Validators.minLength(4)]],
      slug: ['', [(c: AbstractControl) => Validators.required(c), Validators.pattern(/^[a-z0-9-]+$/)]],
    });
  }

  public async submit(): Promise<void> {
    const v = this.form.getRawValue() as { displayName: string; password: string; slug: string };
    const res = await this.ipc.identity.createProfile(v);

    if (res.success) {
      await this.router.navigate(['/auth/login', v.slug]);
    } else {
      this.error.set(res.error?.message ?? 'Erro ao criar');
    }
  }
}
