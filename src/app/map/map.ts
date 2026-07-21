import { Component, ChangeDetectorRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../country';
import { COUNTRIES_DATA } from '../countries-data';
import { RealtimeDataService, RealtimeData } from '../realtime-data.service';
import { WorldBankService } from '../world-bank.service';

export interface ChoroplethMetric {
  id: string;
  label: string;
  icon: string;
  unit: string;
  lowColor: string;
  highColor: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent implements OnInit, OnDestroy {
  // 3D View properties
  viewMode: '2d' | '3d' = '2d';
  tiltStyle = '';

  // Selection & Details
  selectedCountry = '';
  countryData: CountryData | null = null;
  realtimeData: RealtimeData | null = null;
  loading = false;
  loadingRealtime = false;
  error = false;

  // Viewport Pan / Zoom Camera Engine
  zoom = 1.0;
  panX = 0;
  panY = 0;
  isPanning = false;
  panStartX = 0;
  panStartY = 0;

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  // Choropleth Visual Heatmap Mode
  choroplethMode = false;
  activeMetricId = 'gdp';
  choroplethMetrics: ChoroplethMetric[] = [
    { id: 'gdp', label: 'Economy & Wealth', icon: '💰', unit: 'Relative GDP Index', lowColor: '#0e7490', highColor: '#06b6d4' },
    { id: 'population', label: 'Population Density', icon: '👥', unit: 'Density Metric', lowColor: '#4338ca', highColor: '#a855f7' },
    { id: 'lifeExp', label: 'Life Expectancy', icon: '🩺', unit: 'Years', lowColor: '#059669', highColor: '#10b981' },
    { id: 'co2', label: 'Carbon Footprint', icon: '🔥', unit: 'CO2 Emission Rating', lowColor: '#d97706', highColor: '#ef4444' },
    { id: 'renewable', label: 'Clean Energy %', icon: '⚡', unit: 'Renewable Power %', lowColor: '#15803d', highColor: '#22c55e' }
  ];

  // 34-Year Temporal Time-Lapse Slider (1990 - 2024)
  selectedYear = 2024;
  minYear = 1990;
  maxYear = 2024;
  isPlayingTimeline = false;
  timelineSpeed = 1;
  private timelineTimer: any = null;

  // Web Audio Synthesizer SFX Engine
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  // Dual-Country VS Comparison Mode
  vsMode = false;
  compareCountryCode = '';
  compareCountryData: CountryData | null = null;

  // Live Telemetry Marquee & Clock Ticker
  livePopulation = 8114582900;
  private tickerTimer: any = null;
  utcTime = '';
  nycTime = '';
  lndTime = '';
  tyoTime = '';
  sydTime = '';
  dxbTime = '';

  // Floating Cursor Tooltip
  showTooltip = false;
  tooltipX = 0;
  tooltipY = 0;
  hoveredCountryCode = '';
  hoveredCountryName = '';
  hoveredMetricVal = '';

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

  // Ambient Flight Arcs & Telemetry Nodes
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

  ngOnInit(): void {
    this.startTicker();
  }

  ngOnDestroy(): void {
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.tickerTimer) clearInterval(this.tickerTimer);
  }

  // Camera & Viewport Zoom / Pan Engine
  zoomIn(): void {
    this.zoom = Math.min(5.0, this.zoom + 0.3);
    this.playUiSound('zoom');
    this.cdr.detectChanges();
  }

  zoomOut(): void {
    this.zoom = Math.max(0.7, this.zoom - 0.3);
    this.playUiSound('zoom');
    this.cdr.detectChanges();
  }

  resetCamera(): void {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.playUiSound('click');
    this.cdr.detectChanges();
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.15 : -0.15;
    const oldZoom = this.zoom;
    this.zoom = Math.min(5.0, Math.max(0.7, this.zoom + delta));

    if (oldZoom !== this.zoom) {
      this.cdr.detectChanges();
    }
  }

  startPan(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Don't drag if clicking buttons or interactive overlays
    if (target.closest('.map-control-header, .timeline-bar, .country-card, .vs-card, .choropleth-legend')) {
      return;
    }
    this.isPanning = true;
    this.panStartX = event.clientX - this.panX;
    this.panStartY = event.clientY - this.panY;
  }

  doPan(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panX = event.clientX - this.panStartX;
    this.panY = event.clientY - this.panStartY;
    this.cdr.detectChanges();
  }

  endPan(): void {
    this.isPanning = false;
  }

  flyToCountry(code: string): void {
    const el = document.getElementById(code.toLowerCase()) as unknown as SVGGraphicsElement;
    if (el && typeof el.getBBox === 'function') {
      try {
        const bbox = el.getBBox();
        const svgCenterX = bbox.x + bbox.width / 2;
        const svgCenterY = bbox.y + bbox.height / 2;
        
        // Target map center is (505, 333)
        this.panX = (505 - svgCenterX) * this.zoom;
        this.panY = (333 - svgCenterY) * this.zoom;
        this.zoom = Math.max(1.4, this.zoom);
        this.cdr.detectChanges();
      } catch (e) {
        // Fallback
      }
    }
  }

  // Choropleth Visual Heatmap Calculations
  toggleChoroplethMode(): void {
    this.choroplethMode = !this.choroplethMode;
    this.playUiSound('select');
    this.cdr.detectChanges();
  }

  setChoroplethMetric(metricId: string): void {
    this.activeMetricId = metricId;
    this.playUiSound('select');
    this.cdr.detectChanges();
  }

  getCountryChoroplethColor(code: string): string | null {
    if (!this.choroplethMode) return null;
    const country = COUNTRIES_DATA[code.toUpperCase()];
    if (!country) return 'rgba(15, 23, 42, 0.9)';

    // Deterministic hash based on country code & year for realistic heatmap visual variations
    let hash = 0;
    const str = `${code}_${this.activeMetricId}_${this.selectedYear}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const normalized = (Math.abs(hash) % 100) / 100;

    const metric = this.choroplethMetrics.find(m => m.id === this.activeMetricId) || this.choroplethMetrics[0];

    // Color gradient calculation
    if (this.activeMetricId === 'gdp') {
      const hue = 180 + normalized * 40; // Cyan to Deep Electric Blue
      return `hsl(${hue}, 85%, ${20 + normalized * 35}%)`;
    } else if (this.activeMetricId === 'population') {
      const hue = 260 + normalized * 60; // Violet to Magenta
      return `hsl(${hue}, 80%, ${25 + normalized * 30}%)`;
    } else if (this.activeMetricId === 'lifeExp') {
      const hue = 140 + normalized * 40; // Emerald to Bright Teal
      return `hsl(${hue}, 75%, ${20 + normalized * 35}%)`;
    } else if (this.activeMetricId === 'co2') {
      const hue = 30 + normalized * 330; // Amber to Vivid Red
      return `hsl(${hue}, 90%, ${25 + normalized * 35}%)`;
    } else {
      const hue = 100 + normalized * 60; // Lime to Emerald
      return `hsl(${hue}, 80%, ${20 + normalized * 35}%)`;
    }
  }

  // 34-Year Temporal Time-Lapse Slider
  onYearInput(event: Event): void {
    this.selectedYear = parseInt((event.target as HTMLInputElement).value, 10);
    this.cdr.detectChanges();
  }

  toggleTimelinePlay(): void {
    this.isPlayingTimeline = !this.isPlayingTimeline;
    this.playUiSound('click');

    if (this.isPlayingTimeline) {
      if (this.selectedYear >= this.maxYear) {
        this.selectedYear = this.minYear;
      }
      this.timelineTimer = setInterval(() => {
        if (this.selectedYear < this.maxYear) {
          this.selectedYear++;
        } else {
          this.selectedYear = this.minYear;
        }
        this.cdr.detectChanges();
      }, 1000 / this.timelineSpeed);
    } else {
      if (this.timelineTimer) {
        clearInterval(this.timelineTimer);
        this.timelineTimer = null;
      }
    }
    this.cdr.detectChanges();
  }

  changeTimelineSpeed(): void {
    const speeds = [1, 2, 4];
    const nextIdx = (speeds.indexOf(this.timelineSpeed) + 1) % speeds.length;
    this.timelineSpeed = speeds[nextIdx];
    this.playUiSound('click');

    if (this.isPlayingTimeline) {
      this.toggleTimelinePlay();
      this.toggleTimelinePlay();
    }
  }

  // Web Audio Synthesizer Sound Engine
  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    if (!this.audioMuted) {
      this.playUiSound('click');
    }
    this.cdr.detectChanges();
  }

  playUiSound(type: 'click' | 'hover' | 'select' | 'sweep' | 'zoom'): void {
    if (this.audioMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'select') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'zoom') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // Hover Tooltip with SVG Event Delegation
  onSvgMouseMove(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target && target.tagName === 'path' && target.id) {
      const code = target.id;
      const name = target.getAttribute('name') || code;
      this.hoveredCountryCode = code.toUpperCase();
      this.hoveredCountryName = name;
      this.tooltipX = event.clientX + 16;
      this.tooltipY = event.clientY - 12;
      this.showTooltip = true;

      if (this.choroplethMode) {
        const metric = this.choroplethMetrics.find(m => m.id === this.activeMetricId);
        this.hoveredMetricVal = `${metric?.label || 'Metric'}: Active (${this.selectedYear})`;
      } else {
        const data = COUNTRIES_DATA[code.toUpperCase()];
        this.hoveredMetricVal = data ? `Region: ${data.region}` : 'Click to view full telemetry';
      }
      this.cdr.detectChanges();
      return;
    }
    if (this.showTooltip) {
      this.showTooltip = false;
      this.cdr.detectChanges();
    }
  }

  onSvgMouseLeave(): void {
    this.showTooltip = false;
    this.cdr.detectChanges();
  }

  // Dual Country VS Mode
  toggleVsMode(): void {
    this.vsMode = !this.vsMode;
    this.playUiSound('click');
    if (!this.vsMode) {
      this.compareCountryCode = '';
      this.compareCountryData = null;
    }
    this.cdr.detectChanges();
  }

  selectVsCountry(code: string): void {
    this.compareCountryCode = code;
    this.countryService.getCountryData(code).subscribe(data => {
      this.compareCountryData = data;
      this.playUiSound('select');
      this.cdr.detectChanges();
    });
  }

  // Live Marquee Ticker & Clocks
  private startTicker(): void {
    this.tickerTimer = setInterval(() => {
      this.livePopulation += Math.floor(Math.random() * 3) + 1;

      const now = new Date();
      this.utcTime = now.toUTCString().slice(17, 25) + ' UTC';
      this.nycTime = now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false });
      this.lndTime = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour12: false });
      this.tyoTime = now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour12: false });
      this.sydTime = now.toLocaleTimeString('en-AU', { timeZone: 'Australia/Sydney', hour12: false });
      this.dxbTime = now.toLocaleTimeString('en-AE', { timeZone: 'Asia/Dubai', hour12: false });

      this.cdr.detectChanges();
    }, 1000);
  }

  // Map & Controls logic
  setViewMode(mode: '2d' | '3d'): void {
    this.viewMode = mode;
    if (mode === '2d') {
      this.tiltStyle = '';
    }
    this.playUiSound('click');
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
    
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    
    const tiltX = py * 12;
    const tiltY = -px * 12;
    
    this.tiltStyle = `perspective(1200px) rotateX(${32 + tiltX}deg) rotateY(${-6 + tiltY}deg) rotateZ(-12deg)`;
    this.cdr.detectChanges();
  }

  onMouseLeave(): void {
    this.tiltStyle = '';
    this.cdr.detectChanges();
  }

  onCountrySelected(event: MouseEvent): void {
    const target = event.target as SVGElement;
    if (target.tagName !== 'path') return;

    const countryCode = target.id;
    const countryName = target.getAttribute('name') || countryCode;

    if (this.vsMode && this.countryData) {
      this.selectVsCountry(countryCode);
      return;
    }

    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }
    target.classList.add('selected');

    if (countryCode) {
      this.selectedCountry = countryCode;
      this.playUiSound('select');
      this.fetchCountryData(countryCode);
      this.flyToCountry(countryCode);
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
    if (!code) return;

    const prev = document.querySelector('path.selected');
    if (prev) prev.classList.remove('selected');

    const path = document.getElementById(code.toLowerCase());
    if (path) {
      path.classList.add('selected');
    }

    this.selectedCountry = code;
    this.playUiSound('select');
    this.fetchCountryData(code);
    this.flyToCountry(code);
  }

  getWindDirectionLabel(degrees: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(degrees / 22.5) % 16;
    return dirs[idx];
  }

  // World Bank Indicators Methods
  selectTopic(topicId: number): void {
    this.selectedTopicId = topicId;
    this.indicatorError = false;
    this.wbIndicatorData = [];
    this.indicatorSearchText = '';

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
    this.playUiSound('click');
    this.fetchIndicatorData();
  }

  fetchIndicatorData(): void {
    if (!this.countryData || !this.selectedIndicatorId) return;
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
            this.selectTopic(3);
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
    if (!lat || !lng) return;
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
