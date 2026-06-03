import { JsonPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  imports: [JsonPipe],
  selector: 'sp-crud-list',
  standalone: true,
  templateUrl: './crud-list.component.html',
})
export class CrudListComponent {
  public readonly title = input.required<string>();
  public readonly addLabel = input('Adicionar');
  public readonly items = input<unknown[]>([]);
  public readonly error = input<string | null>(null);
  public readonly add = output<void>();
}
