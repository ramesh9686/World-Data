import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'react-bits-decrypted-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="decrypted-text-root" [class.animating]="isAnimating">
      <span *ngFor="let char of displayChars; let i = index" class="char-span" [class.revealed]="revealedIndices.has(i)">
        {{ char }}
      </span>
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
    }
    .char-span {
      display: inline-block;
      transition: color 0.15s ease, text-shadow 0.15s ease;
    }
    .char-span:not(.revealed) {
      color: var(--accent-neon, #00f2fe);
      opacity: 0.85;
      text-shadow: 0 0 8px rgba(0, 242, 254, 0.7);
    }
    .char-span.revealed {
      color: inherit;
      opacity: 1;
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

    const target = this.text || '';
    this.displayChars = target.split('').map(c => (c === ' ' ? ' ' : this.getRandomChar()));
    this.revealedIndices.clear();
    this.isAnimating = true;

    let step = 0;
    const totalSteps = target.length + this.maxIterations;

    this.timer = setInterval(() => {
      step++;
      const revealCount = Math.floor((step / totalSteps) * target.length);

      for (let i = 0; i < target.length; i++) {
        if (i < revealCount || target[i] === ' ') {
          this.displayChars[i] = target[i];
          this.revealedIndices.add(i);
        } else {
          this.displayChars[i] = this.getRandomChar();
        }
      }

      if (this.revealedIndices.size >= target.length || step >= totalSteps * 1.5) {
        this.displayChars = target.split('');
        for (let i = 0; i < target.length; i++) this.revealedIndices.add(i);
        this.isAnimating = false;
        clearInterval(this.timer);
      }
    }, this.speed);
  }

  private getRandomChar(): string {
    return this.characters[Math.floor(Math.random() * this.characters.length)];
  }
}
