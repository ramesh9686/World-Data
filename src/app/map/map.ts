import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../country';
import { COUNTRIES_DATA } from '../countries-data';
import { RealtimeDataService, RealtimeData } from '../realtime-data.service';
import { WorldBankService } from '../world-bank.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  // 3D View properties
  viewMode: '2d' | '3d' = '2d';
  tiltStyle = '';

  selectedCountry = '';
  countryData: CountryData | null = null;
  realtimeData: RealtimeData | null = null;
  loading = false;
  loadingRealtime = false;
  error = false;

  // World Bank Indicators properties
  wbTopics: any[] = [];
  selectedTopicId: number | null = null;
  wbIndicators: any[] = [];
  filteredIndicators: any[] = [];
  selectedIndicatorId = '';
  selectedIndicatorName = '';
  selectedIndicatorDesc = '';
  indicatorSearchText = '';
  wbIndicatorData: any[] = [];
  
  loadingIndicators = false;
  loadingIndicatorData = false;
  indicatorError = false;

  // Ambient Telemetry Nodes & Arcs for Holographic HUD Surface
  ambientNodes = [
    { id: 'ny', label: 'NYC', cx: 250, cy: 230, delay: '0s' },
    { id: 'la', label: 'LAX', cx: 160, cy: 230, delay: '1.4s' },
    { id: 'ldn', label: 'LHR', cx: 475, cy: 185, delay: '0.7s' },
    { id: 'dxb', label: 'DXB', cx: 632, cy: 280, delay: '2.1s' },
    { id: 'tyo', label: 'HND', cx: 860, cy: 240, delay: '1.1s' },
    { id: 'sin', label: 'SIN', cx: 770, cy: 370, delay: '2.8s' },
    { id: 'syd', label: 'SYD', cx: 890, cy: 510, delay: '0.4s' },
    { id: 'sao', label: 'GRU', cx: 330, cy: 460, delay: '1.9s' },
    { id: 'cai', label: 'CAI', cx: 550, cy: 260, delay: '2.5s' },
    { id: 'jnb', label: 'JNB', cx: 540, cy: 490, delay: '3.2s' },
    { id: 'bom', label: 'BOM', cx: 690, cy: 300, delay: '1.6s' }
  ];

  ambientArcs = [
    { d: 'M 250 230 Q 360 140 475 185', duration: '6s', delay: '0s' },
    { d: 'M 475 185 Q 550 210 632 280', duration: '5s', delay: '1s' },
    { d: 'M 632 280 Q 750 190 860 240', duration: '7s', delay: '2s' },
    { d: 'M 860 240 Q 820 300 770 370', duration: '5.5s', delay: '0.5s' },
    { d: 'M 770 370 Q 850 430 890 510', duration: '6.5s', delay: '1.5s' },
    { d: 'M 475 185 Q 380 320 330 460', duration: '8s', delay: '2.5s' },
    { d: 'M 632 280 Q 660 285 690 300', duration: '4s', delay: '0.8s' },
    { d: 'M 550 260 Q 570 370 540 490', duration: '7.5s', delay: '1.2s' },
    { d: 'M 160 230 Q 205 220 250 230', duration: '4.5s', delay: '3s' }
  ];

  constructor(
    private countryService: CountryService,
    private realtimeService: RealtimeDataService,
    private wbService: WorldBankService,
    private cdr: ChangeDetectorRef
  ) {
    this.wbTopics = this.wbService.getTopics();
  }

  setViewMode(mode: '2d' | '3d'): void {
    this.viewMode = mode;
    if (mode === '2d') {
      this.tiltStyle = '';
    }
    this.cdr.detectChanges();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.viewMode !== '3d') {
      this.tiltStyle = '';
      return;
    }
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Normalize coordinates from -0.5 to 0.5
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    
    // Calculate tilt angles based on cursor offset
    const tiltX = py * 12;  // Up to +/- 12 degrees X rotation
    const tiltY = -px * 12; // Up to +/- 12 degrees Y rotation
    
    this.tiltStyle = `perspective(1200px) rotateX(${32 + tiltX}deg) rotateY(${-6 + tiltY}deg) rotateZ(-12deg)`;
    this.cdr.detectChanges();
  }

  onMouseLeave(): void {
    this.tiltStyle = '';
    this.cdr.detectChanges();
  }

  onCountrySelected(event: MouseEvent): void {
    const target = event.target as SVGElement;

    if (target.tagName !== 'path') {
      return;
    }

    // Remove previous selection
    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }

    // Highlight new selection
    target.classList.add('selected');

    const countryCode = target.id;
    if (countryCode) {
      this.selectedCountry = countryCode;
      this.fetchCountryData(countryCode);
    }
  }

  getCountryCodeFromIso3(iso3: string): string {
    const code = Object.keys(COUNTRIES_DATA).find(
      (key) => COUNTRIES_DATA[key].id.toLowerCase() === iso3.toLowerCase()
    );
    return code || '';
  }

  getCountryNameFromIso3(iso3: string): string {
    const code = this.getCountryCodeFromIso3(iso3);
    return code ? COUNTRIES_DATA[code].name : iso3;
  }

  selectNeighbour(iso3: string): void {
    const code = this.getCountryCodeFromIso3(iso3);
    if (!code) {
      return;
    }

    // Highlight the path in the SVG
    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }

    const path = document.getElementById(code.toLowerCase());
    if (path) {
      path.classList.add('selected');
      path.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    this.selectedCountry = code;
    this.fetchCountryData(code);
  }

  getWindDirectionLabel(degrees: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(degrees / 22.5) % 16;
    return dirs[idx];
  }

  // World Bank Indicators Methods — all indicator data is now loaded instantly from static data
  selectTopic(topicId: number): void {
    this.selectedTopicId = topicId;
    this.indicatorError = false;
    this.wbIndicatorData = [];
    this.indicatorSearchText = '';

    // Load ALL indicators instantly (0ms) from pre-bundled static data
    const indicators = this.wbService.getIndicatorsByTopic(topicId);
    this.wbIndicators = indicators;
    this.filteredIndicators = indicators;
    this.loadingIndicators = false;

    if (indicators.length > 0) {
      this.selectIndicator(indicators[0].id, indicators[0].name, indicators[0].sourceNote);
    }
  }

  onSearchInput(event: Event): void {
    this.indicatorSearchText = (event.target as HTMLInputElement).value;
    this.filterIndicators();
  }

  filterIndicators(): void {
    const q = this.indicatorSearchText.toLowerCase().trim();
    if (!q) {
      this.filteredIndicators = this.wbIndicators;
    } else {
      this.filteredIndicators = this.wbIndicators.filter(
        ind => ind.name.toLowerCase().includes(q) || ind.id.toLowerCase().includes(q)
      );
    }
  }

  selectIndicator(id: string, name: string, desc?: string): void {
    this.selectedIndicatorId = id;
    this.selectedIndicatorName = name;
    this.selectedIndicatorDesc = desc || '';
    this.fetchIndicatorData();
  }

  fetchIndicatorData(): void {
    if (!this.countryData || !this.selectedIndicatorId) {
      return;
    }
    this.loadingIndicatorData = true;
    this.wbIndicatorData = [];
    this.cdr.detectChanges();
    
    this.wbService.getIndicatorData(this.countryData.id, this.selectedIndicatorId).subscribe({
      next: (data) => {
        this.wbIndicatorData = data;
        this.loadingIndicatorData = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingIndicatorData = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Chart computations
  get chartPoints(): { year: number, value: number }[] {
    return this.wbIndicatorData.filter(d => d.value !== null) as { year: number, value: number }[];
  }

  get svgPath(): string {
    const points = this.chartPoints;
    if (points.length < 2) return '';

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    return points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.year)} ${yScale(p.value)}`)
      .join(' ');
  }

  get svgAreaPath(): string {
    const points = this.chartPoints;
    if (points.length < 2) return '';

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    const linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.year)} ${yScale(p.value)}`)
      .join(' ');

    const firstX = xScale(points[0].year);
    const lastX = xScale(points[points.length - 1].year);
    const bottomY = height - padding;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }

  get chartDots(): { year: number, value: number, cx: number, cy: number, formattedValue: string }[] {
    const points = this.chartPoints;
    if (points.length === 0) return [];

    const minYear = Math.min(...points.map(p => p.year));
    const maxYear = Math.max(...points.map(p => p.year));
    const minVal = Math.min(...points.map(p => p.value));
    const maxVal = Math.max(...points.map(p => p.value));
    
    const width = 800;
    const height = 250;
    const padding = 35;

    const xScale = (year: number) => {
      if (maxYear === minYear) return padding;
      return padding + ((year - minYear) / (maxYear - minYear)) * (width - 2 * padding);
    };

    const yScale = (val: number) => {
      if (maxVal === minVal) return height / 2;
      return (height - padding) - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    };

    return points.map(p => ({
      year: p.year,
      value: p.value,
      cx: xScale(p.year),
      cy: yScale(p.value),
      formattedValue: this.formatNumber(p.value)
    }));
  }

  get chartLabels() {
    const points = this.chartPoints;
    if (points.length === 0) {
      return { minYear: '', maxYear: '', minVal: '', maxVal: '' };
    }
    const years = points.map(p => p.year);
    const vals = points.map(p => p.value);
    return {
      minYear: Math.min(...years).toString(),
      maxYear: Math.max(...years).toString(),
      minVal: this.formatNumber(Math.min(...vals)),
      maxVal: this.formatNumber(Math.max(...vals))
    };
  }

  formatNumber(val: number): string {
    if (val >= 1.0e+12) {
      return (val / 1.0e+12).toFixed(2) + 'T';
    }
    if (val >= 1.0e+9) {
      return (val / 1.0e+9).toFixed(2) + 'B';
    }
    if (val >= 1.0e+6) {
      return (val / 1.0e+6).toFixed(2) + 'M';
    }
    return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }

  private fetchCountryData(countryCode: string): void {
    this.loading = true;
    this.error = false;
    this.countryData = null;
    this.realtimeData = null;
    this.wbIndicatorData = [];
    this.cdr.detectChanges();

    this.countryService.getCountryData(countryCode).subscribe({
      next: (data) => {
        this.countryData = data;
        this.loading = false;
        if (!data) {
          this.error = true;
        } else {
          this.fetchRealtimeData(data.latitude, data.longitude);

          if (this.selectedIndicatorId) {
            this.fetchIndicatorData();
          } else {
            this.selectTopic(3); // Default to Topic 3 (Economy & Growth)
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.error = true;
        this.cdr.detectChanges();
      },
    });
  }

  private fetchRealtimeData(lat: string, lng: string): void {
    if (!lat || !lng) {
      return;
    }
    this.loadingRealtime = true;
    this.realtimeService.getRealtimeData(lat, lng).subscribe({
      next: (data) => {
        this.realtimeData = data;
        this.loadingRealtime = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRealtime = false;
        this.cdr.detectChanges();
      },
    });
  }
}
