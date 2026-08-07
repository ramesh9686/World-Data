import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoJsonExportService } from '../services/geojson-export.service';
import { COUNTRIES_DATA, CountryData } from '../countries-data';
import { WORLD_CANALS, STRATEGIC_CHOKEPOINTS, GLOBAL_MEGAPORTS, CARGO_VESSEL_FLEET, CargoVessel } from '../maritime-data';
import { HISTORICAL_EMPIRES, HistoricalEmpire } from '../empires-data';
import { WorldBankService, WorldBankDataPoint, WorldBankIndicator, WorldBankTopic } from '../world-bank.service';
import { Model3dLoaderService, GraphicsPerformancePreset, FpsTelemetry } from '../services/model-3d-loader.service';

export interface SpatialQueryResultRow {
  name: string;
  category: string;
  metric1: string;
  metric2: string;
  lat: number;
  lng: number;
}

export interface QuizQuestion {
  id: string;
  type: 'capital' | 'flag' | 'location' | 'income' | 'general';
  questionText: string;
  countryCode: string;
  countryName: string;
  correctAnswer: string;
  options: string[];
  explanation?: string;
}

export interface FxRateInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateVsUsd: number;
}

export interface SearchResultItem {
  name: string;
  category: string;
  flag: string;
  lat: number;
  lng: number;
  code?: string;
}

@Component({
  selector: 'app-geolibre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './geolibre.html',
  styleUrl: './geolibre.css'
})
export class GeolibreComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapCanvas', { static: false }) mapCanvasRef!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private maplibregl: any = null;
  private activeMarkers: any[] = [];
  private vesselMarkers: any[] = [];
  private vesselAnimationTimer: any = null;
  private timelineTimer: any = null;
  private vesselTickStep: number = 0;

  // Primary Active GIS View Mode Tab
  activeTabMode: 'globe' | 'quiz' | 'forex' | 'maritime' | 'empires' | 'indicators' = 'globe';

  // Temporal Timeline state (1990 - 2024)
  selectedYear: number = 2024;
  isPlayingTimeline: boolean = false;

  // 3D Extrusion mode state
  extrusionMetric: 'none' | 'gdp' | 'population' | 'area' = 'none';

  // Vector Layer Toggles
  showCountriesLayer: boolean = true;
  showMaritimeLayer: boolean = false;
  showFxNodesLayer: boolean = true;
  showEmpiresLayer: boolean = true;
  showShippingLanes: boolean = false;

  // Camera & Vector Map state
  currentLat: number = 30.5;
  currentLng: number = 32.3;
  currentZoom: number = 5;
  currentPitch: number = 45;
  currentBearing: number = -15;
  activePresetId: string = 'suez';

  // Selected Detail Popup Card State
  selectedDetailCard: {
    title: string;
    flag?: string;
    category: string;
    details: { label: string; value: string }[];
    summary?: string;
    lat: number;
    lng: number;
    countryId?: string;
  } | null = null;

  // Basemap style switcher state (Default changed to 'satellite' as requested)
  activeStyleId: 'dark' | 'satellite' | 'topo' | 'positron' | 'vector' = 'satellite';
  mapStyles = {
    satellite: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri World Imagery'
        }
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    dark: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    topo: {
      version: 8,
      sources: {
        'open-topo': {
          type: 'raster',
          tiles: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: 'OpenTopoMap'
        }
      },
      layers: [
        {
          id: 'open-topo-layer',
          type: 'raster',
          source: 'open-topo',
          minzoom: 0,
          maxzoom: 17
        }
      ]
    },
    positron: {
      version: 8,
      sources: {
        'carto-light': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© CARTO'
        }
      },
      layers: [
        {
          id: 'carto-light-layer',
          type: 'raster',
          source: 'carto-light',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    vector: {
      version: 8,
      name: 'OpenStreetMap Vector',
      sources: {
        'osm-tiles': {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-tiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  };

  // World Bank & Multi-Source Indicators State
  wbTopics: WorldBankTopic[] = [];
  selectedTopicId: number = 8; // Health by default
  wbIndicators: WorldBankIndicator[] = [];
  selectedIndicatorId: string = 'WHO:WHOSIS_000001';
  selectedIndicatorName: string = 'WHO: Life expectancy at birth (years)';
  selectedIndicatorDesc: string = 'Average number of years a newborn is expected to live in full health.';
  wbIndicatorData: WorldBankDataPoint[] = [];
  loadingIndicatorData: boolean = false;

  // Interactive 3D Quiz Challenge Engine State
  quizScore: number = 0;
  quizStreak: number = 0;
  quizCurrentIndex: number = 1;
  quizTotalQuestions: number = 10;
  quizAnswered: boolean = false;
  quizFeedback: string | null = null;
  quizIsCorrect: boolean = false;
  quizCompleted: boolean = false;
  currentQuizQuestion: QuizQuestion | null = null;

  // General Landmark Trivia Bank
  private generalTriviaBank = [
    { questionText: "Which country is home to the iconic ivory-white marble Taj Mahal?", countryCode: "IN", countryName: "India", correctAnswer: "India", explanation: "Built in 1632 in Agra" },
    { questionText: "In which country can you visit the ancient Great Pyramids of Giza?", countryCode: "EG", countryName: "Egypt", correctAnswer: "Egypt", explanation: "Constructed over 4,500 years ago along the Nile" },
    { questionText: "Which nation is home to the Eiffel Tower and the Louvre Museum?", countryCode: "FR", countryName: "France", correctAnswer: "France", explanation: "The Louvre is the world's largest art museum" },
    { questionText: "Which country features the ancient Colosseum and the floating canals of Venice?", countryCode: "IT", countryName: "Italy", correctAnswer: "Italy", explanation: "Heart of ancient Roman architecture" },
    { questionText: "Which country built the historic Great Wall extending over 13,000 miles?", countryCode: "CN", countryName: "China", correctAnswer: "China", explanation: "Built across ancient northern borders" },
    { questionText: "Which country is home to the historic 15th-century Inca citadel of Machu Picchu?", countryCode: "PE", countryName: "Peru", correctAnswer: "Peru", explanation: "Perched high in the Andes Mountains" },
    { questionText: "Which country features the iconic sail-shaped Sydney Opera House?", countryCode: "AU", countryName: "Australia", correctAnswer: "Australia", explanation: "World Heritage landmark on Sydney Harbour" },
    { questionText: "Which country received the Statue of Liberty as a gift from France in 1886?", countryCode: "US", countryName: "United States", correctAnswer: "United States", explanation: "Stands on Liberty Island in New York" },
    { questionText: "Which nation features the 98-foot tall Christ the Redeemer statue in Rio de Janeiro?", countryCode: "BR", countryName: "Brazil", correctAnswer: "Brazil", explanation: "Overlooks Rio from Corcovado mountain" },
    { questionText: "Which island nation is famous for Mount Fuji and cherry blossom gardens?", countryCode: "JP", countryName: "Japan", correctAnswer: "Japan", explanation: "Mount Fuji is an active volcanic peak" },
    { questionText: "Which Scandinavian country is world-famous for its dramatic natural fjords?", countryCode: "NO", countryName: "Norway", correctAnswer: "Norway", explanation: "Features over 1,000 coastal sea fjords" },
    { questionText: "Which Middle Eastern country is home to the ancient rock-cut city of Petra?", countryCode: "JO", countryName: "Jordan", correctAnswer: "Jordan", explanation: "Carved into rose-red sandstone cliffs" }
  ];

  // FX Telemetry Financial Hub Nodes & Converter State
  fxAmount: number = 100;
  fxBaseCurrency: string = 'USD';
  fxRates: { [key: string]: FxRateInfo } = {
    USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rateVsUsd: 1.0 },
    EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rateVsUsd: 0.92 },
    GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rateVsUsd: 0.77 },
    JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rateVsUsd: 155.4 },
    INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rateVsUsd: 83.5 },
    CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', rateVsUsd: 1.37 },
    AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rateVsUsd: 1.51 },
    CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: 'CHF', rateVsUsd: 0.89 },
    CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rateVsUsd: 7.25 },
    AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED', flag: '🇦🇪', rateVsUsd: 3.67 },
    SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rateVsUsd: 1.34 },
    BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rateVsUsd: 5.55 }
  };

  fxHubNodes = [
    { name: 'New York (NYSE/FED)', code: 'USD', rate: '$1.00', flag: '🇺🇸', lat: 40.7128, lng: -74.006 },
    { name: 'London (LSE/BOE)', code: 'GBP', rate: '£0.77', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
    { name: 'Frankfurt (ECB)', code: 'EUR', rate: '€0.92', flag: '🇪🇺', lat: 50.1109, lng: 8.6821 },
    { name: 'Tokyo (BOJ)', code: 'JPY', rate: '¥155.4', flag: '🇯🇵', lat: 35.6762, lng: 139.6503 },
    { name: 'Singapore (MAS)', code: 'SGD', rate: 'S$1.34', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
    { name: 'Dubai (DIFC)', code: 'AED', rate: 'AED 3.67', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },
    { name: 'Sydney (RBA)', code: 'AUD', rate: 'A$1.51', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 },
    { name: 'Mumbai (NSE/RBI)', code: 'INR', rate: '₹83.5', flag: '🇮🇳', lat: 19.0760, lng: 72.8777 }
  ];

  // Maritime Cargo Fleet Animation State
  cargoVesselFleet: CargoVessel[] = CARGO_VESSEL_FLEET;

  // Historical Empires State
  empiresList: HistoricalEmpire[] = HISTORICAL_EMPIRES;
  selectedEmpireId: string = 'gupta-empire';
  selectedEmpire: HistoricalEmpire | null = HISTORICAL_EMPIRES[0];
  empireEraFilter: string = 'All';
  timelineEraYear: number = 400;

  get formattedTimelineYear(): string {
    return this.timelineEraYear > 0 ? `${this.timelineEraYear} CE` : `${Math.abs(this.timelineEraYear)} BCE`;
  }

  Math = Math;

  // Search Bar State
  searchQuery: string = '';
  searchResults: SearchResultItem[] = [];
  isSearchOpen: boolean = false;

  // Web Audio Synthesizer SFX State
  audioMuted: boolean = false;
  private audioCtx: AudioContext | null = null;

  // Spatial SQL Engine state
  sqlQuery: string = 'SELECT name, region, incomeLevel, capitalCity FROM countries WHERE incomeLevel = "High income" ORDER BY name ASC LIMIT 10';
  queryExecutionTime: string = '0.04 ms';
  queryResultCount: number = 0;
  queryResults: SpatialQueryResultRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geoJsonService: GeoJsonExportService,
    private wbService: WorldBankService,
    private model3dLoader: Model3dLoaderService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.wbTopics = this.wbService.getTopics();
    this.wbIndicators = this.wbService.getIndicatorsByTopic(this.selectedTopicId);
  }

  get fpsTelemetry(): FpsTelemetry {
    return this.model3dLoader.getFpsTelemetry();
  }

  get active3dPreset(): GraphicsPerformancePreset {
    return this.model3dLoader.getPerformancePreset();
  }

  set3dPerformancePreset(preset: GraphicsPerformancePreset): void {
    this.model3dLoader.setPerformancePreset(preset);
    this.playUiSound('click');
    if (this.map) {
      const optimalDpr = this.model3dLoader.getOptimalDPR(preset);
      // Adjust canvas resolution dynamically based on selected preset
      const canvas = this.map.getCanvas();
      if (canvas) {
        canvas.style.transform = `scale(1)`;
      }
    }
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['mode']) {
        const m = params['mode'];
        if (['globe', 'quiz', 'forex', 'maritime', 'empires', 'indicators'].includes(m)) {
          this.setTabMode(m as any);
        }
      }
      if (params['lat'] && params['lng']) {
        this.currentLat = parseFloat(params['lat']);
        this.currentLng = parseFloat(params['lng']);
        this.currentZoom = params['zoom'] ? parseInt(params['zoom'], 10) : 6;
        this.activePresetId = 'custom';
        if (this.map) {
          this.flyToTarget(this.currentLng, this.currentLat, this.currentZoom, 45, 0);
        }
      }
    });

    this.runSpatialQuery();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initMapLibreEngine();
  }

  ngOnDestroy(): void {
    if (this.timelineTimer) clearInterval(this.timelineTimer);
    if (this.vesselAnimationTimer) clearInterval(this.vesselAnimationTimer);
    this.clearActiveMarkers();
    if (this.map) {
      if (typeof this.model3dLoader.disposeHierarchy === 'function') {
        this.model3dLoader.disposeHierarchy(this.map);
      }
      this.map.remove();
      this.map = null;
    }
  }

  // ------------------------------------------------------------------
  // GIS Mode Tab Switcher & Navigation
  // ------------------------------------------------------------------
  setTabMode(mode: 'globe' | 'quiz' | 'forex' | 'maritime' | 'empires' | 'indicators'): void {
    this.activeTabMode = mode;
    this.playUiSound('select');

    if (mode === 'quiz') {
      this.startQuiz();
    } else if (mode === 'maritime') {
      this.showMaritimeLayer = false;
      this.showShippingLanes = false;
      this.jumpToPreset('suez');
    } else if (mode === 'forex') {
      this.showFxNodesLayer = true;
      this.jumpToPreset('europe');
    } else if (mode === 'empires') {
      this.showEmpiresLayer = true;
      this.selectEmpire('gupta-empire');
    } else if (mode === 'indicators') {
      this.showCountriesLayer = true;
      this.extrusionMetric = 'gdp';
    }

    this.updateEmpireTerritoryOverlay();
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------
  // MapLibre WebGL Engine Initialization (Optimized Outside Angular Zone)
  // ------------------------------------------------------------------
  private async initMapLibreEngine(): Promise<void> {
    if (!this.mapCanvasRef) return;

    try {
      const maplibreModule = await import('maplibre-gl');
      this.maplibregl = (maplibreModule as any).default || maplibreModule;

      this.ngZone.runOutsideAngular(() => {
        const mapInstance = new this.maplibregl.Map({
          container: this.mapCanvasRef.nativeElement,
          style: this.mapStyles[this.activeStyleId] as any,
          center: [this.currentLng, this.currentLat],
          zoom: this.currentZoom,
          pitch: this.currentPitch,
          bearing: this.currentBearing,
          pixelRatio: this.model3dLoader.getOptimalDPR()
        });

        this.map = mapInstance;

        mapInstance.addControl(new this.maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
        mapInstance.addControl(new this.maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
        mapInstance.addControl(new this.maplibregl.FullscreenControl(), 'top-right');

        let lastMoveTime = 0;
        mapInstance.on('move', () => {
          const now = performance.now();
          if (now - lastMoveTime < 60) return; // Throttle state updates during fast camera drag
          lastMoveTime = now;

          const center = mapInstance.getCenter();
          const lat = center.lat;
          const lng = center.lng;
          const zoom = parseFloat(mapInstance.getZoom().toFixed(2));
          const pitch = Math.round(mapInstance.getPitch());
          const bearing = Math.round(mapInstance.getBearing());

          this.ngZone.run(() => {
            this.currentLat = lat;
            this.currentLng = lng;
            this.currentZoom = zoom;
            this.currentPitch = pitch;
            this.currentBearing = bearing;
            this.cdr.markForCheck();
          });
        });

        mapInstance.on('click', (e: any) => {
          this.ngZone.run(() => {
            this.handleCanvasMapClick(e.lngLat.lat, e.lngLat.lng);
          });
        });

        mapInstance.on('load', () => {
          mapInstance.resize();
          this.ngZone.run(() => {
            this.addShippingLanesLayer();
            this.addEmpireTerritoryLayer();
            this.renderAllVectorLayers();
          });
        });
      });
    } catch (err) {
      console.error('Failed to initialize MapLibre GL JS engine:', err);
    }
  }

  private addShippingLanesLayer(): void {
    if (!this.map) return;
    try {
      if (this.map.getSource('shipping-lanes')) return;

      this.map.addSource('shipping-lanes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[121.5, 31.2], [139.7, 35.6], [180, 40.0], [-180, 40.0], [-122.4, 37.8], [-118.2, 33.7]]
              },
              properties: { name: 'Trans-Pacific Express Corridor', color: '#38bdf8' }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[121.5, 31.2], [103.8, 1.35], [80.0, 6.0], [56.2, 26.5], [43.3, 12.6], [32.3, 30.5], [25.0, 35.0], [1.5, 51.0], [4.4, 51.9]]
              },
              properties: { name: 'Asia-Europe Silk Sea Route', color: '#06b6d4' }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[-79.7, 9.1], [-74.0, 40.7], [-20.0, 45.0], [-0.1, 51.5], [4.4, 51.9]]
              },
              properties: { name: 'Trans-Atlantic Highway', color: '#818cf8' }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[56.2, 26.5], [72.8, 19.0], [103.8, 1.35], [121.5, 31.2]]
              },
              properties: { name: 'Persian Gulf Energy Route', color: '#f59e0b' }
            },
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: [[103.8, 1.35], [18.5, -34.3], [-0.1, 51.5]]
              },
              properties: { name: 'Cape of Good Hope Bypass Route', color: '#c084fc' }
            }
          ]
        }
      });

      this.map.addLayer({
        id: 'shipping-lanes-lines',
        type: 'line',
        source: 'shipping-lanes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': this.showShippingLanes ? 'visible' : 'none'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.85
        }
      });
    } catch (e) {
      console.warn('Failed adding shipping lanes layer:', e);
    }
  }

  // ------------------------------------------------------------------
  // Historical Empires Shaded Region Layer Construction
  // ------------------------------------------------------------------
  private addEmpireTerritoryLayer(): void {
    if (!this.map) return;
    try {
      if (!this.map.getSource('empire-territories')) {
        this.map.addSource('empire-territories', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // Shaded glowing territory circles covering spanned empire countries
        this.map.addLayer({
          id: 'empire-territories-layer',
          type: 'circle',
          source: 'empire-territories',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 45, 5, 110, 8, 240],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.42,
            'circle-stroke-width': 3,
            'circle-stroke-color': '#ffffff',
            'circle-blur': 0.2
          }
        });

        // Glowing center core orbs
        this.map.addLayer({
          id: 'empire-territories-core',
          type: 'circle',
          source: 'empire-territories',
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 2, 12, 5, 30, 8, 70],
            'circle-color': ['get', 'color'],
            'circle-opacity': 0.85,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffd700'
          }
        });
      }
      this.updateEmpireTerritoryOverlay();
    } catch (e) {
      console.warn('Failed adding empire territory layer:', e);
    }
  }

  private updateEmpireTerritoryOverlay(): void {
    if (!this.map || !this.map.getSource('empire-territories')) return;

    if (!this.showEmpiresLayer || !this.selectedEmpire) {
      this.map.getSource('empire-territories').setData({
        type: 'FeatureCollection',
        features: []
      });
      return;
    }

    const empire = this.selectedEmpire;
    const features: any[] = [];
    const color = empire.color || '#f59e0b';

    empire.countryCodes.forEach(code => {
      const countryKey = Object.keys(COUNTRIES_DATA).find(k => k.toLowerCase() === code.toLowerCase());
      if (countryKey && COUNTRIES_DATA[countryKey]) {
        const c = COUNTRIES_DATA[countryKey];
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);

        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            properties: {
              name: c.name,
              empireName: empire.name,
              color: color
            }
          });
        }
      }
    });

    const coords = empire.capitalCoords;
    const capLng = (coords.cx - 500) * (360 / 1000);
    const capLat = (250 - coords.cy) * (180 / 500);

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [capLng, capLat]
      },
      properties: {
        name: empire.capitalCity,
        empireName: empire.name,
        color: '#ffd700',
        isCapital: true
      }
    });

    this.map.getSource('empire-territories').setData({
      type: 'FeatureCollection',
      features
    });
  }

  handleCanvasMapClick(clickedLat: number, clickedLng: number): void {
    let closestCountry: CountryData | null = null;
    let minDistance = Infinity;

    Object.values(COUNTRIES_DATA).forEach(c => {
      const lat = parseFloat(c.latitude);
      const lng = parseFloat(c.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const dist = Math.hypot(lat - clickedLat, lng - clickedLng);
        if (dist < minDistance) {
          minDistance = dist;
          closestCountry = c;
        }
      }
    });

    if (closestCountry && minDistance < 25) {
      const country: CountryData = closestCountry;
      if (this.activeTabMode === 'quiz' && this.currentQuizQuestion && !this.quizAnswered) {
        this.submitQuizAnswer(country.name);
      } else {
        this.openCountryTelemetryCard(country, clickedLat, clickedLng);
      }
    }
  }

  openCountryTelemetryCard(c: CountryData, lat: number, lng: number): void {
    this.playUiSound('select');
    this.selectedDetailCard = {
      title: `${c.flag || '🌐'} ${c.name} (${this.selectedYear})`,
      category: `Country • ${c.region?.value || 'Global'}`,
      countryId: c.id,
      details: [
        { label: '🏛️ Capital City', value: c.capitalCity || 'N/A' },
        { label: '📅 Active Year', value: `${this.selectedYear}` },
        { label: '💰 Income Level', value: c.incomeLevel?.value || 'N/A' },
        { label: '🗣️ Languages', value: c.languages || 'N/A' },
        { label: '💵 Currency', value: c.currencies || 'N/A' },
        { label: '📐 Land Area', value: c.area ? c.area.toLocaleString() + ' km²' : 'N/A' },
        { label: '🌐 Region / Subregion', value: `${c.region?.value || 'N/A'} / ${c.subregion || 'N/A'}` },
        { label: '📍 Coordinates', value: `${lat.toFixed(2)}°, ${lng.toFixed(2)}°` }
      ],
      summary: `ISO Code: ${c.id} (${c.iso2Code}) • Country ID: ${c.id}`,
      lat,
      lng
    };

    this.loadIndicatorDataForCountry(c.id);
    this.flyToTarget(lng, lat, 6, 50, 15);
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------
  // World Bank & Multi-Source Indicators Integration
  // ------------------------------------------------------------------
  indicatorNoticeMessage: string | null = null;

  onTopicChange(event: Event): void {
    const topicId = parseInt((event.target as HTMLSelectElement).value, 10);
    this.selectedTopicId = topicId;
    this.wbIndicators = this.wbService.getIndicatorsByTopic(topicId);
    this.indicatorNoticeMessage = null;

    if (this.wbIndicators.length > 0) {
      this.selectedIndicatorId = this.wbIndicators[0].id;
      this.selectedIndicatorName = this.wbIndicators[0].name;
      this.selectedIndicatorDesc = this.wbIndicators[0].sourceNote || '';

      if (this.selectedDetailCard?.countryId) {
        this.loadIndicatorDataForCountry(this.selectedDetailCard.countryId);
      }
    }
    this.cdr.markForCheck();
  }

  onIndicatorChange(event: Event): void {
    this.selectedIndicatorId = (event.target as HTMLSelectElement).value;
    this.indicatorNoticeMessage = null;
    const found = this.wbIndicators.find(i => i.id === this.selectedIndicatorId);
    if (found) {
      this.selectedIndicatorName = found.name;
      this.selectedIndicatorDesc = found.sourceNote || '';
    }
    if (this.selectedDetailCard?.countryId) {
      this.loadIndicatorDataForCountry(this.selectedDetailCard.countryId);
    }
    this.cdr.markForCheck();
  }

  loadIndicatorDataForCountry(countryCode: string): void {
    if (!countryCode || !this.selectedIndicatorId) return;
    this.loadingIndicatorData = true;
    this.wbIndicatorData = [];
    this.indicatorNoticeMessage = null;

    this.wbService.getIndicatorData(countryCode, this.selectedIndicatorId).subscribe({
      next: (data) => {
        this.wbIndicatorData = data;
        this.loadingIndicatorData = false;
        
        const found = this.wbIndicators.find(i => i.id === this.selectedIndicatorId);
        if (found) {
          this.selectedIndicatorName = found.name;
          this.selectedIndicatorDesc = found.sourceNote || '';
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingIndicatorData = false;
        this.cdr.markForCheck();
      }
    });
  }

  get formattedIndicatorPoints(): { year: number; value: number; percent: number }[] {
    if (!this.wbIndicatorData || this.wbIndicatorData.length === 0) return [];
    const valid = this.wbIndicatorData.filter(d => d.value !== null && !isNaN(d.value!));
    if (valid.length === 0) return [];

    const values = valid.map(d => d.value!);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    return valid.map(d => ({
      year: d.year,
      value: d.value!,
      percent: Math.max(12, Math.min(100, Math.round(((d.value! - min) / range) * 85 + 15)))
    }));
  }

  chartStyleOverride: 'auto' | 'bars' | 'area' | 'progress' | 'stepped' = 'auto';

  setChartStyleOverride(style: 'auto' | 'bars' | 'area' | 'progress' | 'stepped'): void {
    this.chartStyleOverride = style;
    this.cdr.markForCheck();
  }

  get chartStyle(): 'bars' | 'area' | 'progress' | 'stepped' {
    if (this.chartStyleOverride !== 'auto') {
      return this.chartStyleOverride;
    }
    const name = (this.selectedIndicatorName || '').toLowerCase();
    const topic = this.selectedTopicId;

    if (name.includes('%') || name.includes('ratio') || name.includes('prevalence') || name.includes('access to') || topic === 11 || topic === 17) {
      return 'progress';
    }
    if (name.includes('life expectancy') || name.includes('mortality') || name.includes('health') || topic === 8) {
      return 'area';
    }
    if (name.includes('co2') || name.includes('emissions') || name.includes('disaster') || name.includes('renewable') || topic === 19 || topic === 6 || topic === 5) {
      return 'stepped';
    }
    return 'bars';
  }

  get svgAreaPath(): string {
    const pts = this.formattedIndicatorPoints;
    if (pts.length === 0) return '';
    const width = 800;
    const height = 170;
    const step = width / (pts.length - 1 || 1);

    const coords = pts.map((pt, i) => {
      const x = (i * step).toFixed(1);
      const y = (height - (pt.percent / 100) * (height - 30) - 15).toFixed(1);
      return `${x},${y}`;
    });

    const linePath = `M ${coords.join(' L ')}`;
    return `${linePath} L ${width},${height} L 0,${height} Z`;
  }

  get svgLinePath(): string {
    const pts = this.formattedIndicatorPoints;
    if (pts.length === 0) return '';
    const width = 800;
    const height = 170;
    const step = width / (pts.length - 1 || 1);

    const coords = pts.map((pt, i) => {
      const x = (i * step).toFixed(1);
      const y = (height - (pt.percent / 100) * (height - 30) - 15).toFixed(1);
      return `${x},${y}`;
    });

    return `M ${coords.join(' L ')}`;
  }

  get svgPoints(): { x: number; y: number; year: number; value: number }[] {
    const pts = this.formattedIndicatorPoints;
    if (pts.length === 0) return [];
    const width = 800;
    const height = 170;
    const step = width / (pts.length - 1 || 1);

    return pts.map((pt, i) => ({
      x: parseFloat((i * step).toFixed(1)),
      y: parseFloat((height - (pt.percent / 100) * (height - 30) - 15).toFixed(1)),
      year: pt.year,
      value: pt.value
    }));
  }

  get indicatorMinVal(): string {
    if (!this.wbIndicatorData || this.wbIndicatorData.length === 0) return 'N/A';
    const vals = this.wbIndicatorData.filter(d => d.value !== null).map(d => d.value!);
    if (vals.length === 0) return 'N/A';
    return Math.min(...vals).toLocaleString();
  }

  get indicatorMaxVal(): string {
    if (!this.wbIndicatorData || this.wbIndicatorData.length === 0) return 'N/A';
    const vals = this.wbIndicatorData.filter(d => d.value !== null).map(d => d.value!);
    if (vals.length === 0) return 'N/A';
    return Math.max(...vals).toLocaleString();
  }

  get indicatorLatestVal(): string {
    if (!this.wbIndicatorData || this.wbIndicatorData.length === 0) return 'N/A';
    const valid = this.wbIndicatorData.filter(d => d.value !== null);
    if (valid.length === 0) return 'N/A';
    const latest = valid[valid.length - 1];
    return `${latest.value!.toLocaleString()} (${latest.year})`;
  }

  // ------------------------------------------------------------------
  // Interactive 3D Vector Quiz Engine
  // ------------------------------------------------------------------
  startQuiz(): void {
    this.quizScore = 0;
    this.quizStreak = 0;
    this.quizCurrentIndex = 1;
    this.quizCompleted = false;
    this.generateQuizQuestion();
  }

  private isCleanCountryName(name: string): boolean {
    if (!name) return false;
    const lower = name.toLowerCase();
    if (lower.includes('(') || lower.includes('income') || lower.includes('total') || lower.includes('world') || lower.includes('eligible') || lower.includes('&')) {
      return false;
    }
    return true;
  }

  generateQuizQuestion(): void {
    this.quizAnswered = false;
    this.quizFeedback = null;

    const countryKeys = Object.keys(COUNTRIES_DATA);
    if (countryKeys.length === 0) return;

    const isGeneralTrivia = Math.random() < 0.6 && this.generalTriviaBank.length > 0;

    if (isGeneralTrivia) {
      const qItem = this.generalTriviaBank[Math.floor(Math.random() * this.generalTriviaBank.length)];
      // QC Rule: Pick 3 clean, real country distractors + 1 correct answer, shuffle all 4 randomly
      const distractors = new Set<string>();
      let attempts = 0;
      while (distractors.size < 3 && attempts < 100) {
        attempts++;
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rData = COUNTRIES_DATA[rKey];
        if (rData && this.isCleanCountryName(rData.name) && rData.name.toLowerCase() !== qItem.correctAnswer.toLowerCase()) {
          distractors.add(rData.name);
        }
      }

      const options = [qItem.correctAnswer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuizQuestion = {
        id: qItem.countryCode,
        type: 'general',
        questionText: qItem.questionText,
        countryCode: qItem.countryCode,
        countryName: qItem.countryName,
        correctAnswer: qItem.correctAnswer,
        options,
        explanation: qItem.explanation
      };

      const cData = COUNTRIES_DATA[qItem.countryCode];
      if (cData) {
        const lat = parseFloat(cData.latitude);
        const lng = parseFloat(cData.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          this.flyToTarget(lng, lat, 5, 50, 0);
        }
      }
    } else {
      let targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
      let attempts = 0;
      while ((!this.isCleanCountryName(COUNTRIES_DATA[targetKey]?.name) || !COUNTRIES_DATA[targetKey]?.capitalCity) && attempts < 30) {
        targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        attempts++;
      }
      const target = COUNTRIES_DATA[targetKey];

      // QC Rule: Pick 3 clean, real capital distractors + 1 correct answer, shuffle all 4 randomly
      const distractors = new Set<string>();
      let capAttempts = 0;
      while (distractors.size < 3 && capAttempts < 100) {
        capAttempts++;
        const rKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
        const rData = COUNTRIES_DATA[rKey];
        if (rData && this.isCleanCountryName(rData.name) && rData.capitalCity && rData.capitalCity.toLowerCase() !== target.capitalCity.toLowerCase()) {
          distractors.add(rData.capitalCity);
        }
      }

      const options = [target.capitalCity, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      this.currentQuizQuestion = {
        id: targetKey,
        type: 'capital',
        questionText: `What is the capital city of ${target.flag || '🌐'} ${target.name}?`,
        countryCode: targetKey,
        countryName: target.name,
        correctAnswer: target.capitalCity,
        options,
        explanation: `${target.capitalCity} is the capital city of ${target.name}`
      };

      const lat = parseFloat(target.latitude);
      const lng = parseFloat(target.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        this.flyToTarget(lng, lat, 6, 50, 0);
      }
    }

    this.cdr.markForCheck();
  }

  submitQuizAnswer(chosenAnswer: string): void {
    if (this.quizAnswered || !this.currentQuizQuestion) return;

    this.quizAnswered = true;
    const choice = chosenAnswer.trim().toLowerCase();
    const correct = this.currentQuizQuestion.correctAnswer.trim().toLowerCase();
    const cCode = this.currentQuizQuestion.countryCode.toLowerCase();
    const cName = this.currentQuizQuestion.countryName.toLowerCase();

    const isCorrect = (choice === correct || choice === cCode || choice === cName);
    this.quizIsCorrect = isCorrect;

    if (isCorrect) {
      this.quizStreak++;
      const bonus = (this.quizStreak > 1) ? this.quizStreak * 10 : 0;
      this.quizScore += 100 + bonus;
      const exp = this.currentQuizQuestion.explanation ? ` — ${this.currentQuizQuestion.explanation}` : '';
      this.quizFeedback = `🎉 Correct! ${this.currentQuizQuestion.countryName}${exp}`;
      this.playUiSound('correct');
    } else {
      this.quizStreak = 0;
      const exp = this.currentQuizQuestion.explanation ? ` — ${this.currentQuizQuestion.explanation}` : '';
      this.quizFeedback = `❌ Incorrect. Correct answer: ${this.currentQuizQuestion.correctAnswer}${exp}`;
      this.playUiSound('wrong');
    }

    this.cdr.markForCheck();
  }

  nextQuizQuestion(): void {
    if (this.quizCurrentIndex >= this.quizTotalQuestions) {
      this.quizCompleted = true;
      this.playUiSound('select');
    } else {
      this.quizCurrentIndex++;
      this.generateQuizQuestion();
    }
    this.cdr.markForCheck();
  }

  // ------------------------------------------------------------------
  // Live Forex Currency Telemetry Matrix
  // ------------------------------------------------------------------
  onFxAmountInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.fxAmount = isNaN(val) ? 0 : val;
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  setFxBaseCurrency(code: string): void {
    this.fxBaseCurrency = code;
    this.playUiSound('click');
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  get convertedFxRates(): { code: string; name: string; symbol: string; flag: string; convertedValue: number }[] {
    const baseInfo = this.fxRates[this.fxBaseCurrency] || this.fxRates['USD'];
    const usdAmount = this.fxAmount / baseInfo.rateVsUsd;

    return Object.values(this.fxRates).map(rateInfo => {
      return {
        code: rateInfo.code,
        name: rateInfo.name,
        symbol: rateInfo.symbol,
        flag: rateInfo.flag,
        convertedValue: usdAmount * rateInfo.rateVsUsd
      };
    });
  }

  // ------------------------------------------------------------------
  // Historical Empires Time Machine
  // ------------------------------------------------------------------
  selectEmpire(empireId: string): void {
    this.selectedEmpireId = empireId;
    const found = HISTORICAL_EMPIRES.find(e => e.id === empireId);
    if (found) {
      this.selectedEmpire = found;
      this.timelineEraYear = found.peakYear;
      this.playUiSound('select');

      const coords = found.capitalCoords;
      const lng = (coords.cx - 500) * (360 / 1000);
      const lat = (250 - coords.cy) * (180 / 500);

      this.selectedDetailCard = {
        title: `${found.flagEmoji} ${found.name}`,
        category: `Historical Empire • ${found.era} Era`,
        details: [
          { label: '⏳ Span', value: found.yearSpan },
          { label: '👑 Founder/Ruler', value: found.founderOrRuler },
          { label: '🏛️ Capital', value: found.capitalCity },
          { label: '📐 Peak Area', value: found.peakAreaSqKm }
        ],
        summary: `${found.summary} Key Achievements: ${found.keyAchievements.join(' • ')}`,
        lat,
        lng
      };

      this.flyToTarget(lng, lat, 6, 55, -20);
      this.updateEmpireTerritoryOverlay();
      this.renderAllVectorLayers();
    }
    this.cdr.markForCheck();
  }

  onTimelineEraScrub(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.timelineEraYear = val;

    let closestEmp = this.empiresList[0];
    let minDiff = Math.abs(closestEmp.peakYear - val);

    for (const emp of this.empiresList) {
      const diff = Math.abs(emp.peakYear - val);
      if (diff < minDiff) {
        minDiff = diff;
        closestEmp = emp;
      }
    }

    if (closestEmp && closestEmp.id !== this.selectedEmpireId) {
      this.selectEmpire(closestEmp.id);
    } else {
      this.updateEmpireTerritoryOverlay();
    }
    this.cdr.markForCheck();
  }

  setEmpireEraFilter(era: string): void {
    this.empireEraFilter = era;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  get filteredEmpires(): HistoricalEmpire[] {
    if (this.empireEraFilter === 'All') {
      return this.empiresList;
    }
    return this.empiresList.filter(e => e.era === this.empireEraFilter);
  }

  // ------------------------------------------------------------------
  // Global Country Search & Quick-Fly Panel
  // ------------------------------------------------------------------
  onSearchInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      this.isSearchOpen = false;
      return;
    }

    const results: SearchResultItem[] = [];

    Object.values(COUNTRIES_DATA).forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.id.toLowerCase() === q || c.capitalCity?.toLowerCase().includes(q)) {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          results.push({
            name: c.name,
            category: `Country (${c.region?.value || 'Global'})`,
            flag: c.flag || '🌐',
            lat,
            lng,
            code: c.id
          });
        }
      }
    });

    WORLD_CANALS.forEach(cn => {
      if (cn.name.toLowerCase().includes(q) || cn.country.toLowerCase().includes(q)) {
        results.push({
          name: cn.name,
          category: `Maritime Canal (${cn.country})`,
          flag: cn.flag || '🚢',
          lat: cn.coordinates.lat,
          lng: cn.coordinates.lng
        });
      }
    });

    STRATEGIC_CHOKEPOINTS.forEach(chk => {
      if (chk.name.toLowerCase().includes(q) || chk.country.toLowerCase().includes(q)) {
        results.push({
          name: chk.name,
          category: `Strategic Chokepoint (${chk.status})`,
          flag: '🚨',
          lat: chk.coordinates.lat,
          lng: chk.coordinates.lng
        });
      }
    });

    this.searchResults = results.slice(0, 8);
    this.isSearchOpen = this.searchResults.length > 0;
    this.cdr.markForCheck();
  }

  selectSearchResult(item: SearchResultItem): void {
    this.searchQuery = item.name;
    this.isSearchOpen = false;

    if (item.code && COUNTRIES_DATA[item.code]) {
      this.openCountryTelemetryCard(COUNTRIES_DATA[item.code], item.lat, item.lng);
    } else {
      this.flyToTarget(item.lng, item.lat, 7, 55, 10);
    }
  }

  // ------------------------------------------------------------------
  // Animated Vessel Fleet Motion Engine
  // ------------------------------------------------------------------
  private startVesselFleetAnimation(): void {
    this.vesselAnimationTimer = setInterval(() => {
      this.vesselTickStep++;
      if (this.showMaritimeLayer && this.map) {
        this.updateVesselMarkerPositions();
      }
    }, 2500);
  }

  private renderVesselMarkers(): void {
    this.vesselMarkers.forEach(m => m.remove());
    this.vesselMarkers = [];

    if (!this.showMaritimeLayer || !this.map || !this.maplibregl) return;

    this.cargoVesselFleet.forEach((vessel, idx) => {
      const offset = ((this.vesselTickStep * 0.05 + idx * 0.2) % 1);
      const wps = vessel.waypoints;
      const startWp = wps[0];
      const endWp = wps[wps.length - 1];

      const lng = (startWp.x + (endWp.x - startWp.x) * offset - 500) * (360 / 1000);
      const lat = (250 - (startWp.y + (endWp.y - startWp.y) * offset)) * (180 / 500);

      const el = document.createElement('div');
      el.className = 'custom-3d-marker vessel-marker';
      el.innerHTML = `🚢`;
      el.title = `${vessel.name} (${vessel.vesselType})`;

      el.addEventListener('click', (ev: Event) => {
        ev.stopPropagation();
        this.selectedDetailCard = {
          title: `🚢 ${vessel.name}`,
          category: `${vessel.vesselType} • ${vessel.shippingLine || vessel.flagName}`,
          details: [
            { label: '🚢 IMO Number', value: `${vessel.imoNumber || 'N/A'}` },
            { label: '📡 MMSI / Callsign', value: `${vessel.mmsiNumber || 'N/A'} / ${vessel.callsign || 'N/A'}` },
            { label: '🏢 Shipping Line', value: vessel.shippingLine || 'N/A' },
            { label: '📍 Flag Registry', value: `${vessel.flagEmoji} ${vessel.flagName}` },
            { label: '📐 Dimensions', value: `${vessel.lengthMeters}m x ${vessel.beamMeters || 'N/A'}m (Draft: ${vessel.draftMeters || 'N/A'}m)` },
            { label: '📦 Capacity & DWT', value: `${vessel.capacityTEU} (${vessel.dwtTons ? vessel.dwtTons.toLocaleString() + ' DWT' : ''})` },
            { label: '⚡ Speed & Heading', value: `${vessel.speedKnots} knots @ ${vessel.headingDeg.toFixed(0)}°` },
            { label: '📍 Dynamic GPS Coords', value: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E` },
            { label: '🏁 Route', value: `${vessel.originPort} ➔ ${vessel.destinationPort}` }
          ],
          summary: `Active vessel navigating trade corridor ${vessel.corridorId.toUpperCase()}`,
          lat,
          lng
        };
        this.flyToTarget(lng, lat, 7, 55, 0);
        this.cdr.markForCheck();
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map!);

      this.vesselMarkers.push(marker);
    });
  }

  private updateVesselMarkerPositions(): void {
    if (!this.map || !this.maplibregl || !this.showMaritimeLayer) return;

    if (this.vesselMarkers.length === 0) {
      this.renderVesselMarkers();
      return;
    }

    this.cargoVesselFleet.forEach((vessel, idx) => {
      const offset = ((this.vesselTickStep * 0.05 + idx * 0.2) % 1);
      const wps = vessel.waypoints;
      const startWp = wps[0];
      const endWp = wps[wps.length - 1];

      const lng = (startWp.x + (endWp.x - startWp.x) * offset - 500) * (360 / 1000);
      const lat = (250 - (startWp.y + (endWp.y - startWp.y) * offset)) * (180 / 500);

      if (this.vesselMarkers[idx]) {
        this.vesselMarkers[idx].setLngLat([lng, lat]);
      }
    });
  }

  // ------------------------------------------------------------------
  // Web Audio Synthesizer SFX Engine
  // ------------------------------------------------------------------
  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    if (!this.audioMuted) {
      this.playUiSound('click');
    }
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'hover' | 'select' | 'zoom' | 'correct' | 'wrong' | 'fly'): void {
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
      } else if (type === 'fly' || type === 'zoom') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(130, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // ------------------------------------------------------------------
  // Map Camera Controls & Vector Marker Rendering
  // ------------------------------------------------------------------
  togglePlayTimeline(): void {
    this.isPlayingTimeline = !this.isPlayingTimeline;
    if (this.isPlayingTimeline) {
      this.timelineTimer = setInterval(() => {
        this.selectedYear = this.selectedYear >= 2024 ? 1990 : this.selectedYear + 1;
        this.renderAllVectorLayers();
        this.cdr.markForCheck();
      }, 800);
    } else {
      if (this.timelineTimer) clearInterval(this.timelineTimer);
    }
    this.cdr.markForCheck();
  }

  onYearChange(event: Event): void {
    this.selectedYear = parseInt((event.target as HTMLInputElement).value, 10);
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  setYear(year: number): void {
    this.selectedYear = year;
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  focusSelectedCountry(): void {
    if (this.selectedDetailCard) {
      this.flyToTarget(this.selectedDetailCard.lng, this.selectedDetailCard.lat, 6, 50, 15);
    }
  }

  setExtrusionMetric(metric: 'none' | 'gdp' | 'population' | 'area'): void {
    this.extrusionMetric = metric;
    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  switchBasemapStyle(styleId: 'dark' | 'satellite' | 'topo' | 'positron' | 'vector'): void {
    this.activeStyleId = styleId;
    if (this.map) {
      this.map.setStyle(this.mapStyles[styleId] as any);
      this.map.once('style.load', () => {
        this.map?.resize();
        this.addShippingLanesLayer();
        this.addEmpireTerritoryLayer();
        this.renderAllVectorLayers();
      });
    }
    this.cdr.markForCheck();
  }

  toggleLayer(layerName: 'countries' | 'maritime' | 'fx' | 'empires'): void {
    if (layerName === 'countries') this.showCountriesLayer = !this.showCountriesLayer;
    if (layerName === 'maritime') this.showMaritimeLayer = !this.showMaritimeLayer;
    if (layerName === 'fx') this.showFxNodesLayer = !this.showFxNodesLayer;
    if (layerName === 'empires') {
      this.showEmpiresLayer = !this.showEmpiresLayer;
      this.updateEmpireTerritoryOverlay();
    }

    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  private clearActiveMarkers(): void {
    this.activeMarkers.forEach(m => m.remove());
    this.activeMarkers = [];
    this.vesselMarkers.forEach(m => m.remove());
    this.vesselMarkers = [];
  }

  private renderAllVectorLayers(): void {
    if (!this.map || !this.maplibregl) return;
    this.clearActiveMarkers();

    // 1. Countries Data Vector Layer
    if (this.showCountriesLayer) {
      Object.values(COUNTRIES_DATA).forEach(c => {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);

        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          const el = document.createElement('div');
          el.className = 'custom-3d-marker country-marker';
          el.title = `${c.name} (${this.selectedYear})`;

          if (this.extrusionMetric === 'gdp') {
            const heightPx = Math.min(60, Math.max(12, (c.area || 100000) / 40000));
            el.style.height = `${heightPx}px`;
            el.style.borderRadius = '6px';
            el.style.background = 'linear-gradient(to top, #0284c7, #00f2fe)';
          } else if (this.extrusionMetric === 'population') {
            const heightPx = Math.min(70, Math.max(14, (c.name.length * 4)));
            el.style.height = `${heightPx}px`;
            el.style.borderRadius = '6px';
            el.style.background = 'linear-gradient(to top, #10b981, #34d399)';
          } else if (this.extrusionMetric === 'area') {
            const heightPx = Math.min(80, Math.max(10, (c.area ? c.area / 100000 : 15)));
            el.style.height = `${heightPx}px`;
            el.style.borderRadius = '6px';
            el.style.background = 'linear-gradient(to top, #f59e0b, #fbbf24)';
          }

          el.addEventListener('click', (ev: Event) => {
            ev.stopPropagation();
            if (this.activeTabMode === 'quiz' && this.currentQuizQuestion && !this.quizAnswered) {
              this.submitQuizAnswer(c.name);
            } else {
              this.openCountryTelemetryCard(c, lat, lng);
            }
          });

          const marker = new this.maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(this.map!);

          this.activeMarkers.push(marker);
        }
      });
    }

    // 2. Maritime Layer
    if (this.showMaritimeLayer) {
      WORLD_CANALS.forEach(c => {
        const el = document.createElement('div');
        el.className = 'custom-3d-marker canal-marker';
        el.title = c.name;

        el.addEventListener('click', (ev: Event) => {
          ev.stopPropagation();
          this.selectedDetailCard = {
            title: `${c.flag} ${c.name}`,
            category: `Verified Artificial Canal • ${c.country}`,
            details: [
              { label: '📏 Total Canal Length', value: c.lengthKm },
              { label: '🔒 Lock Systems', value: c.lockCount },
              { label: '🚢 Annual Transits', value: c.annualVessels },
              { label: '📐 Max Draft / Beam', value: `${c.maxDraftMeters || 'N/A'}m Draft • ${c.maxBeamMeters || 'N/A'}m Beam` },
              { label: '📦 Annual Metric Cargo', value: c.annualCargoTons || 'N/A' },
              { label: '🌊 Waterway Type', value: c.waterwayType }
            ],
            summary: c.summary,
            lat: c.coordinates.lat,
            lng: c.coordinates.lng
          };
          this.flyToTarget(c.coordinates.lng, c.coordinates.lat, 8, 60, 20);
          this.cdr.markForCheck();
        });

        const marker = new this.maplibregl.Marker({ element: el })
          .setLngLat([c.coordinates.lng, c.coordinates.lat])
          .addTo(this.map!);

        this.activeMarkers.push(marker);
      });

      STRATEGIC_CHOKEPOINTS.forEach(chk => {
        const el = document.createElement('div');
        el.className = 'custom-3d-marker chokepoint-marker';
        el.title = chk.name;

        el.addEventListener('click', (ev: Event) => {
          ev.stopPropagation();
          this.selectedDetailCard = {
            title: `🚨 ${chk.name}`,
            category: `Strategic Chokepoint • ${chk.country}`,
            details: [
              { label: '⚠️ Security Status', value: chk.status },
              { label: '🚢 Daily Vessels', value: `${chk.dailyVessels} Ships/day` },
              { label: '🛢️ Daily Oil Flow', value: chk.dailyOilBarrels || 'N/A' },
              { label: '📦 Global Trade Share', value: chk.cargoVolume },
              { label: '⛽ Key Commodities', value: chk.keyCommodities.join(', ') }
            ],
            summary: chk.summary,
            lat: chk.coordinates.lat,
            lng: chk.coordinates.lng
          };
          this.flyToTarget(chk.coordinates.lng, chk.coordinates.lat, 8, 60, -15);
          this.cdr.markForCheck();
        });

        const marker = new this.maplibregl.Marker({ element: el })
          .setLngLat([chk.coordinates.lng, chk.coordinates.lat])
          .addTo(this.map!);

        this.activeMarkers.push(marker);
      });

      this.renderVesselMarkers();
    }

    // 3. FX Telemetry Currency Hub Nodes
    if (this.showFxNodesLayer) {
      const baseInfo = this.fxRates[this.fxBaseCurrency] || this.fxRates['USD'];
      const usdAmt = this.fxAmount / baseInfo.rateVsUsd;

      this.fxHubNodes.forEach(node => {
        const rateInfo = this.fxRates[node.code] || { rateVsUsd: 1.0, symbol: '$' };
        const converted = (usdAmt * rateInfo.rateVsUsd).toFixed(2);

        const el = document.createElement('div');
        el.className = 'custom-3d-marker fx-marker';
        el.innerHTML = `<span style="font-size: 0.7rem; font-weight: 800; color: #000;">${node.code}</span>`;

        el.addEventListener('click', (ev: Event) => {
          ev.stopPropagation();
          this.selectedDetailCard = {
            title: `💱 ${node.name}`,
            category: `FX Currency Telemetry Hub`,
            details: [
              { label: '💱 Currency Code', value: `${node.flag} ${node.code}` },
              { label: `💵 Value (${this.fxAmount} ${this.fxBaseCurrency})`, value: `${rateInfo.symbol || ''} ${converted}` },
              { label: '📈 Live FX vs USD', value: node.rate },
              { label: '📍 Location', value: `${node.lat.toFixed(2)}°, ${node.lng.toFixed(2)}°` }
            ],
            summary: 'Global financial liquidity node tracking real-time exchange rate telemetry.',
            lat: node.lat,
            lng: node.lng
          };
          this.flyToTarget(node.lng, node.lat, 7, 50, 0);
          this.cdr.markForCheck();
        });

        const marker = new this.maplibregl.Marker({ element: el })
          .setLngLat([node.lng, node.lat])
          .addTo(this.map!);

        this.activeMarkers.push(marker);
      });
    }
  }

  onPitchChange(event: Event): void {
    const pitchVal = parseInt((event.target as HTMLInputElement).value, 10);
    this.currentPitch = pitchVal;
    if (this.map) {
      this.map.setPitch(pitchVal);
    }
  }

  onBearingChange(event: Event): void {
    const bearingVal = parseInt((event.target as HTMLInputElement).value, 10);
    this.currentBearing = bearingVal;
    if (this.map) {
      this.map.setBearing(bearingVal);
    }
  }

  resetNorth(): void {
    this.currentBearing = 0;
    this.currentPitch = 45;
    if (this.map) {
      this.map.easeTo({ bearing: 0, pitch: 45, duration: 1000 });
    }
  }

  jumpToPreset(preset: string): void {
    this.activePresetId = preset;
    let targetLng = 32.3;
    let targetLat = 30.5;
    let targetZoom = 7;
    let targetPitch = 55;
    let targetBearing = -20;

    switch (preset) {
      case 'suez':
        targetLng = 32.3;
        targetLat = 30.5;
        targetZoom = 8;
        targetPitch = 60;
        targetBearing = 25;
        break;
      case 'panama':
        targetLng = -79.7;
        targetLat = 9.1;
        targetZoom = 9;
        targetPitch = 55;
        targetBearing = -45;
        break;
      case 'malacca':
        targetLng = 101.5;
        targetLat = 2.5;
        targetZoom = 7;
        targetPitch = 50;
        targetBearing = 15;
        break;
      case 'europe':
        targetLng = 10.0;
        targetLat = 50.0;
        targetZoom = 5;
        targetPitch = 45;
        targetBearing = 0;
        break;
      case 'tokyo':
        targetLng = 139.6503;
        targetLat = 35.6762;
        targetZoom = 10;
        targetPitch = 60;
        targetBearing = 30;
        break;
      case 'usa':
        targetLng = -98.5795;
        targetLat = 39.8283;
        targetZoom = 4;
        targetPitch = 40;
        targetBearing = 0;
        break;
    }

    this.flyToTarget(targetLng, targetLat, targetZoom, targetPitch, targetBearing);
  }

  flyToTarget(lng: number, lat: number, zoom: number = 6, pitch: number = 45, bearing: number = 0): void {
    this.playUiSound('fly');
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        duration: 2500,
        essential: true
      });
    }
  }

  closeDetailCard(): void {
    this.selectedDetailCard = null;
    this.cdr.markForCheck();
  }

  exportCountriesGeoJSON(): void {
    const geojson = this.geoJsonService.exportCountriesToGeoJSON();
    this.geoJsonService.downloadGeoJSON(geojson, 'world-explorer-countries-3d.geojson');
  }

  exportMaritimeGeoJSON(): void {
    const geojson = this.geoJsonService.exportMaritimeToGeoJSON();
    this.geoJsonService.downloadGeoJSON(geojson, 'world-explorer-maritime-3d.geojson');
  }

  setQueryPreset(presetType: string): void {
    if (presetType === 'high_income') {
      this.sqlQuery = 'SELECT name, region, incomeLevel, capitalCity FROM countries WHERE incomeLevel = "High income" ORDER BY name ASC LIMIT 10';
    } else if (presetType === 'maritime_canals') {
      this.sqlQuery = 'SELECT name, country, lengthKm, annualVessels FROM maritime_canals ORDER BY name ASC';
    } else if (presetType === 'landlocked') {
      this.sqlQuery = 'SELECT name, region, capitalCity, area FROM countries WHERE subregion LIKE "%Central%" OR borders_count > 4 ORDER BY area DESC';
    } else if (presetType === 'chokepoints') {
      this.sqlQuery = 'SELECT name, country, dailyVessels, cargoVolume FROM strategic_chokepoints WHERE status = "High Security Alert"';
    }
    this.runSpatialQuery();
  }

  runSpatialQuery(): void {
    const startTime = performance.now();
    const results: SpatialQueryResultRow[] = [];

    const queryLower = this.sqlQuery.toLowerCase();

    if (queryLower.includes('maritime_canals')) {
      WORLD_CANALS.forEach(c => {
        results.push({
          name: c.name,
          category: 'Maritime Canal',
          metric1: `Length: ${c.lengthKm}`,
          metric2: `Traffic: ${c.annualVessels}`,
          lat: c.coordinates.lat,
          lng: c.coordinates.lng
        });
      });
    } else if (queryLower.includes('chokepoints') || queryLower.includes('strategic')) {
      STRATEGIC_CHOKEPOINTS.forEach(chk => {
        results.push({
          name: chk.name,
          category: 'Chokepoint',
          metric1: `Vessels: ${chk.dailyVessels}/day`,
          metric2: `Status: ${chk.status}`,
          lat: chk.coordinates.lat,
          lng: chk.coordinates.lng
        });
      });
    } else {
      const allCountries = Object.values(COUNTRIES_DATA);
      let filtered = allCountries;

      if (queryLower.includes('high income')) {
        filtered = allCountries.filter(c => c.incomeLevel?.value?.toLowerCase().includes('high income'));
      } else if (queryLower.includes('central') || queryLower.includes('borders')) {
        filtered = allCountries.filter(c => (c.borders && c.borders.length > 3) || c.subregion?.toLowerCase().includes('central'));
      }

      filtered.slice(0, 15).forEach(c => {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          results.push({
            name: `${c.flag || '🏳️'} ${c.name}`,
            category: c.region?.value || 'Country',
            metric1: `Capital: ${c.capitalCity || 'N/A'}`,
            metric2: `Income: ${c.incomeLevel?.value || 'N/A'}`,
            lat,
            lng
          });
        }
      });
    }

    const endTime = performance.now();
    this.queryExecutionTime = `${(endTime - startTime).toFixed(2)} ms`;
    this.queryResults = results;
    this.queryResultCount = results.length;
  }
}
