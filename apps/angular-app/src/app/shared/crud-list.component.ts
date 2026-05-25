import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sp-crud-list',
  standalone: true,
  template: `
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">{{ title() }}</h2>
      <button
        class="px-4 py-2 rounded bg-spectre-accent text-sm"
        (click)="add.emit()"
      >
        {{ addLabel() }}
      </button>
    </div>
    @if (error()) {
      <p class="text-red-400 mb-2">{{ error() }}</p>
    }
    <ul class="space-y-2">
      @for (item of items(); track $index) {
        <li class="px-4 py-3 bg-spectre-surface rounded border border-slate-700 text-sm">
          <ng-content select="[item]" />
          <pre class="text-xs text-slate-500 mt-1 overflow-auto">{{ item | json }}</pre>
        </li>
      } @empty {
        <li class="text-slate-500 text-sm">Nenhum registro.</li>
      }
    </ul>
  `,
})
export class CrudListComponent {
  title = input.required<string>();
  addLabel = input('Adicionar');
  items = input<unknown[]>([]);
  error = input<string | null>(null);
  add = output<void>();
}
