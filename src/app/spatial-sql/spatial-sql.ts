import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES_DATA } from '../countries-data';
import { WorldBankService, WorldBankTopic, WorldBankIndicator, WorldBankDataPoint } from '../world-bank.service';
import { Model3dLoaderService, GraphicsPerformancePreset, FpsTelemetry } from '../services/model-3d-loader.service';

export interface SqlQueryResultRow {
  id?: string;
  name: string;
  category: string;
  metric1: string;
  metric2: string;
  lat: number;
  lng: number;
}

export interface QueryIterationPreset {
  id: string;
  stepNumber: number;
  title: string;
  badge: string;
  description: string;
  sql: string;
  targetFlyLng: number;
  targetFlyLat: number;
  targetZoom: number;
}

export interface PresetItem {
  id: string;
  icon: string;
  label: string;
  desc: string;
  sql: string;
  flyLng?: number;
  flyLat?: number;
  zoom?: number;
}

export interface PresetCategory {
  category: string;
  items: PresetItem[];
}

export interface FeaturedIndicatorPill {
  id: string;
  icon: string;
  label: string;
  topicId: number;
}

import { RouterLink } from '@angular/router';
import { DecryptedTextComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-spatial-sql',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecryptedTextComponent, SpotlightDirective],
  templateUrl: './spatial-sql.html',
  styleUrl: './spatial-sql.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpatialSqlComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewMapCanvas', { static: false }) previewMapRef!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private maplibregl: any = null;
  private activeMarkers: any[] = [];
  private autoIterateTimer: any = null;

  // Active Mode Tab: 'world_data_api' | 'builder' | 'iterations' | 'presets' | 'code'
  activeWorkbenchTab: 'world_data_api' | 'builder' | 'iterations' | 'presets' | 'code' = 'world_data_api';

  // World Data API Indicators Hub State
  wbTopics: WorldBankTopic[] = [];
  selectedTopicId: number = 3; // Economy & Growth
  activeIndicatorsList: WorldBankIndicator[] = [];
  activeIndicatorIndex: number = 0;
  selectedIndicatorId: string = 'NY.GDP.MKTP.CD';
  selectedIndicatorName: string = 'GDP (current US$)';
  selectedCountryCode: string = 'us';
  selectedCountryName: string = 'United States';
  indicatorDataPoints: WorldBankDataPoint[] = [];
  isLoadingIndicator: boolean = false;

  isWbAutoPlayActive: boolean = false;
  private wbAutoPlayTimer: any = null;

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

  // Visual Builder State (No SQL typing required)
  builderDataset: 'countries' | 'canals' | 'chokepoints' | 'ports' = 'countries';
  builderRegion: string = 'All';
  builderIncome: string = 'All';
  builderSortBy: 'population' | 'name' | 'latitude' = 'population';
  builderLimit: number = 10;

  // Iteration Wizard State
  currentIterationIndex: number = 0;
  isAutoPlayingIterations: boolean = false;

  queryIterations: QueryIterationPreset[] = [
    {
      id: 'iter-1',
      stepNumber: 1,
      title: 'Iteration #1: High Income Economies',
      badge: '💰 ECONOMIC METRICS',
      description: 'Filters world countries where income level is classified as High Income.',
      sql: `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE income_level = 'High income' ORDER BY population DESC LIMIT 10;`,
      targetFlyLng: 15.0,
      targetFlyLat: 48.0,
      targetZoom: 3.5
    },
    {
      id: 'iter-2',
      stepNumber: 2,
      title: 'Iteration #2: Inter-Oceanic Shipping Canals',
      badge: '🚢 MARITIME INFRASTRUCTURE',
      description: 'Queries key artificial shipping canals connecting major oceans and seas.',
      sql: `SELECT name, category, vessel_capacity AS metric1, annual_traffic AS metric2, lat, lng FROM world_canals;`,
      targetFlyLng: 20.0,
      targetFlyLat: 25.0,
      targetZoom: 2.8
    },
    {
      id: 'iter-3',
      stepNumber: 3,
      title: 'Iteration #3: Strategic Maritime Chokepoints',
      badge: '⚠️ GEO-STRATEGIC RISK',
      description: 'Spatial scan of high-risk narrow waterways essential for global trade flow.',
      sql: `SELECT name, category, risk_level AS metric1, daily_flow AS metric2, lat, lng FROM strategic_chokepoints;`,
      targetFlyLng: 60.0,
      targetFlyLat: 20.0,
      targetZoom: 3.2
    },
    {
      id: 'iter-4',
      stepNumber: 4,
      title: 'Iteration #4: Asian Demographics & Megacities',
      badge: '🏮 REGIONAL SCAN',
      description: 'Extracts most populous Asian sovereign nations and administrative capitals.',
      sql: `SELECT name, region AS category, capital AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE region LIKE '%Asia%' ORDER BY population DESC LIMIT 10;`,
      targetFlyLng: 100.0,
      targetFlyLat: 25.0,
      targetZoom: 3.2
    },
    {
      id: 'iter-5',
      stepNumber: 5,
      title: 'Iteration #5: Spatial Proximity Radius (Suez Canal)',
      badge: '📍 ST_DWithin RADIUS',
      description: 'Calculates all national capitals located within 2,500 km radius of the Suez Canal.',
      sql: `SELECT name, 'Suez Proximity Radius' AS category, capital AS metric1, 'Within 2,500 km' AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE ST_DWithin(ST_Point(longitude, latitude), ST_Point(32.3, 30.5), 2500000) ORDER BY name ASC LIMIT 10;`,
      targetFlyLng: 32.3,
      targetFlyLat: 30.5,
      targetZoom: 4.5
    },
    {
      id: 'iter-6',
      stepNumber: 6,
      title: 'Iteration #6: Global Mega Seaports Hubs',
      badge: '⚓ PORT LOGISTICS',
      description: 'Spatial indexing of top deepwater container seaports across major trade corridors.',
      sql: `SELECT name, category, container_volume AS metric1, country AS metric2, lat, lng FROM global_seaports;`,
      targetFlyLng: 110.0,
      targetFlyLat: 15.0,
      targetZoom: 3.0
    }
  ];

  presetCategories: PresetCategory[] = [
    {
      category: '💰 Demographics & Economy',
      items: [
        {
          id: 'preset_high_income',
          icon: '💰',
          label: 'High Income Nations',
          desc: 'Nations with highest GDP per capita',
          sql: `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE income_level = 'High income' ORDER BY population DESC LIMIT 12;`,
          flyLng: 10, flyLat: 45, zoom: 3
        },
        {
          id: 'preset_top_pop',
          icon: '👥',
          label: 'Top Populated Countries',
          desc: 'Largest global populations',
          sql: `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries ORDER BY population DESC LIMIT 15;`,
          flyLng: 80, flyLat: 20, zoom: 2.5
        },
        {
          id: 'preset_dev_nations',
          icon: '🌾',
          label: 'Developing Economies',
          desc: 'Emerging & low income nations',
          sql: `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE income_level LIKE '%Low%' OR income_level LIKE '%Lower%' ORDER BY population DESC LIMIT 12;`,
          flyLng: 20, flyLat: 5, zoom: 3.2
        }
      ]
    },
    {
      category: '🚢 Maritime & Infrastructure',
      items: [
        {
          id: 'preset_canals',
          icon: '🚢',
          label: 'World Shipping Canals',
          desc: 'Major artificial waterways',
          sql: `SELECT name, category, vessel_capacity AS metric1, annual_traffic AS metric2, lat, lng FROM world_canals;`,
          flyLng: 0, flyLat: 25, zoom: 2.2
        },
        {
          id: 'preset_chokepoints',
          icon: '⚠️',
          label: 'Strategic Chokepoints',
          desc: 'High-risk trade bottlenecks',
          sql: `SELECT name, category, risk_level AS metric1, daily_flow AS metric2, lat, lng FROM strategic_chokepoints;`,
          flyLng: 50, flyLat: 20, zoom: 3
        },
        {
          id: 'preset_seaports',
          icon: '⚓',
          label: 'Global Container Ports',
          desc: 'Primary maritime cargo hubs',
          sql: `SELECT name, category, container_volume AS metric1, country AS metric2, lat, lng FROM global_seaports;`,
          flyLng: 105, flyLat: 22, zoom: 3.5
        }
      ]
    }
  ];

  // Custom SQL input state
  customSql: string = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries ORDER BY population DESC LIMIT 10;`;
  activeQuerySql: string = '';
  isExecuting: boolean = false;
  executionTimeMs: number = 0;
  activeResults: SqlQueryResultRow[] = [];

  get active3dPreset(): GraphicsPerformancePreset {
    return this.model3dLoader.getPerformancePreset();
  }

  get fpsTelemetry(): FpsTelemetry {
    return this.model3dLoader.getFpsTelemetry();
  }

  set3dPerformancePreset(preset: GraphicsPerformancePreset): void {
    this.model3dLoader.setPerformancePreset(preset);
    if (this.map) {
      const optimalDpr = this.model3dLoader.getOptimalDPR(preset);
      if (typeof this.map.setPixelRatio === 'function') {
        this.map.setPixelRatio(optimalDpr);
      }
    }
    this.cdr.markForCheck();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private wbService: WorldBankService,
    private model3dLoader: Model3dLoaderService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initWorldDataHub();
    this.runVisualBuilderQuery();
  }

  ngOnDestroy(): void {
    if (this.autoIterateTimer) {
      clearInterval(this.autoIterateTimer);
    }
    if (this.wbAutoPlayTimer) {
      clearInterval(this.wbAutoPlayTimer);
    }
    this.clearActiveMarkers();
    if (this.map) {
      if (typeof this.model3dLoader.disposeHierarchy === 'function') {
        this.model3dLoader.disposeHierarchy(this.map);
      }
      this.map.remove();
      this.map = null;
    }
  }

  initWorldDataHub(): void {
    this.wbTopics = this.wbService.getTopics();
    if (this.wbTopics.length > 0) {
      this.selectWbTopic(3);
    }
    this.fetchWbIndicatorTelemetry(this.selectedIndicatorId, this.selectedCountryCode);
  }

  selectWbTopic(topicId: number): void {
    this.selectedTopicId = topicId;
    this.activeIndicatorsList = this.wbService.getIndicatorsByTopic(topicId);
    this.activeIndicatorIndex = 0;
    if (this.activeIndicatorsList.length > 0) {
      const first = this.activeIndicatorsList[0];
      this.selectedIndicatorId = first.id;
      this.selectedIndicatorName = first.name;
      this.fetchWbIndicatorTelemetry(first.id, this.selectedCountryCode);
    }
    this.cdr.markForCheck();
  }

  selectWbIndicatorDirect(ind: WorldBankIndicator, index?: number): void {
    if (index !== undefined) {
      this.activeIndicatorIndex = index;
    } else {
      const idx = this.activeIndicatorsList.findIndex(i => i.id === ind.id);
      if (idx !== -1) this.activeIndicatorIndex = idx;
    }
    this.selectedIndicatorId = ind.id;
    this.selectedIndicatorName = ind.name;
    this.fetchWbIndicatorTelemetry(ind.id, this.selectedCountryCode);
    this.cdr.markForCheck();
  }

  nextWbIndicator(): void {
    if (this.activeIndicatorsList.length === 0) return;
    this.activeIndicatorIndex = (this.activeIndicatorIndex + 1) % this.activeIndicatorsList.length;
    const nextInd = this.activeIndicatorsList[this.activeIndicatorIndex];
    this.selectWbIndicatorDirect(nextInd, this.activeIndicatorIndex);
  }

  prevWbIndicator(): void {
    if (this.activeIndicatorsList.length === 0) return;
    this.activeIndicatorIndex = (this.activeIndicatorIndex - 1 + this.activeIndicatorsList.length) % this.activeIndicatorsList.length;
    const prevInd = this.activeIndicatorsList[this.activeIndicatorIndex];
    this.selectWbIndicatorDirect(prevInd, this.activeIndicatorIndex);
  }

  toggleWbAutoPlay(): void {
    this.isWbAutoPlayActive = !this.isWbAutoPlayActive;
    if (this.isWbAutoPlayActive) {
      this.wbAutoPlayTimer = setInterval(() => {
        this.nextWbIndicator();
      }, 4000);
    } else {
      if (this.wbAutoPlayTimer) {
        clearInterval(this.wbAutoPlayTimer);
        this.wbAutoPlayTimer = null;
      }
    }
    this.cdr.markForCheck();
  }

  selectWbCountry(code: string): void {
    this.selectedCountryCode = code;
    const cObj = this.popularCountries.find(c => c.code === code);
    if (cObj) {
      this.selectedCountryName = cObj.name;
    }
    this.fetchWbIndicatorTelemetry(this.selectedIndicatorId, code);
  }

  fetchWbIndicatorTelemetry(indicatorId: string, countryCode: string): void {
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

  get latestWbValueFormatted(): string {
    if (this.indicatorDataPoints.length === 0) return 'N/A';
    const last = this.indicatorDataPoints[this.indicatorDataPoints.length - 1];
    if (!last || last.value === null) return 'N/A';

    const val = last.value;
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)} Trillion`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)} Billion`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)} Million`;
    return val.toLocaleString();
  }

  get latestWbYear(): number {
    if (this.indicatorDataPoints.length === 0) return 2024;
    return this.indicatorDataPoints[this.indicatorDataPoints.length - 1].year;
  }

  get sparklineSvgPath(): string {
    if (this.indicatorDataPoints.length < 2) return '';
    const width = 340;
    const height = 60;
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

  async ngAfterViewInit(): Promise<void> {
    setTimeout(async () => {
      await this.initPreviewMapEngine();
    }, 100);
  }

  setWorkbenchTab(tab: 'world_data_api' | 'builder' | 'iterations' | 'presets' | 'code'): void {
    this.activeWorkbenchTab = tab;
    if (tab === 'builder') this.runVisualBuilderQuery();
    if (tab === 'iterations') this.selectIterationStep(this.currentIterationIndex);
    this.cdr.markForCheck();
  }

  runVisualBuilderQuery(): void {
    this.isExecuting = true;
    const start = performance.now();

    let sql = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries`;
    let filtered = Object.values(COUNTRIES_DATA) as any[];

    if (this.builderRegion !== 'All') {
      filtered = filtered.filter(c => c.region?.value?.includes(this.builderRegion));
    }
    if (this.builderIncome !== 'All') {
      filtered = filtered.filter(c => c.incomeLevel?.value === this.builderIncome);
    }

    if (this.builderSortBy === 'population') {
      filtered.sort((a, b) => (b.population || b.area || 0) - (a.population || a.area || 0));
    } else if (this.builderSortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.builderSortBy === 'latitude') {
      filtered.sort((a, b) => (parseFloat(b.latitude) || 0) - (parseFloat(a.latitude) || 0));
    }

    filtered = filtered.slice(0, this.builderLimit);

    this.activeResults = filtered.map(c => ({
      id: c.id,
      name: c.name,
      category: c.region?.value || 'Global',
      metric1: c.incomeLevel?.value || 'N/A',
      metric2: (c.population || c.area || 100000).toLocaleString(),
      lat: parseFloat(c.latitude) || 0,
      lng: parseFloat(c.longitude) || 0
    }));

    this.activeQuerySql = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries ${this.builderRegion !== 'All' ? "WHERE region = '" + this.builderRegion + "'" : ''} ORDER BY ${this.builderSortBy} DESC LIMIT ${this.builderLimit};`;

    this.executionTimeMs = Math.round(performance.now() - start);
    this.isExecuting = false;
    this.renderResultMarkersOnMap();
    this.cdr.markForCheck();
  }

  selectIterationStep(index: number): void {
    this.currentIterationIndex = index;
    const step = this.queryIterations[index];
    if (!step) return;

    this.activeQuerySql = step.sql;
    this.executePresetSql(step.sql, step.targetFlyLng, step.targetFlyLat, step.targetZoom);
  }

  nextIteration(): void {
    const nextIdx = (this.currentIterationIndex + 1) % this.queryIterations.length;
    this.selectIterationStep(nextIdx);
  }

  prevIteration(): void {
    const prevIdx = (this.currentIterationIndex - 1 + this.queryIterations.length) % this.queryIterations.length;
    this.selectIterationStep(prevIdx);
  }

  toggleAutoPlayIterations(): void {
    this.isAutoPlayingIterations = !this.isAutoPlayingIterations;
    if (this.isAutoPlayingIterations) {
      this.autoIterateTimer = setInterval(() => {
        this.nextIteration();
      }, 4000);
    } else {
      if (this.autoIterateTimer) {
        clearInterval(this.autoIterateTimer);
        this.autoIterateTimer = null;
      }
    }
    this.cdr.markForCheck();
  }

  selectPreset(preset: PresetItem): void {
    this.activeQuerySql = preset.sql;
    this.executePresetSql(preset.sql, preset.flyLng, preset.flyLat, preset.zoom);
  }

  runCustomSql(): void {
    this.activeQuerySql = this.customSql;
    this.executePresetSql(this.customSql);
  }

  private executePresetSql(sql: string, flyLng?: number, flyLat?: number, zoom?: number): void {
    this.isExecuting = true;
    const start = performance.now();

    let results: SqlQueryResultRow[] = [];

    if (sql.includes('world_canals')) {
      results = [
        { name: 'Suez Canal', category: 'Artificial Waterway', metric1: 'Suezmax (240k DWT)', metric2: '22,000 ships/yr', lat: 30.5, lng: 32.3 },
        { name: 'Panama Canal', category: 'Lock System Canal', metric1: 'Neopanamax (120k DWT)', metric2: '14,000 ships/yr', lat: 8.95, lng: -79.55 },
        { name: 'Kiel Canal', category: 'Baltic Connector', metric1: 'Handysize (40k DWT)', metric2: '30,000 ships/yr', lat: 54.3, lng: 9.6 }
      ];
    } else if (sql.includes('strategic_chokepoints')) {
      results = [
        { name: 'Strait of Malacca', category: 'High-Risk Corridor', metric1: 'High Risk (Piracy)', metric2: '16.0M bpd oil', lat: 2.5, lng: 101.5 },
        { name: 'Bab-el-Mandeb', category: 'Active Escort Zone', metric1: 'Critical Risk', metric2: '6.2M bpd oil', lat: 12.5, lng: 43.3 },
        { name: 'Strait of Hormuz', category: 'Energy Lifeline', metric1: 'High Security', metric2: '21.0M bpd oil', lat: 26.6, lng: 56.2 }
      ];
    } else if (sql.includes('global_seaports')) {
      results = [
        { name: 'Port of Shanghai', category: 'Container Megaport', metric1: '47.3M TEU/yr', metric2: 'China', lat: 31.23, lng: 121.47 },
        { name: 'Port of Singapore', category: 'Transshipment Hub', metric1: '37.5M TEU/yr', metric2: 'Singapore', lat: 1.35, lng: 103.82 },
        { name: 'Port of Rotterdam', category: 'European Gateway', metric1: '15.3M TEU/yr', metric2: 'Netherlands', lat: 51.92, lng: 4.48 }
      ];
    } else {
      let filtered = Object.values(COUNTRIES_DATA) as any[];
      if (sql.includes("High income")) {
        filtered = filtered.filter(c => c.incomeLevel?.value === 'High income');
      } else if (sql.includes("Asia")) {
        filtered = filtered.filter(c => c.region?.value?.includes('Asia'));
      }
      filtered.sort((a, b) => (b.population || b.area || 0) - (a.population || a.area || 0));
      results = filtered.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        category: c.region?.value || 'Global',
        metric1: c.incomeLevel?.value || c.capitalCity || 'N/A',
        metric2: (c.population || c.area || 100000).toLocaleString(),
        lat: parseFloat(c.latitude) || 0,
        lng: parseFloat(c.longitude) || 0
      }));
    }

    this.activeResults = results;
    this.executionTimeMs = Math.round(performance.now() - start);
    this.isExecuting = false;

    this.renderResultMarkersOnMap();

    if (flyLng !== undefined && flyLat !== undefined && this.map) {
      this.map.flyTo({
        center: [flyLng, flyLat],
        zoom: zoom || 3.5,
        duration: 1500,
        essential: true
      });
    }

    this.cdr.markForCheck();
  }

  exportCsv(): void {
    if (this.activeResults.length === 0) return;

    const headers = ['name', 'category', 'metric1', 'metric2', 'latitude', 'longitude'];
    const rows = this.activeResults.map(r => [
      `"${r.name}"`,
      `"${r.category}"`,
      `"${r.metric1}"`,
      `"${r.metric2}"`,
      r.lat,
      r.lng
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spatial-duckdb-query-export-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async initPreviewMapEngine(): Promise<void> {
    if (!this.previewMapRef) return;
    try {
      const maplibreModule = await import('maplibre-gl');
      this.maplibregl = (maplibreModule as any).default || maplibreModule;

      this.ngZone.runOutsideAngular(() => {
        const mapInstance = new this.maplibregl.Map({
          container: this.previewMapRef.nativeElement,
          style: {
            version: 8,
            sources: {
              'esri-dark': {
                type: 'raster',
                tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'],
                tileSize: 256
              }
            },
            layers: [{ id: 'esri-dark-layer', type: 'raster', source: 'esri-dark' }]
          },
          center: [20.0, 20.0],
          zoom: 2.0,
          pixelRatio: this.model3dLoader.getOptimalDPR()
        });

        this.map = mapInstance;
        mapInstance.on('load', () => {
          this.ngZone.run(() => {
            this.renderResultMarkersOnMap();
          });
        });
      });
    } catch (err) {
      console.warn('Spatial SQL preview map init warning:', err);
    }
  }

  private clearActiveMarkers(): void {
    this.activeMarkers.forEach(m => m.remove());
    this.activeMarkers = [];
  }

  private renderResultMarkersOnMap(): void {
    if (!this.map || !this.maplibregl) return;
    this.clearActiveMarkers();

    this.activeResults.forEach(r => {
      if (r.lat && r.lng) {
        const el = document.createElement('div');
        el.className = 'spatial-sql-marker';
        el.innerHTML = `📍`;
        el.title = `${r.name} (${r.category}) - ${r.metric1}`;

        const marker = new this.maplibregl.Marker({ element: el })
          .setLngLat([r.lng, r.lat])
          .addTo(this.map);

        this.activeMarkers.push(marker);
      }
    });
  }
}
