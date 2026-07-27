import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoJsonExportService } from '../services/geojson-export.service';
import { COUNTRIES_DATA, CountryData } from '../countries-data';
import { WORLD_CANALS, STRATEGIC_CHOKEPOINTS, GLOBAL_MEGAPORTS, CARGO_VESSEL_FLEET, ShippingCorridor, CargoVessel } from '../maritime-data';
import { HISTORICAL_EMPIRES, HistoricalEmpire } from '../empires-data';

export interface SpatialQueryResultRow {
  name: string;
  category: string;
  metric1: string;
  metric2: string;
  lat: number;
  lng: number;
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
  private vesselAnimationTimer: any = null;
  private timelineTimer: any = null;

  // Temporal Timeline state (1990 - 2024)
  selectedYear: number = 2024;
  isPlayingTimeline: boolean = false;

  // 3D Extrusion mode state
  extrusionMetric: 'none' | 'gdp' | 'population' | 'area' = 'none';

  // Vector Layer Toggles
  showCountriesLayer: boolean = true;
  showMaritimeLayer: boolean = true;
  showFxNodesLayer: boolean = true;
  showEmpiresLayer: boolean = true;

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

  // Basemap style switcher state
  activeStyleId: 'dark' | 'satellite' | 'topo' | 'positron' | 'vector' = 'dark';
  mapStyles = {
    dark: {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
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
            'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png'
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

  // FX Telemetry Financial Hub Nodes
  fxHubNodes = [
    { name: 'New York (NYSE/FED)', code: 'USD', rate: '$1.00', flag: '🇺🇸', lat: 40.7128, lng: -74.006 },
    { name: 'London (LSE/BOE)', code: 'GBP', rate: '£0.77', flag: '🇬🇧', lat: 51.5074, lng: -0.1278 },
    { name: 'Frankfurt (ECB)', code: 'EUR', rate: '€0.92', flag: '🇪🇺', lat: 50.1109, lng: 8.6821 },
    { name: 'Tokyo (BOJ)', code: 'JPY', rate: '¥155.4', flag: '🇯🇵', lat: 35.6762, lng: 139.6503 },
    { name: 'Singapore (MAS)', code: 'SGD', rate: 'S$1.34', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
    { name: 'Dubai (DIFC)', code: 'AED', rate: 'AED 3.67', flag: '🇦🇪', lat: 25.2048, lng: 55.2708 },
    { name: 'Sydney (RBA)', code: 'AUD', rate: 'A$1.51', flag: '🇦🇺', lat: -33.8688, lng: 151.2093 }
  ];

  // Spatial SQL Engine state
  sqlQuery: string = 'SELECT name, region, incomeLevel, capitalCity FROM countries WHERE incomeLevel = "High income" ORDER BY name ASC LIMIT 10';
  queryExecutionTime: string = '0.04 ms';
  queryResultCount: number = 0;
  queryResults: SpatialQueryResultRow[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private geoJsonService: GeoJsonExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
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
      this.map.remove();
      this.map = null;
    }
  }

  private async initMapLibreEngine(): Promise<void> {
    if (!this.mapCanvasRef) return;

    try {
      const maplibreModule = await import('maplibre-gl');
      this.maplibregl = (maplibreModule as any).default || maplibreModule;

      const mapInstance = new this.maplibregl.Map({
        container: this.mapCanvasRef.nativeElement,
        style: this.mapStyles[this.activeStyleId] as any,
        center: [this.currentLng, this.currentLat],
        zoom: this.currentZoom,
        pitch: this.currentPitch,
        bearing: this.currentBearing
      });

      this.map = mapInstance;

      mapInstance.addControl(new this.maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');
      mapInstance.addControl(new this.maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
      mapInstance.addControl(new this.maplibregl.FullscreenControl(), 'top-right');

      mapInstance.on('move', () => {
        const center = mapInstance.getCenter();
        this.currentLat = center.lat;
        this.currentLng = center.lng;
        this.currentZoom = parseFloat(mapInstance.getZoom().toFixed(2));
        this.currentPitch = Math.round(mapInstance.getPitch());
        this.currentBearing = Math.round(mapInstance.getBearing());
        this.cdr.markForCheck();
      });

      // Canvas click listener: Finds nearest country or feature
      mapInstance.on('click', (e: any) => {
        this.handleCanvasMapClick(e.lngLat.lat, e.lngLat.lng);
      });

      mapInstance.on('load', () => {
        mapInstance.resize();
        this.renderAllVectorLayers();
      });
    } catch (err) {
      console.error('Failed to initialize MapLibre GL JS engine:', err);
    }
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
      this.openCountryTelemetryCard(closestCountry, clickedLat, clickedLng);
    }
  }

  openCountryTelemetryCard(c: CountryData, lat: number, lng: number): void {
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
    this.flyToTarget(lng, lat, 6, 50, 15);
    this.cdr.markForCheck();
  }

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
        this.renderAllVectorLayers();
      });
    }
    this.cdr.markForCheck();
  }

  toggleLayer(layerName: 'countries' | 'maritime' | 'fx' | 'empires'): void {
    if (layerName === 'countries') this.showCountriesLayer = !this.showCountriesLayer;
    if (layerName === 'maritime') this.showMaritimeLayer = !this.showMaritimeLayer;
    if (layerName === 'fx') this.showFxNodesLayer = !this.showFxNodesLayer;
    if (layerName === 'empires') this.showEmpiresLayer = !this.showEmpiresLayer;

    this.renderAllVectorLayers();
    this.cdr.markForCheck();
  }

  private clearActiveMarkers(): void {
    this.activeMarkers.forEach(m => m.remove());
    this.activeMarkers = [];
  }

  private renderAllVectorLayers(): void {
    if (!this.map || !this.maplibregl) return;
    this.clearActiveMarkers();

    // 1. Countries Data Vector Layer with 3D Extrusion Height Calculation
    if (this.showCountriesLayer) {
      Object.values(COUNTRIES_DATA).forEach(c => {
        const lat = parseFloat(c.latitude);
        const lng = parseFloat(c.longitude);

        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          const el = document.createElement('div');
          el.className = 'custom-3d-marker country-marker';
          el.title = `${c.name} (${this.selectedYear})`;

          // Dynamic Extrusion Column Styling
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
            this.openCountryTelemetryCard(c, lat, lng);
          });

          const marker = new this.maplibregl.Marker({ element: el })
            .setLngLat([lng, lat])
            .addTo(this.map!);

          this.activeMarkers.push(marker);
        }
      });
    }

    // 2. Maritime Routes, Canals & Chokepoints Layer
    if (this.showMaritimeLayer) {
      WORLD_CANALS.forEach(c => {
        const el = document.createElement('div');
        el.className = 'custom-3d-marker canal-marker';
        el.title = c.name;

        el.addEventListener('click', (ev: Event) => {
          ev.stopPropagation();
          this.selectedDetailCard = {
            title: `🇪🇬 ${c.name}`,
            category: `Maritime Canal • ${c.country}`,
            details: [
              { label: '📏 Length', value: c.lengthKm },
              { label: '🔒 Lock System', value: c.lockCount },
              { label: '🚢 Annual Traffic', value: c.annualVessels },
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
            category: `Strategic Bottleneck • ${chk.country}`,
            details: [
              { label: '⚠️ Status Alert', value: chk.status },
              { label: '🚢 Daily Vessels', value: `${chk.dailyVessels} Ships/day` },
              { label: '📦 Cargo Volume', value: chk.cargoVolume },
              { label: '⛽ Key Cargo', value: chk.keyCommodities.join(', ') }
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
    }

    // 3. FX Telemetry Currency Hub Nodes
    if (this.showFxNodesLayer) {
      this.fxHubNodes.forEach(node => {
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

    // 4. Historical Empires Layer
    if (this.showEmpiresLayer) {
      HISTORICAL_EMPIRES.slice(0, 8).forEach(emp => {
        const coords = emp.capitalCoords;
        const lng = (coords.cx - 500) * (360 / 1000);
        const lat = (250 - coords.cy) * (180 / 500);

        const el = document.createElement('div');
        el.className = 'custom-3d-marker empire-marker';
        el.style.backgroundColor = emp.color;
        el.title = emp.name;

        el.addEventListener('click', (ev: Event) => {
          ev.stopPropagation();
          this.selectedDetailCard = {
            title: `🏛️ ${emp.name}`,
            category: `Historical Civilization • ${emp.era} Era`,
            details: [
              { label: '⏳ Peak Era', value: emp.yearSpan },
              { label: '👑 Founder/Ruler', value: emp.founderOrRuler },
              { label: '🏛️ Capital', value: emp.capitalCity },
              { label: '📐 Peak Area', value: emp.peakAreaSqKm }
            ],
            summary: `${emp.summary} Achievements: ${emp.keyAchievements.join(' • ')}`,
            lat,
            lng
          };
          this.flyToTarget(lng, lat, 6, 55, -20);
          this.cdr.markForCheck();
        });

        const marker = new this.maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(this.map!);

        this.activeMarkers.push(marker);
      });
    }
  }

  navigateToModule(modulePath: string): void {
    this.router.navigate([modulePath]);
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
