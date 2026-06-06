import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentBlocksComponent } from './investment-blocks.component';

describe('InvestmentBlocksComponent', () => {
  let _component: InvestmentBlocksComponent;
  let fixture: ComponentFixture<InvestmentBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentBlocksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentBlocksComponent);
    _component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the title', () => {
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('h2')?.textContent).toContain('Blocos');
  });
});
