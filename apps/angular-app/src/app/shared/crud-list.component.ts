import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  imports: [JsonPipe],
  selector: 'sp-crud-list',
  standalone: true,
  templateUrl: './crud-list.component.html'
})
export class CrudListComponent {
  title = input.required<string>();
  addLabel = input('Adicionar');
  items = input<unknown[]>([]);
  error = input<string | null>(null);
  add = output<void>();
}
