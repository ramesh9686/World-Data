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

  constructor(
    private countryService: CountryService,
    private realtimeService: RealtimeDataService,
    private wbService: WorldBankService,
    private cdr: ChangeDetectorRef
  ) {
    this.wbTopics = this.wbService.getTopics();
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
