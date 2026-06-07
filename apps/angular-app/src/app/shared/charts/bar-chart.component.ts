import { Component, input } from '@angular/core';

export type BarChartItem = {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
};

@Component({
  selector: 'sp-bar-chart',
  standalone: true,
  template: `
    <div class="space-y-3">
      @for (item of items(); track $index) {
        <div>
          <div class="flex justify-between text-sm mb-1">
            <span class="text-slate-300">{{ item.label }}</span>
            <span class="text-white font-medium">{{ formatValue(item.value) }}</span>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-2.5">
            <div
              class="h-2.5 rounded-full transition-all duration-500"
              [style.width.%]="barWidth(item)"
              [style.background]="item.color ?? 'var(--spectre-accent, #8b5cf6)'"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class BarChartComponent {
  public readonly items = input<BarChartItem[]>([]);
  public readonly maxValue = input<number>(0);
  public readonly currency = input(false);

  public barWidth(item: BarChartItem): number {
    const max = this.maxValue() || Math.max(...this.items().map((i) => i.value), 1);

    return (item.value / max) * 100;
  }

  public formatValue(value: number): string {
    if (this.currency()) {
      return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2, style: 'currency' }).format(value);
    }

    return `${value.toFixed(1)}%`;
  }
}
