import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WorldBankService, WorldBankTopic, WorldBankIndicator, WorldBankDataPoint } from '../world-bank.service';

export interface FeaturedIndicatorPill {
  id: string;
  icon: string;
  label: string;
  topicId: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  activeModelId: 'model1' | 'model2' | 'model3' = 'model1';
  model1Url: SafeResourceUrl;
  model2Url: SafeResourceUrl;
  model3Url: SafeResourceUrl;
  isAmTime: boolean = true;
  detectedTimeString: string = '';

  // World Data API Indicators Hub State
  wbTopics: WorldBankTopic[] = [];
  selectedTopicId: number = 3; // Economy & Growth
  activeIndicatorsList: WorldBankIndicator[] = [];
  selectedIndicatorId: string = 'NY.GDP.MKTP.CD';
  selectedIndicatorName: string = 'GDP (current US$)';
  selectedCountryCode: string = 'us';
  selectedCountryName: string = 'United States';
  indicatorDataPoints: WorldBankDataPoint[] = [];
  isLoadingIndicator: boolean = false;
  isIndicatorDrawerOpen: boolean = false;

  featuredPresets: FeaturedIndicatorPill[] = [
    { id: 'NY.GDP.MKTP.CD', icon: '💰', label: 'GDP Growth', topicId: 3 },
    { id: 'SP.POP.TOTL', icon: '👥', label: 'Population', topicId: 21 },
    { id: 'WHO:WHOSIS_000001', icon: '🩺', label: 'Life Expectancy', topicId: 8 },
    { id: 'EN.ATM.CO2E.KT', icon: '🌱', label: 'CO2 Emissions', topicId: 19 },
    { id: 'EG.ELC.ACCS.ZS', icon: '⚡', label: 'Electricity Access', topicId: 5 },
    { id: 'IT.NET.USER.ZS', icon: '💻', label: 'Internet Access', topicId: 10 },
    { id: 'SL.UEM.TOTL.ZS', icon: '📊', label: 'Unemployment Rate', topicId: 3 },
    { id: 'UN:1.1.1', icon: '🌾', label: 'Poverty Ratio', topicId: 11 }
  ];

  popularCountries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'in', name: 'India', flag: '🇮🇳' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'br', name: 'Brazil', flag: '🇧🇷' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'ng', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'za', name: 'South Africa', flag: '🇿🇦' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' }
  ];

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private wbService: WorldBankService,
    private cdr: ChangeDetectorRef
  ) {
    // Model 1: Photorealistic Earth Globe (Day Mode)
    this.model1Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/c2e4294c32ea4d8b850e152fc26aeeb4/embed?autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0'
    );

    // Model 2: 16k High Resolution Earth (Night Mode)
    this.model2Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/e2f01432233b4c0983583ba5066af83d/embed?autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0'
    );

    // Model 3: Planet Earth 3D Globe by v7x
    this.model3Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://sketchfab.com/models/8c08ad8c59184d83b170adc64e1f65c0/embed?autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0'
    );
  }

  ngOnInit(): void {
    this.autoDetectUserDayNightModel();
    this.initWorldDataHub();
  }

  initWorldDataHub(): void {
    this.wbTopics = this.wbService.getTopics();
    if (this.wbTopics.length > 0) {
      this.selectTopic(3); // Default topic 3: Economy & Growth
    }
    this.fetchIndicatorTelemetry(this.selectedIndicatorId, this.selectedCountryCode);
  }

  selectTopic(topicId: number): void {
    this.selectedTopicId = topicId;
    this.activeIndicatorsList = this.wbService.getIndicatorsByTopic(topicId);
    if (this.activeIndicatorsList.length > 0) {
      const first = this.activeIndicatorsList[0];
      this.selectedIndicatorId = first.id;
      this.selectedIndicatorName = first.name;
      this.fetchIndicatorTelemetry(first.id, this.selectedCountryCode);
    }
    this.cdr.markForCheck();
  }

  selectFeaturedPreset(preset: FeaturedIndicatorPill): void {
    this.selectedTopicId = preset.topicId;
    this.activeIndicatorsList = this.wbService.getIndicatorsByTopic(preset.topicId);
    const found = this.activeIndicatorsList.find(i => i.id === preset.id);
    this.selectedIndicatorId = preset.id;
    this.selectedIndicatorName = found ? found.name : preset.label;
    this.fetchIndicatorTelemetry(preset.id, this.selectedCountryCode);
    this.cdr.markForCheck();
  }

  selectIndicatorFromDropdown(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const indId = target.value;
    const found = this.activeIndicatorsList.find(i => i.id === indId);
    if (found) {
      this.selectedIndicatorId = found.id;
      this.selectedIndicatorName = found.name;
      this.fetchIndicatorTelemetry(found.id, this.selectedCountryCode);
    }
  }

  selectCountry(code: string): void {
    this.selectedCountryCode = code;
    const cObj = this.popularCountries.find(c => c.code === code);
    if (cObj) {
      this.selectedCountryName = cObj.name;
    }
    this.fetchIndicatorTelemetry(this.selectedIndicatorId, code);
  }

  fetchIndicatorTelemetry(indicatorId: string, countryCode: string): void {
    this.isLoadingIndicator = true;
    this.cdr.markForCheck();

    this.wbService.getIndicatorData(countryCode, indicatorId).subscribe({
      next: (points) => {
        this.indicatorDataPoints = points;
        this.isLoadingIndicator = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.indicatorDataPoints = this.wbService.generateFallbackDataPoints(countryCode, indicatorId);
        this.isLoadingIndicator = false;
        this.cdr.markForCheck();
      }
    });
  }

  get latestValueFormatted(): string {
    if (this.indicatorDataPoints.length === 0) return 'N/A';
    const last = this.indicatorDataPoints[this.indicatorDataPoints.length - 1];
    if (!last || last.value === null) return 'N/A';

    const val = last.value;
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)} Million`;
    return val.toLocaleString();
  }

  get latestYear(): number {
    if (this.indicatorDataPoints.length === 0) return 2024;
    return this.indicatorDataPoints[this.indicatorDataPoints.length - 1].year;
  }

  get sparklineSvgPath(): string {
    if (this.indicatorDataPoints.length < 2) return '';
    const width = 280;
    const height = 50;
    const values = this.indicatorDataPoints.map(p => p.value || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = this.indicatorDataPoints.map((pt, i) => {
      const x = (i / (this.indicatorDataPoints.length - 1)) * width;
      const y = height - (((pt.value || 0) - min) / range) * (height - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${points.join(' L ')}`;
  }

  toggleIndicatorDrawer(): void {
    this.isIndicatorDrawerOpen = !this.isIndicatorDrawerOpen;
    this.cdr.markForCheck();
  }

  autoDetectUserDayNightModel(): void {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    this.isAmTime = hours < 12;
    this.detectedTimeString = `${displayHours}:${mins} ${ampm}`;

    if (hours >= 6 && hours < 18) {
      this.activeModelId = 'model1';
    } else {
      this.activeModelId = 'model2';
    }
  }

  selectModel(model: 'model1' | 'model2' | 'model3'): void {
    this.activeModelId = model;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  enterWorldData(): void {
    this.router.navigate(['/world-data']);
  }
}
