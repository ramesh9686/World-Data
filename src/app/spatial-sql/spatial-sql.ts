import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES_DATA } from '../countries-data';

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

@Component({
  selector: 'app-spatial-sql',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spatial-sql.html',
  styleUrl: './spatial-sql.css'
})
export class SpatialSqlComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewMapCanvas', { static: false }) previewMapRef!: ElementRef<HTMLDivElement>;

  private map: any = null;
  private maplibregl: any = null;
  private activeMarkers: any[] = [];
  private autoIterateTimer: any = null;

  // Active Mode Tab: 'builder' | 'iterations' | 'presets' | 'code'
  activeWorkbenchTab: 'builder' | 'iterations' | 'presets' | 'code' = 'builder';

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
    },
    {
      category: '🌍 Regional Distributions',
      items: [
        {
          id: 'preset_asia',
          icon: '🏮',
          label: 'Asia Economies',
          desc: 'East, South & Southeast Asia',
          sql: `SELECT name, region AS category, capital AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE region LIKE '%Asia%' ORDER BY population DESC LIMIT 12;`,
          flyLng: 105, flyLat: 20, zoom: 3
        },
        {
          id: 'preset_africa',
          icon: '🌍',
          label: 'African Continent',
          desc: 'Sovereign African nations',
          sql: `SELECT name, region AS category, capital AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE region LIKE '%Africa%' ORDER BY population DESC LIMIT 12;`,
          flyLng: 20, flyLat: 5, zoom: 3.2
        },
        {
          id: 'preset_europe',
          icon: '🏰',
          label: 'European Union & Region',
          desc: 'European nations & capitals',
          sql: `SELECT name, region AS category, capital AS metric1, population AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE region LIKE '%Europe%' ORDER BY population DESC LIMIT 12;`,
          flyLng: 15, flyLat: 50, zoom: 4
        }
      ]
    },
    {
      category: '📍 Spatial Buffer & Radius Search',
      items: [
        {
          id: 'preset_suez_radius',
          icon: '📍',
          label: 'Suez 2,500 km Radius',
          desc: 'Countries within 2,500 km of Suez',
          sql: `SELECT name, 'Suez Proximity Radius' AS category, capital AS metric1, 'Within 2,500 km' AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE ST_DWithin(ST_Point(longitude, latitude), ST_Point(32.3, 30.5), 2500000) ORDER BY name ASC LIMIT 10;`,
          flyLng: 32.3, flyLat: 30.5, zoom: 4.5
        },
        {
          id: 'preset_malacca_radius',
          icon: '📍',
          label: 'Malacca 2,000 km Radius',
          desc: 'Countries near Malacca Strait',
          sql: `SELECT name, 'Malacca Proximity Radius' AS category, capital AS metric1, 'Within 2,000 km' AS metric2, latitude AS lat, longitude AS lng FROM world_countries WHERE ST_DWithin(ST_Point(longitude, latitude), ST_Point(101.5, 2.5), 2000000) ORDER BY name ASC LIMIT 10;`,
          flyLng: 101.5, flyLat: 2.5, zoom: 4.5
        }
      ]
    }
  ];

  sqlQuery: string = '';
  queryResults: SqlQueryResultRow[] = [];
  queryExecutionTime: string = '0 ms';
  queryResultCount: number = 0;
  isExecuting: boolean = false;

  currentLat: number = 20;
  currentLng: number = 0;
  currentZoom: number = 2;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateSqlFromBuilder();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initPreviewMap();
  }

  ngOnDestroy(): void {
    this.stopAutoPlayIterations();
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  setWorkbenchTab(tab: 'builder' | 'iterations' | 'presets' | 'code'): void {
    this.activeWorkbenchTab = tab;
    if (tab === 'iterations') {
      this.setIterationStep(this.currentIterationIndex);
    } else if (tab === 'builder') {
      this.updateSqlFromBuilder();
    }
    this.cdr.markForCheck();
  }

  // Visual Builder Methods (No SQL writing required!)
  setBuilderDataset(dataset: 'countries' | 'canals' | 'chokepoints' | 'ports'): void {
    this.builderDataset = dataset;
    this.updateSqlFromBuilder();
  }

  setBuilderRegion(region: string): void {
    this.builderRegion = region;
    this.updateSqlFromBuilder();
  }

  setBuilderIncome(income: string): void {
    this.builderIncome = income;
    this.updateSqlFromBuilder();
  }

  setBuilderSortBy(sort: 'population' | 'name' | 'latitude'): void {
    this.builderSortBy = sort;
    this.updateSqlFromBuilder();
  }

  setBuilderLimit(limit: number): void {
    this.builderLimit = limit;
    this.updateSqlFromBuilder();
  }

  updateSqlFromBuilder(): void {
    if (this.builderDataset === 'canals') {
      this.sqlQuery = `SELECT name, category, vessel_capacity AS metric1, annual_traffic AS metric2, lat, lng FROM world_canals LIMIT ${this.builderLimit};`;
    } else if (this.builderDataset === 'chokepoints') {
      this.sqlQuery = `SELECT name, category, risk_level AS metric1, daily_flow AS metric2, lat, lng FROM strategic_chokepoints LIMIT ${this.builderLimit};`;
    } else if (this.builderDataset === 'ports') {
      this.sqlQuery = `SELECT name, category, container_volume AS metric1, country AS metric2, lat, lng FROM global_seaports LIMIT ${this.builderLimit};`;
    } else {
      let whereClauses: string[] = [];
      if (this.builderRegion !== 'All') {
        whereClauses.push(`region LIKE '%${this.builderRegion}%'`);
      }
      if (this.builderIncome !== 'All') {
        whereClauses.push(`income_level = '${this.builderIncome}'`);
      }

      let whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')} ` : '';
      let sortCol = this.builderSortBy === 'population' ? 'population DESC' : this.builderSortBy === 'name' ? 'name ASC' : 'latitude DESC';

      this.sqlQuery = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng\nFROM world_countries\n${whereStr}ORDER BY ${sortCol}\nLIMIT ${this.builderLimit};`;
    }

    this.runSpatialQuery();
  }

  // Iteration Wizard Methods
  setIterationStep(index: number): void {
    if (index < 0) index = this.queryIterations.length - 1;
    if (index >= this.queryIterations.length) index = 0;

    this.currentIterationIndex = index;
    const iter = this.queryIterations[index];
    this.sqlQuery = iter.sql;
    this.runSpatialQuery();

    if (iter.targetFlyLng !== undefined && iter.targetFlyLat !== undefined) {
      this.flyToTarget(iter.targetFlyLng, iter.targetFlyLat, iter.targetZoom || 3.5, 40, 0);
    }
  }

  nextIteration(): void {
    this.setIterationStep(this.currentIterationIndex + 1);
  }

  prevIteration(): void {
    this.setIterationStep(this.currentIterationIndex - 1);
  }

  toggleAutoPlayIterations(): void {
    if (this.isAutoPlayingIterations) {
      this.stopAutoPlayIterations();
    } else {
      this.isAutoPlayingIterations = true;
      this.autoIterateTimer = setInterval(() => {
        this.nextIteration();
      }, 4000);
    }
  }

  stopAutoPlayIterations(): void {
    if (this.autoIterateTimer) {
      clearInterval(this.autoIterateTimer);
      this.autoIterateTimer = null;
    }
    this.isAutoPlayingIterations = false;
  }

  setPresetItem(item: PresetItem): void {
    this.sqlQuery = item.sql;
    this.runSpatialQuery();
    if (item.flyLng !== undefined && item.flyLat !== undefined) {
      this.flyToTarget(item.flyLng, item.flyLat, item.zoom || 3.5, 40, 0);
    }
  }

  private async initPreviewMap(): Promise<void> {
    if (!this.previewMapRef) return;
    try {
      const maplibreModule = await import('maplibre-gl');
      this.maplibregl = (maplibreModule as any).default || maplibreModule;

      const styleObj = {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: 'CartoDB Dark'
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
      };

      this.map = new this.maplibregl.Map({
        container: this.previewMapRef.nativeElement,
        style: styleObj as any,
        center: [this.currentLng, this.currentLat],
        zoom: this.currentZoom,
        pitch: 35,
        bearing: 0
      });

      this.map.addControl(new this.maplibregl.NavigationControl(), 'top-right');

      this.map.on('load', () => {
        this.map.resize();
        this.renderResultMarkers();
      });
    } catch (e) {
      console.warn('Failed initializing Spatial SQL preview map:', e);
    }
  }

  private clearMarkers(): void {
    this.activeMarkers.forEach(m => m.remove());
    this.activeMarkers = [];
  }

  private renderResultMarkers(): void {
    if (!this.map || !this.maplibregl) return;
    this.clearMarkers();

    this.queryResults.forEach((row, idx) => {
      const el = document.createElement('div');
      el.className = 'sql-result-marker';
      el.innerHTML = `<span>${idx + 1}</span>`;
      el.title = `${row.name} (${row.category}) - ${row.metric1}`;

      el.addEventListener('click', (ev: Event) => {
        ev.stopPropagation();
        this.flyToTarget(row.lng, row.lat, 6, 45, 0);
      });

      const marker = new this.maplibregl.Marker({ element: el })
        .setLngLat([row.lng, row.lat])
        .addTo(this.map!);

      this.activeMarkers.push(marker);
    });
  }

  runSpatialQuery(): void {
    this.isExecuting = true;
    const startTime = performance.now();

    setTimeout(() => {
      const results: SqlQueryResultRow[] = [];
      const countriesList = Object.values(COUNTRIES_DATA);

      // Check query keywords
      if (this.sqlQuery.includes('world_canals')) {
        results.push(
          { name: 'Suez Canal', category: 'Artificial Inter-Oceanic Link', metric1: '20,000 ships/yr', metric2: 'Passage', lat: 30.5, lng: 32.3 },
          { name: 'Panama Canal', category: 'Inter-Oceanic Link', metric1: '14,000 ships/yr', metric2: 'Passage', lat: 9.0, lng: -79.5 },
          { name: 'Kiel Canal', category: 'Baltic Link', metric1: '30,000 ships/yr', metric2: 'Passage', lat: 54.3, lng: 9.6 },
          { name: 'Corinth Canal', category: 'Ionian Link', metric1: '2,500 ships/yr', metric2: 'Passage', lat: 37.9, lng: 22.9 },
          { name: 'Houston Ship Channel', category: 'Gulf Port Channel', metric1: '8,200 vessels/yr', metric2: 'Channel', lat: 29.7, lng: -95.0 },
          { name: 'St. Lawrence Seaway', category: 'Great Lakes Seaway', metric1: '4,000 ships/yr', metric2: 'Seaway', lat: 45.0, lng: -74.7 }
        );
      } else if (this.sqlQuery.includes('strategic_chokepoints')) {
        results.push(
          { name: 'Strait of Malacca', category: 'Strategic Chokepoint', metric1: 'CRITICAL', metric2: '100,000 vessels/yr', lat: 2.5, lng: 101.5 },
          { name: 'Strait of Hormuz', category: 'Strategic Chokepoint', metric1: 'HIGH RISK', metric2: '21M bpd Oil', lat: 26.5, lng: 56.25 },
          { name: 'Bab-el-Mandeb', category: 'Strategic Chokepoint', metric1: 'HIGH RISK', metric2: 'Red Sea Gate', lat: 12.5, lng: 43.3 },
          { name: 'Turkish Straits', category: 'Strategic Chokepoint', metric1: 'MEDIUM RISK', metric2: 'Bosphorus Corridor', lat: 41.1, lng: 29.1 },
          { name: 'Strait of Gibraltar', category: 'Strategic Chokepoint', metric1: 'LOW RISK', metric2: 'Atlantic Entry', lat: 35.9, lng: -5.5 },
          { name: 'Taiwan Strait', category: 'Strategic Chokepoint', metric1: 'HIGH RISK', metric2: 'East Asia Route', lat: 24.0, lng: 119.5 }
        );
      } else if (this.sqlQuery.includes('global_seaports')) {
        results.push(
          { name: 'Port of Shanghai', category: 'Container Hub', metric1: '47.3M TEU', metric2: 'China', lat: 30.6, lng: 122.0 },
          { name: 'Port of Singapore', category: 'Transshipment Hub', metric1: '37.5M TEU', metric2: 'Singapore', lat: 1.26, lng: 103.8 },
          { name: 'Port of Ningbo-Zhoushan', category: 'Bulk Cargo Hub', metric1: '33.3M TEU', metric2: 'China', lat: 29.8, lng: 121.5 },
          { name: 'Port of Shenzhen', category: 'Container Hub', metric1: '28.8M TEU', metric2: 'China', lat: 22.5, lng: 113.9 },
          { name: 'Port of Busan', category: 'East Asia Hub', metric1: '22.7M TEU', metric2: 'South Korea', lat: 35.1, lng: 129.0 },
          { name: 'Port of Rotterdam', category: 'European Gateway', metric1: '14.5M TEU', metric2: 'Netherlands', lat: 51.9, lng: 4.28 },
          { name: 'Port of Los Angeles', category: 'Pacific Gateway', metric1: '10.7M TEU', metric2: 'USA', lat: 33.7, lng: -118.2 }
        );
      } else if (this.sqlQuery.includes('ST_DWithin')) {
        // Radius calculation
        let targetLat = 30.5;
        let targetLng = 32.3;
        let radiusKm = 2500;

        if (this.sqlQuery.includes('101.5')) {
          targetLng = 101.5;
          targetLat = 2.5;
          radiusKm = 2000;
        }

        countriesList.forEach(c => {
          const lat = parseFloat(c.latitude);
          const lng = parseFloat(c.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            const dist = this.haversineDistanceKm(targetLat, targetLng, lat, lng);
            if (dist <= radiusKm) {
              results.push({
                name: c.name,
                category: `Within ${radiusKm} km`,
                metric1: `Distance: ${Math.round(dist)} km`,
                metric2: c.capitalCity || 'Capital',
                lat,
                lng
              });
            }
          }
        });
        results.sort((a, b) => parseInt(a.metric1.replace(/\D/g, ''), 10) - parseInt(b.metric1.replace(/\D/g, ''), 10));
      } else {
        // Standard country filter matching
        let filtered = countriesList;

        if (this.sqlQuery.includes("High income")) {
          filtered = filtered.filter(c => c.incomeLevel?.value?.toLowerCase().includes('high'));
        } else if (this.sqlQuery.includes("Low income") || this.sqlQuery.includes("Lower")) {
          filtered = filtered.filter(c => c.incomeLevel?.value?.toLowerCase().includes('low'));
        }

        if (this.sqlQuery.includes("region LIKE '%Asia%'")) {
          filtered = filtered.filter(c => c.region?.value?.toLowerCase().includes('asia'));
        } else if (this.sqlQuery.includes("region LIKE '%Africa%'")) {
          filtered = filtered.filter(c => c.region?.value?.toLowerCase().includes('africa'));
        } else if (this.sqlQuery.includes("region LIKE '%Europe%'")) {
          filtered = filtered.filter(c => c.region?.value?.toLowerCase().includes('europe'));
        } else if (this.sqlQuery.includes("region LIKE '%Americas%'")) {
          filtered = filtered.filter(c => c.region?.value?.toLowerCase().includes('america'));
        }

        filtered.slice(0, this.builderLimit).forEach(c => {
          results.push({
            name: c.name,
            category: c.region?.value || 'Global',
            metric1: c.incomeLevel?.value || 'Sovereign',
            metric2: `ISO: ${c.id.toUpperCase()}`,
            lat: parseFloat(c.latitude),
            lng: parseFloat(c.longitude)
          });
        });
      }

      const finalLimit = Math.min(results.length, this.builderLimit > 0 ? this.builderLimit : 12);
      this.queryResults = results.slice(0, finalLimit);
      this.queryResultCount = this.queryResults.length;
      const endTime = performance.now();
      this.queryExecutionTime = `${(endTime - startTime).toFixed(1)} ms`;
      this.isExecuting = false;

      this.renderResultMarkers();
      this.cdr.markForCheck();
    }, 120);
  }

  private haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  exportResultsCsv(): void {
    if (this.queryResults.length === 0) return;
    const headers = ['#', 'Name', 'Category', 'Metric 1', 'Metric 2', 'Latitude', 'Longitude'];
    const rows = this.queryResults.map((r, i) => [
      i + 1,
      `"${r.name}"`,
      `"${r.category}"`,
      `"${r.metric1}"`,
      `"${r.metric2}"`,
      r.lat,
      r.lng
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `duckdb_spatial_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  flyToTarget(lng: number, lat: number, zoom: number = 6, pitch: number = 45, bearing: number = 0): void {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        duration: 1800,
        essential: true
      });
    }
  }
}
