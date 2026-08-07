import { Injectable } from '@angular/core';

export type GraphicsPerformancePreset = 'auto' | 'high' | 'battery';

export interface ModelLoadOptions {
  dracoDecoderPath?: string;
  enableCache?: boolean;
  enableLOD?: boolean;
  maxTextureSize?: number;
  performancePreset?: GraphicsPerformancePreset;
}

export interface ModelLoadMetrics {
  fetchTimeMs: number;
  parseTimeMs: number;
  originalSizeBytes: number;
  compressedSizeBytes?: number;
  polyCount?: number;
}

export interface FpsTelemetry {
  currentFps: number;
  avgFps: number;
  frameTimeMs: number;
  status: 'STABLE 60FPS' | 'BALANCED' | 'LAG DETECTED (AUTO-DOWN SCALING)';
  recommendedDpr: number;
}

@Injectable({
  providedIn: 'root'
})
export class Model3dLoaderService {
  private memoryCache = new Map<string, ArrayBuffer>();
  private defaultDracoPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

  // Global Graphics & 3D Performance Preset
  private currentPreset: GraphicsPerformancePreset = 'auto';

  // Live FPS Telemetry State
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private currentFps = 60;
  private avgFps = 60;
  private fpsSamples: number[] = [];
  private fpsMonitorTimer: any = null;

  constructor() {
    this.startFpsTracker();
  }

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
      workerLimit: typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4
    };
  }

  /**
   * Calculates optimal Device Pixel Ratio (DPR) to prevent WebGL canvas shading lag on high-DPI displays
   */
  getOptimalDPR(overridePreset?: GraphicsPerformancePreset): number {
    const preset = overridePreset || this.currentPreset;
    const nativeDpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    if (preset === 'battery') {
      return 1.0;
    } else if (preset === 'high') {
      return Math.min(nativeDpr, 2.0);
    }

    // 'auto' mode: Dynamic resolution scaling based on live FPS telemetry
    if (this.avgFps < 40) {
      return 1.0; // Drop to native 1x scale if FPS drops below 40
    } else if (this.avgFps < 52) {
      return 1.25;
    }
    return Math.min(nativeDpr, 1.5); // Cap at 1.5x for crisp UI without 4K quadrupled shading cost
  }

  /**
   * Configures global 3D graphics performance preset
   */
  setPerformancePreset(preset: GraphicsPerformancePreset): void {
    this.currentPreset = preset;
    console.log(`[3D Loader] Performance preset set to: ${preset.toUpperCase()} (Target DPR: ${this.getOptimalDPR()})`);
  }

  getPerformancePreset(): GraphicsPerformancePreset {
    return this.currentPreset;
  }

  /**
   * Recursively disposes all GPU WebGL geometry, texture, and material resources
   * in a 3D scene hierarchy to prevent VRAM memory leaks and frame rate degradation.
   */
  disposeHierarchy(obj: any): void {
    if (!obj) return;

    if (obj.geometry) {
      obj.geometry.dispose();
    }

    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat: any) => this.disposeMaterial(mat));
      } else {
        this.disposeMaterial(obj.material);
      }
    }

    if (obj.children && Array.isArray(obj.children)) {
      obj.children.forEach((child: any) => this.disposeHierarchy(child));
    }
  }

  private disposeMaterial(mat: any): void {
    if (!mat) return;

    // Dispose all material texture maps
    const textureKeys = [
      'map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap',
      'envMap', 'alphaMap', 'aoMap', 'displacementMap', 'emissiveMap',
      'metalnessMap', 'roughnessMap'
    ];

    textureKeys.forEach((key) => {
      if (mat[key] && typeof mat[key].dispose === 'function') {
        mat[key].dispose();
      }
    });

    if (typeof mat.dispose === 'function') {
      mat.dispose();
    }
  }

  /**
   * Downscales large texture canvas to specified maximum dimension to conserve GPU VRAM
   */
  clampTextureSize(source: HTMLCanvasElement | HTMLImageElement, maxSize: number = 1024): HTMLCanvasElement {
    const width = source.width || (source as HTMLImageElement).naturalWidth || 512;
    const height = source.height || (source as HTMLImageElement).naturalHeight || 512;

    if (width <= maxSize && height <= maxSize) {
      if (source instanceof HTMLCanvasElement) return source;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(source, 0, 0);
      return canvas;
    }

    const scale = Math.min(maxSize / width, maxSize / height);
    const newWidth = Math.round(width * scale);
    const newHeight = Math.round(height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(source, 0, 0, newWidth, newHeight);
    }
    return canvas;
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

  /**
   * Live Real-Time FPS Tracker & Diagnostics
   */
  private startFpsTracker(): void {
    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined') return;

    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (delta > 0) {
        const instantFps = 1000 / delta;
        this.fpsSamples.push(instantFps);
        if (this.fpsSamples.length > 60) this.fpsSamples.shift();

        const sum = this.fpsSamples.reduce((a, b) => a + b, 0);
        this.avgFps = Math.round(sum / this.fpsSamples.length);
        this.currentFps = Math.round(instantFps);
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  getFpsTelemetry(): FpsTelemetry {
    let status: 'STABLE 60FPS' | 'BALANCED' | 'LAG DETECTED (AUTO-DOWN SCALING)' = 'STABLE 60FPS';
    if (this.avgFps < 40) {
      status = 'LAG DETECTED (AUTO-DOWN SCALING)';
    } else if (this.avgFps < 55) {
      status = 'BALANCED';
    }

    return {
      currentFps: Math.min(60, Math.max(1, this.currentFps)),
      avgFps: Math.min(60, Math.max(1, this.avgFps)),
      frameTimeMs: parseFloat((1000 / (this.avgFps || 60)).toFixed(1)),
      status,
      recommendedDpr: this.getOptimalDPR()
    };
  }

  clearMemoryCache(): void {
    this.memoryCache.clear();
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

