# Template de Módulo Frontend

> Estrutura obrigatória para toda nova feature no pps/angular-app/src/app/features/.

## Estrutura de Diretórios

`
apps/angular-app/src/app/features/<module-name>/
├── <module-name>.component.ts    # Standalone component com Signals
├── <module-name>.component.html  # Template Tailwind sem JsonPipe
└── <module-name>.component.spec.ts  # Teste Karma/Jasmine
`

## Regras

### Component
`	ypescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IpcService } from '../../core/services/ipc.service';

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './<module-name>.component.html',
})
export class NomeComponent implements OnInit {
  public readonly data = signal<T | null>(null);
  public readonly loading = signal(false);
  public form!: ReturnType<FormBuilder['group']>;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      // campos com validators
    });
  }

  public async acao(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await this.ipc.<modulo>.<metodo>(...);
      if (res.success) this.data.set(res.data as never);
    } finally {
      this.loading.set(false);
    }
  }
}
`

### Template
- Usar exclusivamente classes Tailwind do tema spectre (g-spectre-bg, g-spectre-surface, 	ext-spectre-accent, 	ext-spectre-muted)
- Substituir {{ data | json }} por tabelas/componentes visuais
- Usar @if / @for (Angular 17+ control flow)

### Estado (loading/error/empty/data)

Sempre tratar:
| Estado | Ação |
|--------|------|
| loading() | Mostrar spinner ou esqueleto |
| error | Toast ou inline alert com mensagem |
| data === null | Empty state com CTA |
| data !== null | Renderizar conteúdo |

## Registro

1. Adicionar rota lazy em pp.routes.ts:
`	ypescript
{
  loadComponent: () => import('./features/<module>/<module>.component').then(m => m.NomeComponent),
  path: '<module>',
}
`
2. Adicionar getter no IpcService:
`	ypescript
public get <modulo>(): Window['spectre']['<modulo>'] {
  return this.api.<modulo>;
}
`
3. Adicionar nav item no shell.component.ts (se for página principal)

## Checklist

- [ ] Component criado com Signals e ReactiveForms
- [ ] Template sem JsonPipe, com Tailwind spectre
- [ ] Estados loading/error/empty tratados
- [ ] Rota registrada
- [ ] Getter no IpcService
- [ ] Teste Karma/Jasmine criado
- [ ] Nav item adicionado (se aplicável)
- [ ] 
pm run lint — zero erros
