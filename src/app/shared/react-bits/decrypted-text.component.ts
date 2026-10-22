import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'react-bits-decrypted-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="decrypted-text-root">
      {{ text }}
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .decrypted-text-root {
      font-family: inherit;
      display: inline-flex;
      flex-wrap: wrap;
      white-space: pre-wrap;
      color: inherit;
    }
  `]
})
export class DecryptedTextComponent implements OnInit, OnChanges, OnDestroy {
  @Input() text: string = '';
  @Input() speed: number = 35; // ms per step
  @Input() maxIterations: number = 8;
  @Input() characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*~';

  public displayChars: string[] = [];
  public revealedIndices: Set<number> = new Set();
  public isAnimating: boolean = false;
  private timer: any;

  ngOnInit(): void {
    this.startDecryption();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && !changes['text'].firstChange) {
      this.startDecryption();
    }
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public startDecryption(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.displayChars = Array.from(this.text || '');
    this.isAnimating = false;
  }
}
