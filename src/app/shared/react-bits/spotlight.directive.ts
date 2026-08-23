import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[reactBitsSpotlight]',
  standalone: true
})
export class SpotlightDirective {
  @Input() spotlightColor: string = 'rgba(0, 242, 254, 0.15)';
  @Input() spotlightRadius: number = 350;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.renderer.setStyle(this.el.nativeElement, '--mouse-x', `${x}px`);
    this.renderer.setStyle(this.el.nativeElement, '--mouse-y', `${y}px`);
  }
}
