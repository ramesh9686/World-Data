import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GeoJsonExportService } from '../services/geojson-export.service';
import { AisStreamService, AisVesselPosition, AisQcStats } from '../services/ais-stream.service';
import { Model3dLoaderService, GraphicsPerformancePreset, FpsTelemetry } from '../services/model-3d-loader.service';
import { seaRoute } from 'searoute-ts';
import { environment } from '../../environments/environment';

import {
  MaritimeChokepoint,
  MaritimeCanal,
  ShippingCorridor,
  MaritimePort,
  CargoVessel,
  STRATEGIC_CHOKEPOINTS,
  WORLD_CANALS,
  SHIPPING_CORRIDORS,
  GLOBAL_MEGAPORTS,
  CARGO_VESSEL_FLEET
} from '../maritime-data';

export interface RoutePortOption {
  id: string;
  name: string;
  country: string;
  flag: string;
  lng: number;
  lat: number;
  locode: string;
}

export interface VoyageAssessment {
  api_source: string;
  environmental: {
    co2_emissions_tons: number;
    fuel_consumption_tons: number;
    cii_rating: 'A' | 'B' | 'C' | 'D' | 'E';
  };
  financial: {
    total_voyage_cost_usd: number;
    bunker_fuel_cost_usd: number;
    canal_tolls_usd: number;
    carbon_tax_eu_ets_usd: number;
  };
  risk_assessment?: {
    overall_risk_score: number;
    weather_risk_level: string;
    security_advisory: string;
  };
  navigation?: {
    origin_locode: string;
    destination_locode: string;
    route_type: 'shortest_maritime_corridor' | 'deep_water_transoceanic';
    weather_risk_index: number;
  };
}

import { DecryptedTextComponent, CountUpComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-maritime',
  standalone: true,
  imports: [CommonModule, FormsModule, DecryptedTextComponent, CountUpComponent, SpotlightDirective],
  templateUrl: './maritime.html',
  styleUrl: './maritime.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaritimeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapCanvas', { static: false }) mapCanvasRef!: ElementRef<HTMLDivElement>;

  // MapLibre WebGL Engine State
  private map: any = null;
  private maplibregl: any = null;
  private activeMarkers: any[] = [];
  private vesselMarkers: any[] = [];
  private vesselMotionTimer: any = null;
  private vesselTickStep: number = 0;

  // Camera & Telemetry
  currentLat: number = 20.0;
  currentLng: number = 65.0;
  currentZoom: number = 2.5;
  currentPitch: number = 35;
  currentBearing: number = 0;

  activeStyleId: 'satellite' | 'dark' | 'fiord' | 'bright' | 'demotiles' | 'topo' | 'vector' = 'satellite';



  mapStyles: { [key: string]: any } = {
    fiord: 'https://tiles.openfreemap.org/styles/fiord',
    bright: 'https://tiles.openfreemap.org/styles/bright',
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
            'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
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
    demotiles: 'https://demotiles.maplibre.org/style.json',
    topo: {

      version: 8,
      sources: {
        'open-topo': {
          type: 'raster',
          tiles: [
            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png'
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
    vector: {
      version: 8,
      sources: {
        'osm-raster': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap'
        }
      },
      layers: [
        {
          id: 'osm-layer',
          type: 'raster',
          source: 'osm-raster',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  };

  // Major Global Ports for Route Calculation

  availablePorts: RoutePortOption[] = [
    { id: 'shanghai', name: 'Shanghai (Port of Shanghai)', country: 'China', flag: '🇨🇳', lng: 121.47, lat: 31.23, locode: 'CNSHA' },
    { id: 'singapore', name: 'Port of Singapore', country: 'Singapore', flag: '🇸🇬', lng: 103.82, lat: 1.35, locode: 'SGSIN' },
    { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', flag: '🇳🇱', lng: 4.48, lat: 51.92, locode: 'NLRTM' },
    { id: 'los_angeles', name: 'Port of Los Angeles', country: 'United States', flag: '🇺🇸', lng: -118.24, lat: 33.74, locode: 'USLAX' },
    { id: 'dubai', name: 'Jebel Ali Port (Dubai)', country: 'UAE', flag: '🇦🇪', lng: 55.06, lat: 24.98, locode: 'AEDXB' },
    { id: 'mumbai', name: 'JNPT Port (Mumbai)', country: 'India', flag: '🇮🇳', lng: 72.88, lat: 18.95, locode: 'INBOM' },
    { id: 'london', name: 'Port of London', country: 'United Kingdom', flag: '🇬🇧', lng: -0.12, lat: 51.50, locode: 'GBLON' },
    { id: 'tokyo', name: 'Port of Tokyo / Yokohama', country: 'Japan', flag: '🇯🇵', lng: 139.64, lat: 35.44, locode: 'JPTYO' },
    { id: 'suez', name: 'Suez Canal Terminal (Port Said)', country: 'Egypt', flag: '🇪🇬', lng: 32.30, lat: 30.50, locode: 'EGSUZ' },
    { id: 'panama', name: 'Panama Canal Terminal (Colon)', country: 'Panama', flag: '🇵🇦', lng: -79.55, lat: 8.95, locode: 'PAPAN' },
    { id: 'santos', name: 'Port of Santos', country: 'Brazil', flag: '🇧🇷', lng: -46.33, lat: -23.96, locode: 'BRSSZ' },
    { id: 'capetown', name: 'Port of Cape Town', country: 'South Africa', flag: '🇿🇦', lng: 18.42, lat: -33.92, locode: 'ZACPT' }
  ];

  // Interactive Route Calculator State
  selectedOriginId: string = 'shanghai';
  selectedDestinationId: string = 'rotterdam';
  calculatedRouteGeoJson: any = null;
  calculatedDistanceNmi: number = 0;
  calculatedDistanceKm: number = 0;
  calculatedEtaDays: number = 0;
  calculatedCo2Tons: number = 0;
  calculatedDetourRatio: number = 1.0;
  isCalculatingRoute: boolean = false;

  // Datasets
  chokepoints = STRATEGIC_CHOKEPOINTS;
  canals = WORLD_CANALS;
  corridors = SHIPPING_CORRIDORS;
  megaports = GLOBAL_MEGAPORTS;
  vessels: CargoVessel[] = CARGO_VESSEL_FLEET;

  // Selected Detail Inspector State
  selectedChokepoint: MaritimeChokepoint | null = null;
  selectedCanal: MaritimeCanal | null = null;
  selectedVessel: CargoVessel | null = null;
  selectedPort: MaritimePort | null = null;
  selectedCargoFilter: 'All' | 'Container' | 'Tanker' | 'LNG' | 'Bulk' = 'All';

  // Live AIS Telemetry Modal & SFX
  isAisModalOpen: boolean = false;
  showAisKey: boolean = false;
  liveAisMode: 'simulated_live' | 'custom_api' = 'custom_api';
  customAisApiKey: string = environment.aisStreamApiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem('aisstream_key') : null) || '';
  aisPingCount: number = 0;
  isAisStreamConnected: boolean = false;
  liveAisVessels: AisVesselPosition[] = [];
  trackedLiveVesselCount: number = 0;
  selectedLiveAisVessel: AisVesselPosition | null = null;
  qcStats: AisQcStats = {
    totalPackets: 0,
    validPackets: 0,
    uniqueVessels: 0,
    nullIslandErrors: 0,
    outOfBoundsErrors: 0,
    invalidMmsiErrors: 0,
    speedErrors: 0,
    dataIntegrityPct: '100.0%'
  };
  private liveAisMarkersMap: Map<number, any> = new Map();
  audioMuted: boolean = false;
  private audioCtx: AudioContext | null = null;

  // Voyage Engine State
  arcVesselType: string = 'container';
  arcLoadCondition: 'laden' | 'ballast' = 'laden';
  arcSpeedKnots: number = 16;
  voyageAssessment: VoyageAssessment | null = null;

  get totalActiveVesselsCount(): number {
    return this.trackedLiveVesselCount;
  }


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
    private geoJsonService: GeoJsonExportService,
    private router: Router,
    public aisStreamService: AisStreamService,
    private model3dLoader: Model3dLoaderService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.selectedChokepoint = null; // No default card blocking the map!

    // Subscribe to AISStream WebSocket telemetry
    this.aisStreamService.isConnected$.subscribe(connected => {
      this.isAisStreamConnected = connected;
      this.cdr.markForCheck();
    });


    this.aisStreamService.pingCount$.subscribe(count => {
      if (count > 0) {
        this.aisPingCount = count;
      }
      this.cdr.markForCheck();
    });

    this.aisStreamService.qcStats$.subscribe(stats => {
      this.qcStats = stats;
      this.cdr.markForCheck();
    });

    // Throttled 600ms update loop outside Angular zone to eliminate lag
    this.ngZone.runOutsideAngular(() => {
      setInterval(() => {
        const count = this.aisStreamService.getActiveVessels().length;
        if (this.trackedLiveVesselCount !== count) {
          this.ngZone.run(() => {
            this.trackedLiveVesselCount = count;
            this.cdr.markForCheck();
          });
        }
        this.updateVesselGeoJsonData();
      }, 600);
    });

    // Auto-connect to real-time AISStream.io WebSocket stream
    this.connectAisStream();
  }


  async ngAfterViewInit(): Promise<void> {
    setTimeout(async () => {
      await this.initMapLibreEngine();
    }, 100);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (this.map) this.map.resize();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.vesselMotionTimer) clearInterval(this.vesselMotionTimer);
    this.aisStreamService.disconnect();
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
        mapInstance.addControl(new this.maplibregl.ScaleControl({ unit: 'nautical' }), 'bottom-left');
        mapInstance.addControl(new this.maplibregl.FullscreenControl(), 'top-right');

        this.ngZone.run(() => {
          this.renderAllMapLayers();
        });

        setTimeout(() => {
          if (this.map) this.map.resize();
        }, 50);

        let lastMoveTime = 0;
        mapInstance.on('move', () => {
          const now = performance.now();
          if (now - lastMoveTime < 60) return; // Throttle state updates during camera movement
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

        mapInstance.on('load', () => {
          mapInstance.resize();
          this.ngZone.run(() => {
            this.initRouteLayer();
            this.initLiveVesselClusterLayer();
            this.renderAllMapLayers();
            this.calculateSeaRoute();
            setTimeout(() => {
              if (this.map) this.map.resize();
            }, 300);
          });
        });

      });
    } catch (err) {
      console.error('Failed to initialize MapLibre GL JS engine in Maritime component:', err);
    }
  }

  private initRouteLayer(): void {
    if (!this.map) return;
    try {
      if (this.map.getSource('calculated-sea-route')) return;

      this.map.addSource('calculated-sea-route', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // Neon Cyan Outer Glow Path Line
      this.map.addLayer({
        id: 'sea-route-glow',
        type: 'line',
        source: 'calculated-sea-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#00f2fe',
          'line-width': 7,
          'line-opacity': 0.4,
          'line-blur': 3
        }
      });

      // Solid Bright Core Route Line
      this.map.addLayer({
        id: 'sea-route-core',
        type: 'line',
        source: 'calculated-sea-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 3.5
        }
      });
    } catch (e) {
      console.warn('Failed adding sea route layer:', e);
    }
  }

  // Vessel Search & Category Filter State
  selectedTypeFilter: string = 'ALL';
  searchQuery: string = '';

  setFilter(filter: string): void {
    this.selectedTypeFilter = filter;
    this.updateVesselGeoJsonData();
    this.cdr.markForCheck();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.updateVesselGeoJsonData();
    this.cdr.markForCheck();
  }

  onSearchOrFilterChange(): void {
    this.updateVesselGeoJsonData();
    this.cdr.markForCheck();
  }

  private initLiveVesselClusterLayer(): void {
    if (!this.map) return;
    try {
      if (this.map.getSource('live-vessels-geojson')) return;

      this.map.addSource('live-vessels-geojson', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: false
      });

      // Unclustered Individual Ship Circle Layer
      this.map.addLayer({
        id: 'unclustered-vessels',
        type: 'circle',
        source: 'live-vessels-geojson',
        paint: {
          'circle-color': ['get', 'vesselColor'],
          'circle-radius': 7,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff',
          'circle-opacity': 0.95
        }
      });

      // Click Ship -> Inspect Vessel
      this.map.on('click', 'unclustered-vessels', (e: any) => {
        const props = e.features[0].properties;
        if (props.vesselJson) {
          const vessel = JSON.parse(props.vesselJson);
          this.ngZone.run(() => {
            this.selectLiveAisVessel(vessel);
          });
        }
      });

      // Cursor pointer styling
      this.map.on('mouseenter', 'unclustered-vessels', () => { this.map.getCanvas().style.cursor = 'pointer'; });
      this.map.on('mouseleave', 'unclustered-vessels', () => { this.map.getCanvas().style.cursor = ''; });

      this.updateVesselGeoJsonData();

    } catch (e) {
      console.warn('GeoJSON layer init error:', e);
    }
  }


  updateVesselGeoJsonData(): void {
    if (!this.map) return;
    const source = this.map.getSource('live-vessels-geojson');
    if (!source) return;

    const allVessels = this.aisStreamService.getActiveVessels();
    const query = (this.searchQuery || '').trim().toLowerCase();

    const filtered = allVessels.filter(v => {
      let matchType = true;
      if (this.selectedTypeFilter === 'CARGO') {
        matchType = (v.vesselTypeName || '').includes('Container') || (v.vesselTypeName || '').includes('Carrier');
      } else if (this.selectedTypeFilter === 'TANKER') {
        matchType = (v.vesselTypeName || '').includes('Tanker');
      } else if (this.selectedTypeFilter === 'PASSENGER') {
        matchType = (v.vesselTypeName || '').includes('Passenger') || (v.vesselTypeName || '').includes('Cruise');
      } else if (this.selectedTypeFilter === 'FISHING') {
        matchType = (v.vesselTypeName || '').includes('Fishing');
      }

      let matchQuery = true;
      if (query) {
        matchQuery = v.shipName.toLowerCase().includes(query) || String(v.mmsi).includes(query) || (v.country || '').toLowerCase().includes(query);
      }

      return matchType && matchQuery;
    });

    const features = filtered.map(v => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [v.longitude, v.latitude]
      },
      properties: {
        mmsi: v.mmsi,
        shipName: v.shipName,
        speedKnots: v.speedKnots,
        headingDeg: v.headingDeg || v.courseDeg || 0,
        vesselColor: v.vesselColor || '#10b981',
        vesselJson: JSON.stringify(v)
      }
    }));

    source.setData({
      type: 'FeatureCollection',
      features: features
    });
  }


  // ------------------------------------------------------------------
  // real-world Maritime Sea Route Calculation using `searoute-ts`
  // ------------------------------------------------------------------
  calculateSeaRoute(): void {
    const originPort = this.availablePorts.find(p => p.id === this.selectedOriginId);
    const destPort = this.availablePorts.find(p => p.id === this.selectedDestinationId);

    if (!originPort || !destPort || originPort.id === destPort.id) {
      return;
    }

    this.isCalculatingRoute = true;
    this.playUiSound('sonar');


    try {
      const originCoords: [number, number] = [originPort.lng, originPort.lat];
      const destCoords: [number, number] = [destPort.lng, destPort.lat];

      // Invoke searoute-ts seaRoute algorithm
      const routeFeature: any = seaRoute(originCoords, destCoords);

      if (routeFeature && routeFeature.geometry) {
        this.calculatedRouteGeoJson = routeFeature;
        const props = routeFeature.properties || {};

        this.calculatedDistanceNmi = Math.round(props.length || 0);
        this.calculatedDistanceKm = Math.round(this.calculatedDistanceNmi * 1.852);
        // Estimated transit days at selected speed
        this.calculatedEtaDays = parseFloat((this.calculatedDistanceNmi / (this.arcSpeedKnots * 24)).toFixed(1));
        this.calculatedCo2Tons = Math.round(this.calculatedDistanceNmi * 0.015 * 28);
        this.calculatedDetourRatio = parseFloat((props.detourRatio || 1.0).toFixed(2));

        if (this.map && this.map.getSource('calculated-sea-route')) {
          this.map.getSource('calculated-sea-route').setData(routeFeature);

          // Fly map camera to midpoint of route
          const coords = routeFeature.geometry.coordinates;
          if (coords && coords.length > 0) {
            const midIndex = Math.floor(coords.length / 2);
            const midPoint = coords[midIndex];
            this.flyToTarget(midPoint[0], midPoint[1], 3.5, 40, 0);
          }
        }

        // Calculate Voyage Assessment using AISStream & searoute kinematic model
        const speed = this.arcSpeedKnots || 16;
        const days = parseFloat((this.calculatedDistanceNmi / (speed * 24)).toFixed(1));
        const fuelRatePerDay = this.arcVesselType === 'container' ? 38 : this.arcVesselType === 'tanker' ? 42 : 28;
        const loadMultiplier = this.arcLoadCondition === 'laden' ? 1.0 : 0.82;
        const fuelTons = Math.round(days * fuelRatePerDay * loadMultiplier);
        const co2Tons = Math.round(fuelTons * 3.114);
        const bunkerCost = fuelTons * 640;
        const isSuez = (originPort.id === 'singapore' || originPort.id === 'shanghai') && destPort.id === 'rotterdam';
        const canalTolls = isSuez ? 320000 : 45000;
        const carbonTax = Math.round(co2Tons * 85 * 0.5);

        this.voyageAssessment = {
          api_source: 'aisstream_searoute_engine',
          environmental: {
            co2_emissions_tons: co2Tons,
            fuel_consumption_tons: fuelTons,
            cii_rating: speed <= 16 ? 'A' : speed <= 18 ? 'B' : 'C'
          },
          financial: {
            total_voyage_cost_usd: bunkerCost + canalTolls + carbonTax,
            bunker_fuel_cost_usd: bunkerCost,
            canal_tolls_usd: canalTolls,
            carbon_tax_eu_ets_usd: carbonTax
          },
          risk_assessment: {
            overall_risk_score: isSuez ? 35 : 12,
            weather_risk_level: speed > 18 ? 'Moderate' : 'Low',
            security_advisory: isSuez ? 'Bab-el-Mandeb & Red Sea Maritime Security Advisory active.' : 'Standard international voyage corridor.'
          }
        };
      }
    } catch (err) {
      console.error('searoute-ts calculation failed:', err);
    } finally {
      this.isCalculatingRoute = false;
      this.cdr.markForCheck();
    }
  }

  swapRoutePorts(): void {
    const temp = this.selectedOriginId;
    this.selectedOriginId = this.selectedDestinationId;
    this.selectedDestinationId = temp;
    this.calculateSeaRoute();
  }


  // ------------------------------------------------------------------
  // Map Markers Rendering (Canals, Chokepoints, Megaports, Vessels)
  // ------------------------------------------------------------------
  private clearActiveMarkers(): void {
    this.activeMarkers.forEach(m => m.remove());
    this.activeMarkers = [];
    this.vesselMarkers.forEach(m => m.remove());
    this.vesselMarkers = [];
  }

  private renderAllMapLayers(): void {
    if (!this.map || !this.maplibregl) return;
    this.clearActiveMarkers();

    // 1. Render Strategic Chokepoints Markers
    this.chokepoints.forEach(cp => {
      const lat = cp.coordinates.lat;
      const lng = cp.coordinates.lng;

      const el = document.createElement('div');
      el.className = 'custom-3d-marker chokepoint-marker';
      el.innerHTML = `🚨`;
      el.title = `Chokepoint: ${cp.name}`;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectChokepoint(cp);
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map!);

      this.activeMarkers.push(marker);
    });

    // 2. Render World Canals Markers
    this.canals.forEach(canal => {
      const lat = canal.coordinates.lat;
      const lng = canal.coordinates.lng;

      const el = document.createElement('div');
      el.className = 'custom-3d-marker canal-marker';
      el.innerHTML = canal.flag || '🏞️';
      el.title = `Canal: ${canal.name}`;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectCanal(canal);
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map!);

      this.activeMarkers.push(marker);
    });

    // 3. Render Container Megaports Markers (Including Asian & Oceanian Ports)
    this.megaports.forEach(port => {
      const lat = port.lat !== undefined ? port.lat : (250 - port.coordinates.cy) * (180 / 500);
      const lng = port.lng !== undefined ? port.lng : (port.coordinates.cx - 500) * (360 / 1000);

      const el = document.createElement('div');
      el.className = 'custom-3d-marker port-marker';
      el.innerHTML = `${port.flag || '🏗️'}`;
      el.title = `Megaport: ${port.name} (${port.country}) - ${port.annualTEU}`;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectPort(port);
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map!);

      this.activeMarkers.push(marker);
    });

    this.renderVesselFleetMarkers();
    this.renderLiveAisStreamMarkers();
  }

  private renderLiveAisStreamMarkers(): void {
    if (!this.map || !this.maplibregl) return;
    const liveVessels = this.aisStreamService.getActiveVessels();
    liveVessels.forEach(v => this.handleLiveAisVesselUpdate(v));
    this.trackedLiveVesselCount = this.liveAisMarkersMap.size;
    this.cdr.markForCheck();
  }

  private handleLiveAisVesselUpdate(vessel: AisVesselPosition): void {
    if (!this.map || !this.maplibregl) return;
    const mmsi = vessel.mmsi;
    let marker = this.liveAisMarkersMap.get(mmsi);

    const rotation = vessel.headingDeg || vessel.courseDeg || 0;
    const color = vessel.vesselColor || '#3b82f6';
    const flag = vessel.countryFlag || '🌐';
    const vesselType = vessel.vesselTypeName || 'Cargo Fleet Carrier';

    if (marker) {
      marker.setLngLat([vessel.longitude, vessel.latitude]);
      const el = marker.getElement();
      const svg = el.querySelector('svg') as HTMLElement;
      if (svg) {
        svg.style.transform = `rotate(${rotation}deg)`;
      }
    } else {
      const el = document.createElement('div');
      el.className = 'custom-3d-marker bridgeview-ship-marker';
      el.style.cursor = 'pointer';
      el.style.zIndex = '100';

      el.innerHTML = `
        <div class="bridgeview-ship-icon-wrapper" title="${vessel.shipName} (${vesselType}) - ${flag} ${vessel.country || 'International'} | SOG: ${vessel.speedKnots} kts | Heading: ${rotation}°">
          <svg width="28" height="28" viewBox="0 0 24 24" style="transform: rotate(${rotation}deg); transition: transform 0.3s ease; filter: drop-shadow(0 0 6px ${color});">
            <path d="M12 2 L18 20 L12 16 L6 20 Z" fill="${color}" stroke="#ffffff" stroke-width="1.8" />
          </svg>
        </div>
      `;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectLiveAisVessel(vessel);
      });

      marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([vessel.longitude, vessel.latitude])
        .addTo(this.map);

      this.liveAisMarkersMap.set(mmsi, marker);
    }
  }



  // ------------------------------------------------------------------
  // Live IMO/AIS Vessel Fleet Rendering
  // ------------------------------------------------------------------
  private renderVesselFleetMarkers(): void {
    this.vesselMarkers.forEach(m => m.remove());
    this.vesselMarkers = [];

    if (!this.map || !this.maplibregl) return;

    this.filteredVessels.forEach((vessel) => {
      const wps = vessel.waypoints;
      const startWp = wps ? wps[0] : { x: 500, y: 250 };

      const lng = vessel.currentLng !== undefined ? vessel.currentLng : (startWp.x - 500) * (360 / 1000);
      const lat = vessel.currentLat !== undefined ? vessel.currentLat : (250 - startWp.y) * (180 / 500);

      const el = document.createElement('div');
      el.className = 'custom-3d-marker vessel-marker';
      const flag = vessel.flagEmoji || '🚢';
      el.innerHTML = `<div class="ship-marker-badge" title="IMO Fleet: ${vessel.name} (${vessel.vesselType}) - ${vessel.flagName}"><span class="ship-icon">🚢</span><span class="flag-tag">${flag}</span></div>`;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.selectVessel(vessel, lat, lng);
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(this.map!);

      this.vesselMarkers.push(marker);
    });
  }

  // ------------------------------------------------------------------
  // Interactive Selection Handlers
  // ------------------------------------------------------------------
  selectChokepoint(cp: MaritimeChokepoint): void {
    this.selectedChokepoint = cp;
    this.selectedCanal = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.flyToTarget(cp.coordinates.lng, cp.coordinates.lat, 6, 50, 0);
    this.playUiSound('sonar');
  }

  selectCanal(canal: MaritimeCanal): void {
    this.selectedCanal = canal;
    this.selectedChokepoint = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.flyToTarget(canal.coordinates.lng, canal.coordinates.lat, 7, 55, 0);
    this.playUiSound('sonar');
  }

  selectPort(port: MaritimePort): void {
    this.selectedPort = port;
    this.selectedChokepoint = null;
    this.selectedCanal = null;
    this.selectedVessel = null;
    const coords = port.coordinates;
    const lat = (250 - coords.cy) * (180 / 500);
    const lng = (coords.cx - 500) * (360 / 1000);
    this.flyToTarget(lng, lat, 7, 55, 0);
    this.playUiSound('select');
  }

  selectVessel(vessel: CargoVessel, lat?: number, lng?: number): void {
    this.selectedVessel = vessel;
    this.selectedChokepoint = null;
    this.selectedCanal = null;
    this.selectedPort = null;

    if (lat !== undefined && lng !== undefined) {
      vessel.currentLat = parseFloat(lat.toFixed(4));
      vessel.currentLng = parseFloat(lng.toFixed(4));
      this.flyToTarget(lng, lat, 6.5, 45, 0);
    }
    this.playUiSound('ping');
  }

  setCargoFilter(filter: 'All' | 'Container' | 'Tanker' | 'LNG' | 'Bulk'): void {
    this.selectedCargoFilter = filter;
    this.renderVesselFleetMarkers();
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  get filteredVessels(): CargoVessel[] {
    if (this.selectedCargoFilter === 'All') return this.vessels;
    return this.vessels.filter(v => {
      if (this.selectedCargoFilter === 'Container' && v.vesselType.includes('Container')) return true;
      if (this.selectedCargoFilter === 'Tanker' && v.vesselType.includes('Tanker')) return true;
      if (this.selectedCargoFilter === 'LNG' && v.vesselType.includes('LNG')) return true;
      if (this.selectedCargoFilter === 'Bulk' && v.vesselType.includes('Bulk')) return true;
      return false;
    });
  }

  // ------------------------------------------------------------------
  // Camera Controls & Navigation
  // ------------------------------------------------------------------
  switchBasemapStyle(styleId: 'fiord' | 'bright' | 'satellite' | 'dark' | 'demotiles' | 'topo' | 'vector'): void {
    this.activeStyleId = styleId;
    if (this.map) {
      const styleDef = this.mapStyles[styleId] || 'https://tiles.openfreemap.org/styles/fiord';

      this.map.setStyle(styleDef as any);
      this.map.once('style.load', () => {
        this.map?.resize();
        this.initRouteLayer();
        this.initLiveVesselClusterLayer();
        this.renderAllMapLayers();
        if (this.calculatedRouteGeoJson) {
          this.map.getSource('calculated-sea-route')?.setData(this.calculatedRouteGeoJson);
        }
      });
    }
    this.cdr.markForCheck();
  }


  flyToTarget(lng: number, lat: number, zoom: number = 6, pitch: number = 45, bearing: number = 0): void {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        pitch: pitch,
        bearing: bearing,
        duration: 1800,
        essential: true
      });
    }
  }

  onPitchChange(event: Event): void {
    const pitch = parseInt((event.target as HTMLInputElement).value, 10);
    this.currentPitch = pitch;
    if (this.map) this.map.setPitch(pitch);
    this.cdr.markForCheck();
  }

  onBearingChange(event: Event): void {
    const bearing = parseInt((event.target as HTMLInputElement).value, 10);
    this.currentBearing = bearing;
    if (this.map) this.map.setBearing(bearing);
    this.cdr.markForCheck();
  }

  resetNorth(): void {
    this.currentPitch = 35;
    this.currentBearing = 0;
    if (this.map) {
      this.map.easeTo({ pitch: 35, bearing: 0, duration: 800 });
    }
    this.cdr.markForCheck();
  }

  openLocationInGeoLibre(lat?: number, lng?: number, zoom: number = 7): void {
    if (lat !== undefined && lng !== undefined) {
      this.router.navigate(['/geolibre'], {
        queryParams: { lat, lng, zoom }
      });
    }
  }

  exportMaritimeGeoJson(): void {
    const geojson = this.geoJsonService.exportMaritimeToGeoJSON();
    this.geoJsonService.downloadGeoJSON(geojson, 'maritime-chokepoints-and-canals.geojson');
  }

  // ------------------------------------------------------------------
  // Live AIS Telemetry & AISStream.io WebSocket Handlers
  // ------------------------------------------------------------------
  connectAisStream(): void {
    if (!this.customAisApiKey) {
      this.customAisApiKey = typeof window !== 'undefined' ? atob('NGI4YTkzMWVmYjhiNTY1NTE5NjkzMTEwMmY3MzA5MTY0Nzk3N2Q5') : '';
    }
    this.aisStreamService.setApiKey(this.customAisApiKey);
    this.aisStreamService.connect();

    this.playUiSound('sonar');
    this.cdr.markForCheck();
  }

  disconnectAisStream(): void {
    this.aisStreamService.disconnect();
    this.liveAisMode = 'simulated_live';
    this.clearLiveAisMarkers();
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  private clearLiveAisMarkers(): void {
    this.liveAisMarkersMap.forEach(m => m.remove());
    this.liveAisMarkersMap.clear();
  }

  openVesselCrossVerification(vessel: AisVesselPosition | null): void {

    if (!vessel || !vessel.mmsi) return;
    const url = vessel.vesselFinderUrl || `https://www.vesselfinder.com/vessels?name=${vessel.mmsi}`;
    window.open(url, '_blank');
  }

  selectLiveAisVessel(vessel: AisVesselPosition): void {
    this.selectedLiveAisVessel = vessel;
    this.selectedChokepoint = null;
    this.selectedCanal = null;
    this.selectedPort = null;
    this.selectedVessel = null;

    this.flyToTarget(vessel.longitude, vessel.latitude, 7, 50, vessel.headingDeg || 0);
    this.playUiSound('ping');
    this.cdr.markForCheck();
  }

  openAisModal(): void {
    this.isAisModalOpen = true;
    this.playUiSound('select');
    this.cdr.markForCheck();
  }

  closeAisModal(): void {
    this.isAisModalOpen = false;
    this.cdr.markForCheck();
  }

  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'sonar' | 'ping' | 'select'): void {
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

      if (type === 'sonar') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'ping') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  }
}
