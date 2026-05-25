import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-spectre-surface p-8 rounded-lg w-full max-w-md border border-slate-700">
        <h2 class="text-2xl font-bold mb-6">Selecionar perfil</h2>
        @if (error()) {
          <p class="text-red-400 text-sm mb-4">{{ error() }}</p>
        }
        <ul class="space-y-2 mb-6">
          @for (p of profiles(); track p.slug) {
            <li>
              <a
                [routerLink]="['/auth/login', p.slug]"
                class="block px-4 py-3 rounded bg-slate-800 hover:bg-slate-700"
                >{{ p.displayName }}</a
              >
            </li>
          } @empty {
            <p class="text-slate-400 text-sm">Nenhum perfil. Crie o primeiro.</p>
          }
        </ul>
        <a routerLink="/auth/create" class="text-spectre-accent hover:underline text-sm"
          >Criar novo perfil</a
        >
      </div>
    </div>
  `,
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
      this.error.set(e instanceof Error ? e.message : 'API indisponível');
    }
  }
}
