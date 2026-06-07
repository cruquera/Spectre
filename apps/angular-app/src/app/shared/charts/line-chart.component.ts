import { Component, input } from '@angular/core';

export type LineChartSeries = {
  label: string;
  color: string;
  data: Array<{ x: string | number; y: number }>;
};

@Component({
  selector: 'sp-line-chart',
  standalone: true,
  template: `
    <div class="relative" [style.height.px]="height()">
      @if (series().length === 0) {
        <div class="flex items-center justify-center h-full text-sm text-slate-500">
          Sem dados disponíveis
        </div>
      } @else {
        <svg class="w-full h-full" [attr.viewBox]="'0 0 ' + width() + ' ' + height()" preserveAspectRatio="xMidYMid meet">
          @for (line of series(); track line.label; let idx = $index) {
            <polyline
              [attr.points]="getPoints(line)"
              [attr.stroke]="line.color"
              fill="none"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            />
          }
          @for (point of dots(); track $index) {
            <circle
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="3"
              [attr.fill]="point.color"
            />
          }
        </svg>
      }
    </div>
  `,
})
export class LineChartComponent {
  public readonly series = input<LineChartSeries[]>([]);
  public readonly width = input(400);
  public readonly height = input(200);

  private readonly padding = { bottom: 20, left: 40, right: 10, top: 10 };

  public dots(): Array<{ color: string; x: number; y: number }> {
    const result: Array<{ color: string; x: number; y: number }> = [];

    for (const line of this.series()) {
      for (const point of line.data) {
        const { x, y } = this.project(point.x as number, point.y, line.data);

        result.push({ color: line.color, x, y });
      }
    }

    return result;
  }

  public getPoints(line: LineChartSeries): string {
    return line.data
      .map((p) => {
        const { x, y } = this.project(p.x as number, p.y, line.data);

        return `${x},${y}`;
      })
      .join(' ');
  }

  private project(x: number, y: number, all: Array<{ x: string | number; y: number }>): { x: number; y: number } {
    const allY = all.map((p) => p.y);
    const maxX = all.length - 1;
    const minY = Math.min(...allY, 0);
    const maxY = Math.max(...allY, 1);
    const idx = all.findIndex((p) => p.x === x);

    const px = this.padding.left + (idx / (maxX || 1)) * (this.width() - this.padding.left - this.padding.right);
    const py = this.height() - this.padding.bottom - ((y - minY) / (maxY - minY || 1)) * (this.height() - this.padding.top - this.padding.bottom);

    return { x: px, y: py };
  }
}
