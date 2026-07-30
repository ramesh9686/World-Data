import { Injectable } from '@angular/core';
import JSZip from 'jszip';

export interface CliopatriaFeatureProperties {
  Name?: string;
  NAME?: string;
  FromYear?: number;
  ToYear?: number;
  Area?: number;
  Type?: string;
  Wikipedia?: string;
  SeshatID?: string;
  [key: string]: any;
}

export interface CliopatriaFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: CliopatriaFeatureProperties;
  computedColor?: string;
  svgPath?: string;
  centroid?: { cx: number; cy: number };
}

export interface CliopatriaFeatureCollection {
  type: 'FeatureCollection';
  features: CliopatriaFeature[];
}

export interface LegendRegionItem {
  name: string;
  color: string;
  count: number;
  fromYear?: number;
  toYear?: number;
  areaKm2?: number;
}

const CLIOPATRIA_ZIP_URL = 'https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip';
const DB_NAME = 'WorldExplorerCliopatriaDB';
const STORE_NAME = 'geojsonStore';
const DB_VERSION = 1;

@Injectable({
  providedIn: 'root'
})
export class CliopatriaEngineService {
  isLoading: boolean = false;
  isLoaded: boolean = false;
  statusMessage: string = 'Initializing Cliopatria Engine...';
  progressPercent: number = 0;
  totalFeaturesCount: number = 0;

  private allFeatures: CliopatriaFeature[] = [];

  constructor() {}

  /**
   * Deterministic polity color mapping matching OldMap (HistoricalOverlay.tsx)
   */
  getColorForName(name: string): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
      '#14B8A6', '#A855F7', '#22C55E', '#E11D48', '#0EA5E9'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Load Cliopatria dataset from IndexedDB cache or download from GitHub CDN
   */
  async loadCliopatriaDataset(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;
    this.progressPercent = 10;
    this.statusMessage = 'Checking IndexedDB local cache for Cliopatria dataset...';

    try {
      const cachedText = await this.getFromIndexedDB();
      if (cachedText) {
        this.statusMessage = 'Loading Cliopatria 14,000+ polities from local cache...';
        this.progressPercent = 80;
        this.parseAndStoreGeoJson(cachedText);
        this.isLoaded = true;
        this.isLoading = false;
        this.progressPercent = 100;
        this.statusMessage = `Cliopatria Dataset Ready! (${this.totalFeaturesCount.toLocaleString()} Historical Polities Loaded)`;
        return;
      }

      this.statusMessage = 'Downloading official Seshat Cliopatria ZIP dataset (14,000+ polities)...';
      this.progressPercent = 30;

      const response = await fetch(CLIOPATRIA_ZIP_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.progressPercent = 60;
      this.statusMessage = 'Decompressing cliopatria.geojson via JSZip...';

      const zipBuffer = await response.arrayBuffer();
      const zip = await JSZip.loadAsync(zipBuffer);

      const geojsonFile = zip.file('cliopatria.geojson') ??
        Object.values(zip.files).find(f => !f.dir && f.name.endsWith('.geojson'));

      if (!geojsonFile) {
        throw new Error('No GeoJSON file found inside Cliopatria ZIP archive');
      }

      this.progressPercent = 85;
      this.statusMessage = 'Parsing 14,000+ historical polity boundary features...';

      const geoJsonText = await geojsonFile.async('string');
      this.parseAndStoreGeoJson(geoJsonText);

      this.saveToIndexedDB(geoJsonText).catch(() => {});

      this.isLoaded = true;
      this.isLoading = false;
      this.progressPercent = 100;
      this.statusMessage = `Cliopatria Engine Ready! (${this.totalFeaturesCount.toLocaleString()} Polities Loaded)`;

    } catch (error) {
      console.warn('Cliopatria live load fallback:', error);
      this.isLoading = false;
      this.statusMessage = 'Note: Offline mode. Preset polities active.';
    }
  }

  private parseAndStoreGeoJson(text: string): void {
    try {
      const collection = JSON.parse(text) as CliopatriaFeatureCollection;
      const features = collection.features || [];

      this.allFeatures = features.map(feat => {
        const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown Polity';
        return {
          ...feat,
          computedColor: this.getColorForName(name)
        };
      });

      this.totalFeaturesCount = this.allFeatures.length;
    } catch (e) {
      console.error('Failed to parse Cliopatria GeoJSON:', e);
    }
  }

  /**
   * Filter active polities for any requested year (-3400 BCE to 2024 CE)
   */
  getFeaturesForYear(year: number): CliopatriaFeature[] {
    if (this.allFeatures.length === 0) return [];

    return this.allFeatures.filter(feature => {
      const from = feature.properties?.FromYear ?? -9999;
      const to = feature.properties?.ToYear ?? 9999;
      return year >= from && year <= to;
    });
  }

  /**
   * Aggregate active features into unique legend region items for current year
   */
  getLegendRegionsForYear(year: number): LegendRegionItem[] {
    const activeFeatures = this.getFeaturesForYear(year);
    const map = new Map<string, LegendRegionItem>();

    activeFeatures.forEach(feat => {
      const name = feat.properties?.Name || feat.properties?.NAME || 'Unknown Polity';
      const color = feat.computedColor || this.getColorForName(name);

      if (!map.has(name)) {
        map.set(name, {
          name,
          color,
          count: 1,
          fromYear: feat.properties?.FromYear,
          toYear: feat.properties?.ToYear,
          areaKm2: feat.properties?.Area
        });
      } else {
        const existing = map.get(name)!;
        existing.count += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  // ── INDEXEDDB CACHING HELPERS ──────────────────────────────────────────

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject('IndexedDB not supported');
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = (event: any) => resolve(event.target.result);
      request.onerror = (event: any) => reject(event.target.error);
    });
  }

  private async getFromIndexedDB(): Promise<string | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('cliopatriaGeoJSON');

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private async saveToIndexedDB(text: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(text, 'cliopatriaGeoJSON');
    } catch {
      // Ignore caching errors
    }
  }
}
