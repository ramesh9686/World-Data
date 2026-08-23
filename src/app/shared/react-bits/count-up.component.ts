import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'react-bits-count-up',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="count-up-value">
      {{ prefix }}{{ formattedValue }}{{ suffix }}
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .count-up-value {
      font-family: inherit;
      font-variant-numeric: tabular-nums;
      display: inline-block;
      transition: color 0.2s ease;
    }
  `]
})
export class CountUpComponent implements OnInit, OnChanges {
  @Input() to: number = 0;
  @Input() from: number = 0;
  @Input() duration: number = 1200; // ms
  @Input() decimals: number = 0;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() separator: string = ',';

  public currentValue: number = 0;
  private animationFrameId: any;

  ngOnInit(): void {
    this.animateCount(this.from, this.to);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['to'] && !changes['to'].firstChange) {
      const prev = changes['to'].previousValue || 0;
      this.animateCount(prev, this.to);
    }
  }

  private animateCount(start: number, end: number): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const startTime = performance.now();
    const duration = this.duration;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease Out Cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.currentValue = start + (end - start) * ease;

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(tick);
      } else {
        this.currentValue = end;
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }

  public get formattedValue(): string {
    const num = Number(this.currentValue).toFixed(this.decimals);
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.separator);
    return parts.join('.');
  }
}
