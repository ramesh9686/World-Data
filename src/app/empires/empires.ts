import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HISTORICAL_EMPIRES, HistoricalEmpire } from '../empires-data';
import { SVGCountryPath } from '../world-svg-paths';
import {
  SeshatDatabankService,
  RadarAxisInfo,
  ComparisonEmpireRender
} from '../services/seshat-databank.service';
import { TemporalMapLoaderService, EpochPreset } from '../services/temporal-map-loader.service';
import { CliopatriaEngineService, CliopatriaFeature, LegendRegionItem } from '../services/cliopatria-engine.service';
import { GeojsonProjectionService } from '../services/geojson-projection.service';
import { OldMapSearchService, HistoricalMapItem } from '../services/old-map-search.service';
import { WikiService, WikiSummary } from '../services/wiki.service';
import { TemporalPolity } from '../cliopatria-data';
import { SeshatEmpireData } from '../seshat-data';

export type EmpiresViewTab = 'temporal-map' | 'old-maps' | 'map' | 'seshat' | 'compare';

import { DecryptedTextComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-empires',
  standalone: true,
  imports: [CommonModule, FormsModule, DecryptedTextComponent, SpotlightDirective],
  templateUrl: './empires.html',
  styleUrl: './empires.css'
})
export class EmpiresComponent implements OnInit {
  activeTab: EmpiresViewTab = 'temporal-map';
  isFullWidthMap: boolean = true; // Default full-screen width mode

  // Temporal Global History Engine State (Default: Year -30 or 30 BCE)
  targetYear: number = -30;
  activeTemporalPolities: TemporalPolity[] = [];
  selectedPolity: TemporalPolity | null = null;
  epochPresets: EpochPreset[] = [];
  temporalCountryColorMap: Map<string, string> = new Map<string, string>();

  // Cliopatria 14,000+ GeoJSON Features & Exact Polygon State
  cliopatriaFeaturesForYear: CliopatriaFeature[] = [];
  selectedCliopatriaFeature: CliopatriaFeature | null = null;
  legendRegions: LegendRegionItem[] = [];
  highlightedLegendName: string | null = null;

  // Live Wikipedia API Summary State
  selectedWikiSummary: WikiSummary | null = null;
  isLoadingWiki: boolean = false;

  // OldMapsOnline Search State
  historicalMapsList: HistoricalMapItem[] = [];
  isSearchingMaps: boolean = false;
  selectedArchivalMap: HistoricalMapItem | null = null;

  // Classic Empires State
  empiresList: HistoricalEmpire[] = HISTORICAL_EMPIRES;
  selectedEmpireId: string = 'roman-empire';
  selectedEmpire: HistoricalEmpire | null = HISTORICAL_EMPIRES[0];
  empireEraFilter: string = 'All';
  timelineEraYear: number = -30;

  worldPaths: SVGCountryPath[] = [];
  spannedCountryCodes: Set<string> = new Set<string>();
  spannedCountryNames: string[] = [];

  // Seshat Databank State
  selectedSeshatData: SeshatEmpireData | null = null;
  radarAxes: RadarAxisInfo[] = [];
  selectedEmpirePolygon: string = '';
  topSeshatEmpires: SeshatEmpireData[] = [];

  // Comparison Matrix State
  comparisonEmpireIds: string[] = ['roman-empire', 'han-dynasty', 'gupta-empire'];
  comparisonRenders: ComparisonEmpireRender[] = [];

  // SVG Pan & Zoom State
  zoomLevel: number = 1.0;
  panX: number = 0;
  panY: number = 0;
  isPanning: boolean = false;
  startPanX: number = 0;
  startPanY: number = 0;
  readonly Math = Math;

  constructor(
    private cdr: ChangeDetectorRef,
    public seshatService: SeshatDatabankService,
    public temporalService: TemporalMapLoaderService,
    public cliopatriaEngine: CliopatriaEngineService,
    public geojsonProjection: GeojsonProjectionService,
    public oldMapSearch: OldMapSearchService,
    public wikiService: WikiService
  ) {}

  ngOnInit(): void {
    this.epochPresets = this.temporalService.epochPresets;
    this.radarAxes = this.seshatService.getRadarAxisGeometry(150, 150, 105);
    this.topSeshatEmpires = this.seshatService.getTopComplexEmpires(6);

    // Asynchronously load heavy 1.24 MB SVG paths dataset to keep initial main bundle small
    import('../world-svg-paths').then(m => {
      this.worldPaths = m.WORLD_SVG_COUNTRY_PATHS;
      if (this.selectedEmpire) {
        this.selectEmpire(this.selectedEmpireId);
      }
      this.cdr.markForCheck();
    });

    // Initialize Cliopatria 14,000+ authentic historical polygons
    this.cliopatriaEngine.loadCliopatriaDataset().then(() => {
      this.refreshCliopatriaFeatures();
      this.legendRegions = this.cliopatriaEngine.getLegendRegionsForYear(this.targetYear);
      this.cdr.markForCheck();
    });

    // Initialize Year -30 (30 BCE) Temporal Map State
    this.setTargetYear(-30);

    if (this.empiresList.length > 0) {
      this.selectEmpire('roman-empire');
    }
    this.updateComparisonRenders();
  }

  readonly timelineTicks = [
    { year: -3400, label: '3400 BCE', isMilestone: false },
    { year: -2500, label: '2500 BCE', isMilestone: false },
    { year: -1000, label: '1000 BCE', isMilestone: false },
    { year: -500, label: '500 BCE', isMilestone: false },
    { year: 1, label: '1 CE', isMilestone: true },
    { year: 500, label: '500 CE', isMilestone: false },
    { year: 1000, label: '1000 CE', isMilestone: false },
    { year: 1500, label: '1500 CE', isMilestone: false },
    { year: 2024, label: '2024 CE', isMilestone: false }
  ];

  getTickLeftPercent(year: number): number {
    const min = -3400;
    const max = 2024;
    return ((year - min) / (max - min)) * 100;
  }

  get sliderProgressPercent(): number {
    const min = -3400;
    const max = 2024;
    return Math.max(0, Math.min(100, ((this.targetYear - min) / (max - min)) * 100));
  }

  get currentEraInfo(): { name: string; subtitle: string; period: string; badge: string; color: string } {
    const y = this.targetYear;
    if (y < -500) {
      return {
        name: 'Ancient & Bronze Age Era',
        subtitle: 'Pyramids of Giza, Indus Valley Cities, Babylonian Law & Early Empires',
        period: '3400 BCE – 500 BCE',
        badge: '🏺 Bronze Age',
        color: '#d97706'
      };
    } else if (y <= 500) {
      return {
        name: 'Classical Antiquity',
        subtitle: 'Pax Romana, Han Dynasty Silk Road, Mauryan Empire & Persian Superpowers',
        period: '500 BCE – 500 CE',
        badge: '🏛️ Classical Era',
        color: '#dc2626'
      };
    } else if (y <= 1450) {
      return {
        name: 'Medieval & Post-Classical Era',
        subtitle: 'Byzantine Empire, Tang & Song Dynasties, Islamic Golden Age & Mongol Hegemony',
        period: '500 CE – 1450 CE',
        badge: '⚔️ Medieval Era',
        color: '#8b5cf6'
      };
    } else if (y <= 1800) {
      return {
        name: 'Early Modern Era',
        subtitle: 'Ottoman Hegemony, Ming & Qing Dynasties, Mughal India, & Global Maritime Age',
        period: '1450 CE – 1800 CE',
        badge: '⛵ Age of Discovery',
        color: '#0d9488'
      };
    } else {
      return {
        name: 'Modern & Industrial Era',
        subtitle: 'Industrial Revolution, Global Nation-States & Contemporary Geopolitics',
        period: '1800 CE – 2024 CE',
        badge: '⚡ Modern World',
        color: '#3b82f6'
      };
    }
  }

  get formattedTimelineYear(): string {
    return this.temporalService.formatYearLabel(this.targetYear);
  }

  get legendTitleHeader(): string {
    if (this.targetYear < 0) {
      return `B.C. ${Math.abs(this.targetYear)} Legend`;
    }
    return `A.D. ${this.targetYear} Legend`;
  }

  get filteredEmpires(): HistoricalEmpire[] {
    if (this.empireEraFilter === 'All') return this.empiresList;
    return this.empiresList.filter(e => e.era === this.empireEraFilter);
  }

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
  }

  toggleFullWidthMap(): void {
    this.isFullWidthMap = !this.isFullWidthMap;
    this.cdr.markForCheck();
  }

  setTabMode(mode: EmpiresViewTab): void {
    this.activeTab = mode;
    if (mode === 'old-maps' && this.historicalMapsList.length === 0) {
      this.fetchArchivalMaps();
    }
    this.cdr.markForCheck();
  }

  /**
   * Set target year for the Temporal World Map Engine (-3400 to 2024)
   */
  setTargetYear(year: number): void {
    const clampedYear = Math.max(-3400, Math.min(2024, Math.round(year)));
    this.targetYear = clampedYear;
    this.timelineEraYear = clampedYear;

    // 1. Fetch active polities for this year from catalog
    this.activeTemporalPolities = this.temporalService.getPolitiesForYear(clampedYear);

    // 2. Fetch Cliopatria 14,000+ features and project exact SVG paths
    this.refreshCliopatriaFeatures();

    // 3. Build legend regions for bottom-right floating legend box (old-map.vercel.app)
    this.legendRegions = this.cliopatriaEngine.getLegendRegionsForYear(clampedYear);

    // Build color map for country codes fallback
    const colorMap = new Map<string, string>();
    const countryCodesSet = new Set<string>();

    this.activeTemporalPolities.forEach(polity => {
      polity.countryCodes.forEach(code => {
        const lowerCode = code.toLowerCase();
        colorMap.set(lowerCode, polity.color);
        countryCodesSet.add(lowerCode);
      });
    });

    this.temporalCountryColorMap = colorMap;
    this.spannedCountryCodes = countryCodesSet;

    // Update active polity selection
    if (this.activeTemporalPolities.length > 0) {
      this.selectTemporalPolity(this.activeTemporalPolities[0]);
    } else {
      this.selectedPolity = null;
    }

    this.cdr.markForCheck();
  }

  refreshCliopatriaFeatures(): void {
    const rawFeatures = this.cliopatriaEngine.getFeaturesForYear(this.targetYear);
    
    // Project each GeoJSON feature coordinates into exact SVG path d="M ... Z"
    this.cliopatriaFeaturesForYear = rawFeatures.map(feat => {
      const path = this.geojsonProjection.geometryToSvgPath(feat.geometry);
      const centroid = this.geojsonProjection.calculateCentroid(feat.geometry);
      return {
        ...feat,
        svgPath: path,
        centroid
      };
    });

    if (this.cliopatriaFeaturesForYear.length > 0) {
      this.selectCliopatriaFeature(this.cliopatriaFeaturesForYear[0]);
    } else {
      this.selectedCliopatriaFeature = null;
      this.selectedWikiSummary = null;
    }

    this.cdr.markForCheck();
  }

  async fetchArchivalMaps(): Promise<void> {
    this.isSearchingMaps = true;
    this.cdr.markForCheck();

    try {
      const yearFrom = Math.max(-3400, this.targetYear - 40);
      const yearTo = Math.min(2024, this.targetYear + 40);
      this.historicalMapsList = await this.oldMapSearch.searchMaps({
        yearFrom,
        yearTo,
        limit: 12
      });

      if (this.historicalMapsList.length > 0) {
        this.selectedArchivalMap = this.historicalMapsList[0];
      }
    } finally {
      this.isSearchingMaps = false;
      this.cdr.markForCheck();
    }
  }

  handleMapImageError(event: Event, index: number = 0): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      const fallbackIdx = (index % 6) + 1;
      imgElement.src = `/assets/vintage-maps/vintage-map-${fallbackIdx}.jpg`;
    }
  }

  openMapDetail(mapItem: HistoricalMapItem): void {
    this.selectedArchivalMap = mapItem;
    this.cdr.markForCheck();
  }

  closeMapDetail(): void {
    this.selectedArchivalMap = null;
    this.cdr.markForCheck();
  }

  onYearInputChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      this.setTargetYear(val);
    }
  }

  onYearSliderChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(val)) {
      this.setTargetYear(val);
    }
  }

  jumpToEpoch(presetYear: number): void {
    this.setTargetYear(presetYear);
  }

  /**
   * Click handler for Temporal Polity (Steady camera position, fetch Wikipedia summary)
   */
  selectTemporalPolity(polity: TemporalPolity): void {
    this.selectedPolity = polity;

    // Load corresponding Seshat data if linked
    if (polity.seshatId) {
      const seshatData = this.seshatService.getEmpireSeshatData(polity.polityId);
      if (seshatData) {
        this.selectedSeshatData = seshatData;
        this.selectedEmpirePolygon = this.seshatService.calculateRadarPolygonPoints(
          seshatData.dimensions,
          150,
          150,
          105
        );
      }
    }

    // Fetch Wikipedia Summary without moving camera
    this.fetchWikiInfoForPolity(polity.name);
    this.cdr.markForCheck();
  }

  /**
   * Click handler for Cliopatria GeoJSON Feature (Steady camera position, fetch Wikipedia summary)
   */
  selectCliopatriaFeature(feature: CliopatriaFeature): void {
    this.selectedCliopatriaFeature = feature;
    const name = feature.properties?.Name || feature.properties?.NAME || 'Polity';
    this.highlightedLegendName = name;

    // Fetch live Wikipedia summary for clicked polity name
    this.fetchWikiInfoForPolity(name);
    this.cdr.markForCheck();
  }

  async fetchWikiInfoForPolity(polityName: string): Promise<void> {
    if (!polityName) return;

    this.isLoadingWiki = true;
    this.cdr.markForCheck();

    try {
      this.selectedWikiSummary = await this.wikiService.fetchWikiSummary(polityName, this.targetYear);
    } finally {
      this.isLoadingWiki = false;
      this.cdr.markForCheck();
    }
  }

  highlightLegendRegion(name: string | null): void {
    this.highlightedLegendName = name;
    if (name) {
      this.fetchWikiInfoForPolity(name);
    }
    this.cdr.markForCheck();
  }

  getFeatureFillColor(feat: CliopatriaFeature): string {
    const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown';
    // Always preserve and return each empire's unique differentiated color
    return feat.computedColor || this.cliopatriaEngine.getColorForName(name);
  }

  getFeatureOpacity(feat: CliopatriaFeature): number {
    const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown';
    if (this.highlightedLegendName) {
      return name === this.highlightedLegendName ? 0.95 : 0.65;
    }
    return 0.8;
  }

  getFeatureStroke(feat: CliopatriaFeature): string {
    const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown';
    if (this.highlightedLegendName && name === this.highlightedLegendName) {
      return '#ffffff';
    }
    return 'rgba(0, 0, 0, 0.45)';
  }

  getFeatureStrokeWidth(feat: CliopatriaFeature): number {
    const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown';
    if (this.highlightedLegendName && name === this.highlightedLegendName) {
      return 2.4;
    }
    return 0.8;
  }

  selectEmpire(empireId: string): void {
    this.selectedEmpireId = empireId;
    const found = HISTORICAL_EMPIRES.find(e => e.id === empireId);
    if (found) {
      this.selectedEmpire = found;
      this.timelineEraYear = found.peakYear;

      const targetCodes = new Set(found.countryCodes.map(c => c.toLowerCase()));
      this.spannedCountryCodes = targetCodes;

      const names: string[] = [];
      this.worldPaths.forEach(p => {
        if (targetCodes.has(p.id)) {
          names.push(p.name);
        }
      });
      this.spannedCountryNames = names.length > 0 ? names : found.countryCodes.map(c => c.toUpperCase());

      // Fetch Seshat Databank Metrics
      this.selectedSeshatData = this.seshatService.getEmpireSeshatData(empireId);
      if (this.selectedSeshatData) {
        this.selectedEmpirePolygon = this.seshatService.calculateRadarPolygonPoints(
          this.selectedSeshatData.dimensions,
          150,
          150,
          105
        );
      } else {
        this.selectedEmpirePolygon = '';
      }

      this.fetchWikiInfoForPolity(found.name);
    }
    this.cdr.markForCheck();
  }

  selectEmpireFromSelect(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    if (val) {
      this.selectEmpire(val);
    }
  }

  isCountryShaded(pathId: string): boolean {
    if (this.activeTab === 'temporal-map') {
      return this.temporalCountryColorMap.has(pathId.toLowerCase());
    }
    return this.spannedCountryCodes.has(pathId.toLowerCase());
  }

  getCountryFill(pathId: string): string {
    const lowerId = pathId.toLowerCase();
    
    if (this.activeTab === 'temporal-map') {
      if (this.temporalCountryColorMap.has(lowerId)) {
        return this.temporalCountryColorMap.get(lowerId) || '#3b82f6';
      }
      return 'rgba(24, 7, 16, 0.45)';
    }

    if (this.isCountryShaded(pathId) && this.selectedEmpire) {
      return this.selectedEmpire.color || '#3b82f6';
    }
    return 'rgba(24, 7, 16, 0.45)';
  }

  getCountryOpacity(pathId: string): number {
    return this.isCountryShaded(pathId) ? 0.75 : 0.45;
  }

  getCountryStroke(pathId: string): string {
    return this.isCountryShaded(pathId) ? '#ffffff' : 'rgba(255, 255, 255, 0.12)';
  }

  getCountryStrokeWidth(pathId: string): number {
    return this.isCountryShaded(pathId) ? 2.2 : 0.75;
  }

  onTimelineEraScrub(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.setTargetYear(val);
  }

  setEmpireEraFilter(era: string): void {
    this.empireEraFilter = era;
    this.cdr.markForCheck();
  }

  // Comparative Matrix Handlers
  isEmpireSelectedForComparison(empireId: string): boolean {
    return this.comparisonEmpireIds.includes(empireId);
  }

  toggleComparisonEmpire(empireId: string): void {
    const index = this.comparisonEmpireIds.indexOf(empireId);
    if (index > -1) {
      if (this.comparisonEmpireIds.length > 1) {
        this.comparisonEmpireIds.splice(index, 1);
      }
    } else {
      if (this.comparisonEmpireIds.length >= 3) {
        this.comparisonEmpireIds.shift();
      }
      this.comparisonEmpireIds.push(empireId);
    }
    this.updateComparisonRenders();
    this.cdr.markForCheck();
  }

  updateComparisonRenders(): void {
    const colors = ['#f59e0b', '#3b82f6', '#10b981'];
    this.comparisonRenders = this.seshatService.getComparativeRenderData(
      this.comparisonEmpireIds,
      colors,
      150,
      150,
      105
    );
  }

  // Pan & Zoom Handlers
  zoomIn(): void {
    this.zoomLevel = Math.min(5.0, this.zoomLevel * 1.25);
    this.cdr.markForCheck();
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(0.8, this.zoomLevel / 1.25);
    this.cdr.markForCheck();
  }

  resetViewport(): void {
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.cdr.markForCheck();
  }

  startPan(event: MouseEvent | Event): void {
    const me = event as MouseEvent;
    if (me.button !== undefined && me.button !== 0) return;
    this.isPanning = true;
    this.startPanX = me.clientX - this.panX;
    this.startPanY = me.clientY - this.startPanY;
  }

  doPan(event: MouseEvent | Event): void {
    if (!this.isPanning) return;
    const me = event as MouseEvent;
    this.panX = me.clientX - this.startPanX;
    this.panY = me.clientY - this.startPanY;
    this.cdr.markForCheck();
  }

  endPan(): void {
    this.isPanning = false;
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.15 : 0.88;
    const newZoom = Math.min(5.0, Math.max(0.8, this.zoomLevel * zoomFactor));

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoomLevel);
    this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoomLevel);
    this.zoomLevel = newZoom;
    this.cdr.markForCheck();
  }
}
