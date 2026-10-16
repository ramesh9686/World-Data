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

const LOCAL_CLIOPATRIA_ZIP_URL = 'assets/cliopatria.geojson.zip';
const REMOTE_CLIOPATRIA_ZIP_URL = 'https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip';
const DB_NAME = 'WorldExplorerCliopatriaDB';
const STORE_NAME = 'geojsonStore';
const DB_VERSION = 2;

@Injectable({
  providedIn: 'root'
})
export class CliopatriaEngineService {
  isLoading: boolean = false;
  isLoaded: boolean = false;
  statusMessage: string = 'Initializing Historical Cartography Engine...';
  progressPercent: number = 0;
  totalFeaturesCount: number = 0;

  private allFeatures: CliopatriaFeature[] = [];
  private loadPromise: Promise<void> | null = null;

  constructor() {}

  /**
   * Deterministic polity color mapping ensuring clear visual differentiation across historical polities
   */
  getColorForName(name: string): string {
    const lower = (name || '').toLowerCase();

    // Curated high-contrast palette for major world historical powers
    if (lower.includes('rome') || lower.includes('roman')) return '#dc2626'; // Imperial Roman Red
    if (lower.includes('han') || lower.includes('tang') || lower.includes('song') || lower.includes('china')) return '#eab308'; // Imperial Gold/Yellow
    if (lower.includes('ming')) return '#f59e0b'; // Ming Amber Gold
    if (lower.includes('qing')) return '#06b6d4'; // Qing Cyan
    if (lower.includes('parth') || lower.includes('persi') || lower.includes('achaemenid') || lower.includes('sasan')) return '#3b82f6'; // Persian Azure Blue
    if (lower.includes('maurya') || lower.includes('gupta')) return '#f97316'; // Indian Saffron Orange
    if (lower.includes('kushan')) return '#14b8a6'; // Kushan Turquoise
    if (lower.includes('macedon') || lower.includes('alexander') || lower.includes('greek') || lower.includes('athen')) return '#0ea5e9'; // Hellenic Sky Blue
    if (lower.includes('egypt')) return '#d97706'; // Egyptian Desert Ochre
    if (lower.includes('byzant') || lower.includes('eastern roman')) return '#a855f7'; // Byzantine Regal Violet
    if (lower.includes('mongol') || lower.includes('yuan')) return '#8b5cf6'; // Mongol Steppe Purple
    if (lower.includes('caliph') || lower.includes('umayyad') || lower.includes('abbasid') || lower.includes('islam')) return '#10b981'; // Caliphate Emerald Green
    if (lower.includes('ottoman')) return '#0d9488'; // Ottoman Teal Green
    if (lower.includes('mughal')) return '#059669'; // Mughal Forest Green
    if (lower.includes('maratha') || lower.includes('chola') || lower.includes('vijayanag')) return '#ff6600'; // Maratha Saffron
    if (lower.includes('maya')) return '#06b6d4'; // Maya Cyan
    if (lower.includes('inca')) return '#14b8a6'; // Inca Andean Teal
    if (lower.includes('aztec')) return '#ea580c'; // Aztec Vermilion
    if (lower.includes('brit') || lower.includes('england')) return '#6366f1'; // British Indigo
    if (lower.includes('french') || lower.includes('france')) return '#2563eb'; // French Royal Blue
    if (lower.includes('spain') || lower.includes('spanish')) return '#e11d48'; // Spanish Carmine
    if (lower.includes('russia') || lower.includes('moscow')) return '#0284c7'; // Russian Azure
    if (lower.includes('japan') || lower.includes('tokugawa')) return '#ec4899'; // Japanese Pink
    if (lower.includes('khmer')) return '#f59e0b'; // Khmer Golden Amber
    if (lower.includes('majapahit')) return '#10b981'; // Majapahit Spice Emerald

    // Diverse, vibrant 20-color qualitative palette across the full color spectrum
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899',
      '#06B6D4', '#F97316', '#6366F1', '#14B8A6', '#A855F7',
      '#84CC16', '#0EA5E9', '#D97706', '#059669', '#E11D48',
      '#64748B', '#22C55E', '#A855F7', '#EAB308', '#0284C7'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Load authentic Cliopatria historical boundaries archive.
   * Priority:
   * 1. In-memory features if already loaded (instant)
   * 2. IndexedDB cached ArrayBuffer (instant offline)
   * 3. Local bundled asset 'assets/cliopatria.geojson.zip' (instant local delivery)
   * 4. Remote Seshat CDN fallback
   */
  async loadCliopatriaDataset(): Promise<void> {
    if (this.isLoaded && this.allFeatures.length > 0) {
      return;
    }
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = this.executeLoad();
    return this.loadPromise;
  }

  private async executeLoad(): Promise<void> {
    this.isLoading = true;
    this.progressPercent = 10;
    this.statusMessage = 'Accessing local historical boundaries archive...';

    try {
      // Step 1: Check IndexedDB local cache first
      let zipBuffer = await this.getZipBufferFromIndexedDB();

      if (!zipBuffer) {
        // Step 2: Fetch local bundled archive from assets
        this.progressPercent = 30;
        this.statusMessage = 'Reading local cartography bundle (zero internet download)...';

        try {
          const localResponse = await fetch(LOCAL_CLIOPATRIA_ZIP_URL);
          if (localResponse.ok) {
            zipBuffer = await localResponse.arrayBuffer();
          }
        } catch (e) {
          console.warn('Local asset fetch fallback:', e);
        }

        // Step 3: Remote CDN fallback if local asset was not reachable
        if (!zipBuffer) {
          this.statusMessage = 'Fetching official Seshat Cliopatria archive...';
          const remoteResponse = await fetch(REMOTE_CLIOPATRIA_ZIP_URL);
          if (!remoteResponse.ok) {
            throw new Error(`HTTP ${remoteResponse.status}: ${remoteResponse.statusText}`);
          }
          zipBuffer = await remoteResponse.arrayBuffer();
        }

        // Cache the ArrayBuffer in IndexedDB permanently so subsequent loads are offline & instant
        if (zipBuffer) {
          this.saveZipBufferToIndexedDB(zipBuffer).catch(() => {});
        }
      }

      this.progressPercent = 65;
      this.statusMessage = 'Decompressing authentic historical boundaries via JSZip...';

      await this.decompressAndParseZip(zipBuffer!);

      this.isLoaded = true;
      this.isLoading = false;
      this.progressPercent = 100;
      this.statusMessage = `Cliopatria Engine Ready! (${this.totalFeaturesCount.toLocaleString()} Authentic Historical Polities Loaded)`;

    } catch (error: any) {
      console.error('Cliopatria load failed:', error);
      this.isLoading = false;
      this.statusMessage = 'Unable to load historical boundaries dataset.';
    } finally {
      this.loadPromise = null;
    }
  }

  private async decompressAndParseZip(zipBuffer: ArrayBuffer): Promise<void> {
    const zip = await JSZip.loadAsync(zipBuffer);
    const geojsonFile = zip.file('cliopatria.geojson') ??
      Object.values(zip.files).find(f => !f.dir && f.name.endsWith('.geojson'));

    if (!geojsonFile) {
      throw new Error('No GeoJSON file found inside Cliopatria ZIP archive');
    }

    this.progressPercent = 85;
    this.statusMessage = 'Parsing 14,000+ authentic historical boundary features...';

    const geoJsonText = await geojsonFile.async('string');
    this.parseAndStoreGeoJson(geoJsonText);
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
   * Returns authentic Cliopatria boundary polygons for that era
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

  // ── INDEXEDDB CACHING HELPERS (ArrayBuffer Native Storage) ──────────────────

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

  private async getZipBufferFromIndexedDB(): Promise<ArrayBuffer | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get('cliopatriaZipBuffer');

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  private async saveZipBufferToIndexedDB(buffer: ArrayBuffer): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(buffer, 'cliopatriaZipBuffer');
    } catch {
      // Ignore caching errors
    }
  }
}
