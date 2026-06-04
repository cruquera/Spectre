import { Component, OnInit, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { IpcService } from '../../core/services/ipc.service';

type Block = { id: string; name: string; createdAt: string };
type Asset = { id: string; symbol: string; name: string };
type ScheduleEntry = { blockId: string; year: number; month: number };

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

@Component({
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './investment-blocks.component.html',
})
export class InvestmentBlocksComponent implements OnInit {
  public readonly blocks = signal<Block[]>([]);
  public readonly assets = signal<Asset[]>([]);
  public readonly schedule = signal<ScheduleEntry[]>([]);
  public readonly editingBlock = signal<Block | null>(null);
  public readonly selectedAssetIds = signal<Set<string>>(new Set());
  public readonly calendarYear = signal(new Date().getFullYear());
  public readonly loading = signal(false);
  public readonly msg = signal('');

  public form!: ReturnType<FormBuilder['group']>;
  protected readonly MONTHS = MONTHS;

  private readonly ipc = inject(IpcService);
  private readonly fb = inject(FormBuilder);

  public ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', (c: AbstractControl) => Validators.required(c)],
    });
    void this.loadAll();
  }

  public startCreate(): void {
    this.editingBlock.set(null);
    this.form.reset({ name: '' });
    this.selectedAssetIds.set(new Set());
    this.msg.set('');
  }

  public startEdit(block: Block): void {
    this.editingBlock.set(block);
    this.form.setValue({ name: block.name });
    this.selectedAssetIds.set(new Set());
    this.msg.set('');
  }

  public cancelEdit(): void {
    this.editingBlock.set(null);
    this.msg.set('');
  }

  public toggleAsset(assetId: string): void {
    const next = new Set(this.selectedAssetIds());

    if (next.has(assetId)) next.delete(assetId);
    else next.add(assetId);
    this.selectedAssetIds.set(next);
  }

  public async save(): Promise<void> {
    const name = (this.form.value as { name: string }).name.trim();

    if (!name) return;

    const edit = this.editingBlock();

    if (edit) {
      const res = await this.ipc.investmentBlocks.update({ id: edit.id, name });

      if (res.success) this.msg.set('Bloco atualizado');
      else this.msg.set(res.error?.message ?? 'Erro ao atualizar');
    } else {
      const res = await this.ipc.investmentBlocks.create({ assetIds: Array.from(this.selectedAssetIds()), name });

      if (res.success) this.msg.set('Bloco criado');
      else this.msg.set(res.error?.message ?? 'Erro ao criar');
    }

    this.editingBlock.set(null);
    await this.loadAll();
  }

  public async removeBlock(id: string): Promise<void> {
    const res = await this.ipc.investmentBlocks.remove({ id });

    if (res.success) this.msg.set('Bloco removido');
    else this.msg.set(res.error?.message ?? 'Erro ao remover');
    await this.loadAll();
  }

  public async setBlockForMonth(month: number, blockId: string): Promise<void> {
    const res = await this.ipc.investmentBlocks.setMonthlyBlock({
      blockId,
      month,
      year: this.calendarYear(),
    });

    if (res.success) {
      const sched = await this.ipc.investmentBlocks.getSchedule(this.calendarYear());

      if (sched.success) this.schedule.set(sched.data as never);
    }
  }

  public monthBlock(month: number): Block | undefined {
    const entry = this.schedule().find((s) => s.month === month);

    if (!entry) return undefined;

    return this.blocks().find((b) => b.id === entry.blockId);
  }

  public prevYear(): void {
    this.calendarYear.update((y) => y - 1);
    void this.loadAll();
  }

  public nextYear(): void {
    this.calendarYear.update((y) => y + 1);
    void this.loadAll();
  }

  private async loadAll(): Promise<void> {
    this.loading.set(true);
    try {
      const [blockRes, assetRes, schedRes] = await Promise.all([
        this.ipc.investmentBlocks.list(),
        this.ipc.assets.list(),
        this.ipc.investmentBlocks.getSchedule(this.calendarYear()),
      ]);

      if (blockRes.success) this.blocks.set(blockRes.data as never);
      if (assetRes.success) this.assets.set(assetRes.data as never);
      if (schedRes.success) this.schedule.set(schedRes.data as never);
    } finally {
      this.loading.set(false);
    }
  }
}
