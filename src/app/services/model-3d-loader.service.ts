import { Injectable } from '@angular/core';

export interface ModelLoadOptions {
  dracoDecoderPath?: string;
  enableCache?: boolean;
  enableLOD?: boolean;
  maxTextureSize?: number;
}

export interface ModelLoadMetrics {
  fetchTimeMs: number;
  parseTimeMs: number;
  originalSizeBytes: number;
  compressedSizeBytes?: number;
  polyCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Model3dLoaderService {
  private memoryCache = new Map<string, ArrayBuffer>();
  private defaultDracoPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

  constructor() {}

  /**
   * Fast, optimized fetching of 3D GLB/GLTF model files with local cache support
   */
  async loadModelBuffer(url: string, options: ModelLoadOptions = {}): Promise<ArrayBuffer> {
    const enableCache = options.enableCache ?? true;

    // 1. Check in-memory cache first
    if (enableCache && this.memoryCache.has(url)) {
      return this.memoryCache.get(url)!;
    }

    // 2. Check IndexedDB browser cache
    if (enableCache && 'indexedDB' in window) {
      try {
        const cached = await this.getFromIndexedDB(url);
        if (cached) {
          this.memoryCache.set(url, cached);
          return cached;
        }
      } catch (err) {
        console.warn('IndexedDB cache lookup failed:', err);
      }
    }

    // 3. Fetch from server/CDN with range & cache headers
    const startTime = performance.now();
    const response = await fetch(url, {
      headers: {
        'Accept': 'model/gltf-binary, application/octet-stream, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load 3D model asset from ${url}: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const fetchDuration = performance.now() - startTime;

    console.log(`[3D Loader] Fetched model ${url} (${(buffer.byteLength / 1024).toFixed(1)} KB) in ${fetchDuration.toFixed(1)}ms`);

    // Store in caches
    if (enableCache) {
      this.memoryCache.set(url, buffer);
      this.saveToIndexedDB(url, buffer).catch(() => {});
    }

    return buffer;
  }

  /**
   * Provides Draco Decoder configuration object for Three.js / GLTFLoader
   */
  getDracoDecoderConfig(customPath?: string): { decoderPath: string; workerLimit: number } {
    return {
      decoderPath: customPath || this.defaultDracoPath,
      workerLimit: navigator.hardwareConcurrency || 4
    };
  }

  /**
   * Generates a ultra-lightweight procedural bounding proxy mesh representation
   * for instant display while the full 3D model loads in background.
   */
  createBoundingBoxProxy(dimensions: { width: number; height: number; depth: number } = { width: 2, height: 2, depth: 2 }) {
    return {
      type: 'BoxProxy',
      dimensions,
      color: '#38bdf8',
      wireframe: true,
      label: 'Loading high-res 3D model...'
    };
  }

  // ------------------------------------------------------------------
  // IndexedDB Storage Helpers
  // ------------------------------------------------------------------
  private getFromIndexedDB(key: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open('WorldExplorer3DCache', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models');
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('models', 'readonly');
        const store = tx.objectStore('models');
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    });
  }

  private saveToIndexedDB(key: string, buffer: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
      const request = indexedDB.open('WorldExplorer3DCache', 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models');
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction('models', 'readwrite');
        const store = tx.objectStore('models');
        store.put(buffer, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    });
  }
}
