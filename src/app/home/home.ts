import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ModelOption {
  id: 'model1' | 'model2' | 'model3';
  name: string;
  badge: string;
  icon: string;
  speedTag: string;
  isFastest?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  activeModelId: 'model1' | 'model2' | 'model3' = 'model1'; // Model 1 is the FASTEST DEFAULT model
  model1Url: SafeResourceUrl;
  model2Url: SafeResourceUrl;
  model3Url: SafeResourceUrl;
  isAmTime: boolean = true;
  detectedTimeString: string = '';

  readonly modelOptions: ModelOption[] = [
    {
      id: 'model1',
      name: 'Day Earth',
      badge: 'FAST',
      icon: '⚡',
      speedTag: 'Lightweight & Optimized (Fastest 60 FPS)',
      isFastest: true
    },
    {
      id: 'model2',
      name: 'Night Earth',
      badge: '16K',
      icon: '🌙',
      speedTag: '16K Ultra-High Resolution'
    },
    {
      id: 'model3',
      name: 'Planet Globe',
      badge: '3D',
      icon: '🪐',
      speedTag: 'Stylized Planetary Model'
    }
  ];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    // Model 1: Photorealistic Earth Globe (Day Mode) - Fast & Optimized (~1.2MB geometry)
    this.model1Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/c2e4294c32ea4d8b850e152fc26aeeb4/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_animations=0'
    );

    // Model 2: 16k High Resolution Earth (Night Mode) - Heavy 28MB asset
    this.model2Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/e2f01432233b4c0983583ba5066af83d/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_animations=0'
    );

    // Model 3: Planet Earth 3D Globe - Stylized shaders asset
    this.model3Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/8c08ad8c59184d83b170adc64e1f65c0/embed?autostart=1&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_animations=0'
    );
  }

  ngOnInit(): void {
    this.detectUserLocalTime();
    // Always default to Model 1 (Fastest & Optimized) for maximum initial speed
    this.activeModelId = 'model1';
  }

  detectUserLocalTime(): void {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    this.isAmTime = hours < 12;
    this.detectedTimeString = `${displayHours}:${mins} ${ampm}`;
  }

  get activeModelUrl(): SafeResourceUrl {
    switch (this.activeModelId) {
      case 'model2':
        return this.model2Url;
      case 'model3':
        return this.model3Url;
      case 'model1':
      default:
        return this.model1Url;
    }
  }

  get activeModelDetails(): ModelOption {
    return this.modelOptions.find(m => m.id === this.activeModelId) || this.modelOptions[0];
  }

  selectModel(modelId: 'model1' | 'model2' | 'model3'): void {
    this.activeModelId = modelId;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  enterWorldData(): void {
    this.router.navigate(['/world-data']);
  }
}

