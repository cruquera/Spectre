import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [RouterLink],
  standalone: true,
  templateUrl: './profile-select.component.html'
})
export class ProfileSelectComponent implements OnInit {
  private readonly ipc = inject(IpcService);
  private readonly router = inject(Router);
  readonly profiles = signal<Array<{ slug: string; displayName: string }>>([]);
  readonly error = signal<string | null>(null);

  async ngOnInit() {
    try {
      await this.ipc.init();
      const res = await this.ipc.identity.listProfiles();

      if (res.success) {
        this.profiles.set(res.data as Array<{ slug: string; displayName: string }>);
      } else {
        this.error.set(res.error?.message ?? 'Erro');
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'API indispon??vel');
    }
  }
}
