import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DecryptedTextComponent, CountUpComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DecryptedTextComponent, CountUpComponent, SpotlightDirective],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  // Frozen single fastest 60FPS 3D Earth Globe model (optimized geometry, ~1.2MB, instant load)
  public readonly fastEarthModelUrl: SafeResourceUrl;
  public detectedTimeString: string = '';
  public fpsCount: number = 60;

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    // Single Frozen High-Speed 60FPS Photorealistic Earth Globe Model
    this.fastEarthModelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/c2e4294c32ea4d8b850e152fc26aeeb4/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_animations=0'
    );
  }

  ngOnInit(): void {
    this.detectUserLocalTime();
  }

  private detectUserLocalTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    this.detectedTimeString = `${displayHours}:${mins} ${ampm}`;
  }

  public enterWorldData(): void {
    this.router.navigate(['/world-data']);
  }
}
