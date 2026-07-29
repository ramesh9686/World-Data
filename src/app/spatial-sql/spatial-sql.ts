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

  sqlQuery: string = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng 
FROM world_countries 
WHERE income_level = 'High income' 
ORDER BY population DESC 
LIMIT 10;`;

  queryResults: SqlQueryResultRow[] = [];
  queryExecutionTime: string = '0 ms';
  queryResultCount: number = 0;
  isExecuting: boolean = false;

  currentLat: number = 20;
  currentLng: number = 0;
  currentZoom: number = 2;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.runSpatialQuery();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initPreviewMap();
  }

  ngOnDestroy(): void {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
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

  setQueryPreset(preset: string): void {
    if (preset === 'high_income') {
      this.sqlQuery = `SELECT name, region AS category, income_level AS metric1, population AS metric2, latitude AS lat, longitude AS lng 
FROM world_countries 
WHERE income_level = 'High income' 
ORDER BY population DESC 
LIMIT 12;`;
    } else if (preset === 'maritime_canals') {
      this.sqlQuery = `SELECT 'Suez Canal' AS name, 'Primary Maritime Corridor' AS category, '20,000 ships/yr' AS metric1, 'Passage' AS metric2, 30.5 AS lat, 32.3 AS lng
UNION ALL
SELECT 'Panama Canal', 'Inter-Oceanic Link', '14,000 ships/yr', 'Passage', 9.0, -79.5
UNION ALL
SELECT 'Kiel Canal', 'Baltic Link', '30,000 ships/yr', 'Passage', 54.3, 9.6
UNION ALL
SELECT 'Corinth Canal', 'Ionian Link', '2,500 ships/yr', 'Passage', 37.9, 22.9;`;
    } else if (preset === 'chokepoints') {
      this.sqlQuery = `SELECT 'Strait of Malacca' AS name, 'Strategic Chokepoint' AS category, 'CRITICAL' AS metric1, '100,000 vessels/yr' AS metric2, 2.5 AS lat, 101.5 AS lng
UNION ALL
SELECT 'Strait of Hormuz', 'Strategic Chokepoint', 'HIGH RISK', '21M bpd Oil', 26.5, 56.25
UNION ALL
SELECT 'Bab-el-Mandeb', 'Strategic Chokepoint', 'HIGH RISK', 'Red Sea Gate', 12.5, 43.3
UNION ALL
SELECT 'Turkish Straits', 'Strategic Chokepoint', 'MEDIUM RISK', 'Bosphorus', 41.1, 29.1;`;
    } else if (preset === 'landlocked') {
      this.sqlQuery = `SELECT name, region AS category, capital AS metric1, population AS metric2, latitude AS lat, longitude AS lng 
FROM world_countries 
WHERE region LIKE '%Africa%' OR region LIKE '%Asia%'
ORDER BY population DESC 
LIMIT 15;`;
    }
    this.runSpatialQuery();
  }

  runSpatialQuery(): void {
    this.isExecuting = true;
    const startTime = performance.now();

    setTimeout(() => {
      const results: SqlQueryResultRow[] = [];
      const countriesList = Object.values(COUNTRIES_DATA);

      if (this.sqlQuery.includes('High income')) {
        countriesList
          .filter(c => c.incomeLevel?.value?.toLowerCase().includes('high'))
          .slice(0, 12)
          .forEach(c => {
            results.push({
              name: c.name,
              category: c.region?.value || 'Global',
              metric1: c.incomeLevel?.value || 'High income',
              metric2: `ISO: ${c.id.toUpperCase()}`,
              lat: parseFloat(c.latitude),
              lng: parseFloat(c.longitude)
            });
          });
      } else if (this.sqlQuery.includes('Canal') || this.sqlQuery.includes('Chokepoint')) {
        if (this.sqlQuery.includes('Canal')) {
          results.push(
            { name: 'Suez Canal', category: 'Primary Maritime Corridor', metric1: '20,000 ships/yr', metric2: 'Passage', lat: 30.5, lng: 32.3 },
            { name: 'Panama Canal', category: 'Inter-Oceanic Link', metric1: '14,000 ships/yr', metric2: 'Passage', lat: 9.0, lng: -79.5 },
            { name: 'Kiel Canal', category: 'Baltic Link', metric1: '30,000 ships/yr', metric2: 'Passage', lat: 54.3, lng: 9.6 },
            { name: 'Corinth Canal', category: 'Ionian Link', metric1: '2,500 ships/yr', metric2: 'Passage', lat: 37.9, lng: 22.9 }
          );
        } else {
          results.push(
            { name: 'Strait of Malacca', category: 'Strategic Chokepoint', metric1: 'CRITICAL', metric2: '100,000 vessels/yr', lat: 2.5, lng: 101.5 },
            { name: 'Strait of Hormuz', category: 'Strategic Chokepoint', metric1: 'HIGH RISK', metric2: '21M bpd Oil', lat: 26.5, lng: 56.25 },
            { name: 'Bab-el-Mandeb', category: 'Strategic Chokepoint', metric1: 'HIGH RISK', metric2: 'Red Sea Gate', lat: 12.5, lng: 43.3 },
            { name: 'Turkish Straits', category: 'Strategic Chokepoint', metric1: 'MEDIUM RISK', metric2: 'Bosphorus', lat: 41.1, lng: 29.1 }
          );
        }
      } else {
        countriesList
          .slice(0, 15)
          .forEach(c => {
            results.push({
              name: c.name,
              category: c.region?.value || 'Global',
              metric1: c.incomeLevel?.value || 'N/A',
              metric2: `ISO: ${c.id.toUpperCase()}`,
              lat: parseFloat(c.latitude),
              lng: parseFloat(c.longitude)
            });
          });
      }

      this.queryResults = results;
      this.queryResultCount = results.length;
      const endTime = performance.now();
      this.queryExecutionTime = `${(endTime - startTime).toFixed(1)} ms`;
      this.isExecuting = false;

      this.renderResultMarkers();
      this.cdr.markForCheck();
    }, 180);
  }

  flyToTarget(lng: number, lat: number, zoom: number = 6, pitch: number = 45, bearing: number = 0): void {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        duration: 2000,
        essential: true
      });
    }
  }
}
