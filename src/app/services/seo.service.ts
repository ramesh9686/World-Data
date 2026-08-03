import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface RouteSeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private routeSeoMap: { [key: string]: RouteSeoConfig } = {
    '/home': {
      title: 'World Explorer - 3D Earth Globe & Interactive GIS Telemetry',
      description: 'Explore a 3D WebGL Earth globe with photorealistic day and night modes, global search, and interactive telemetry modules.',
      keywords: '3D Earth Globe, WebGL Earth, Interactive 3D World Map, GIS Explorer, Telemetry Suite',
      ogTitle: 'World Explorer - Photorealistic 3D Earth Globe',
      ogDescription: 'Interactive 3D WebGL Earth globe with real-time planetary rendering and spatial telemetry.'
    },
    '/world-data': {
      title: 'World Data Core - 3D WebGL Globe & World Bank Indicators',
      description: 'Interactive 3D WebGL Globe displaying global population, GDP, life expectancy, land area, and World Bank indicators.',
      keywords: 'World Data, 3D WebGL Globe, World Bank Indicators, Country Statistics, Spatial GIS Data',
      ogTitle: 'World Data Core - 3D WebGL Spatial Explorer',
      ogDescription: 'Analyze global country statistics, World Bank economic metrics, and spatial demographics on an interactive 3D WebGL Globe.'
    },
    '/maritime': {
      title: 'Live Maritime Radar - Real-Time AIS Vessel Tracking & Global Canals',
      description: 'Real-time AIS vessel radar tracking container ships, oil tankers, bulk carriers, and naval traffic through Panama, Suez, and Malacca canals.',
      keywords: 'Maritime Radar, Live Vessel Tracker, AIS Ships Map, VesselFinder, Suez Canal Live Vessels, Indian Ocean Shipping Fleets',
      ogTitle: 'Live Maritime Vessel Radar & AIS Telemetry',
      ogDescription: 'Track thousands of container ships, oil supertankers, and maritime fleets in real time with AISStream live WebSocket radar.'
    },
    '/quiz': {
      title: 'Global Geography Quiz - Vector Globe Trivia Challenge',
      description: 'Test your world knowledge with 15-second speed trivia, capital cities, landmarks, and Gen-Z Aura rank badges.',
      keywords: 'Geography Quiz, World Trivia Game, Capital Cities Quiz, Map Trivia Challenge, Geo Knowledge Test',
      ogTitle: 'Global Geography Quiz & Trivia Challenge',
      ogDescription: 'Test your geography skills with real-time vector map trivia, capital city questions, and earn top Geo God Aura ranks!'
    },
    '/forex': {
      title: 'Live Forex Matrix - Foreign Exchange Rates & Currency Telemetry',
      description: 'Track real-time currency exchange rates (USD, EUR, GBP, JPY, INR, CAD, AUD) mapped to global financial capitals.',
      keywords: 'Live Forex Matrix, Currency Exchange Rates, USD FX Rates, Financial Capitals Map, Live Currency Converter',
      ogTitle: 'Live Forex Currency Matrix & Financial Capitals',
      ogDescription: 'Real-time foreign exchange telemetry matrix mapping global currencies to major financial centers.'
    },
    '/empires': {
      title: 'Historical Empires Explorer - Ancient Civilizations & Temporal Maps',
      description: 'Travel through 34-year temporal timelines and explore ancient civilizations: Roman Empire, Gupta Empire, Ottoman Empire, British Empire, Han Dynasty.',
      keywords: 'Historical Empires Map, Ancient Civilizations, Roman Empire Territory, Gupta Empire Maps, Historical Atlas Timeline',
      ogTitle: 'Historical Empires & Ancient Civilizations Explorer',
      ogDescription: 'Explore interactive shaded maps and historical timelines of ancient empires across 3,000 years of global history.'
    },
    '/spatial-sql': {
      title: 'DuckDB Spatial SQL - In-Browser Spatial Analytics Engine',
      description: 'Execute high-performance in-browser spatial SQL queries using WebAssembly DuckDB and GeoJSON analytical engines.',
      keywords: 'DuckDB Spatial SQL, WebAssembly GIS Query, In-Browser Spatial Analytics, GeoJSON Query Engine, WKT Geometry',
      ogTitle: 'DuckDB Spatial SQL Engine in WebAssembly',
      ogDescription: 'Perform spatial GIS queries, buffer calculations, and geometry intersections directly in your browser with DuckDB WebAssembly.'
    },
    '/locate': {
      title: 'Country Locator Game - Interactive Map Geography Discovery',
      description: 'Find target countries on an interactive world vector map and build your geography knowledge streak.',
      keywords: 'Country Locator Game, Map Discovery, Find Country Map, Geography Location Game',
      ogTitle: 'Interactive Country Locator Geography Game',
      ogDescription: 'Test your country location skills on an interactive vector map challenge.'
    },
    '/classic-map': {
      title: 'Classic 2D Map - Vector Shaded World Explorer',
      description: 'Explore a 2D vector shaded world map with camera pan/zoom controls, country telemetry cards, and temporal time-lapse sliders.',
      keywords: '2D World Map, Vector SVG Map, Choropleth Map Explorer, Country Telemetry Cards',
      ogTitle: 'Classic 2D Vector World Explorer Map',
      ogDescription: 'High-definition 2D vector shaded map with temporal time-lapse sliders and interactive country telemetry.'
    }
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router
  ) {
    this.initRouteSeoListener();
  }

  private initRouteSeoListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateSeoForUrl(event.urlAfterRedirects || event.url);
      });
  }

  public updateSeoForUrl(url: string): void {
    const cleanUrl = url.split('?')[0];
    const matchedKey = Object.keys(this.routeSeoMap).find(k => cleanUrl.includes(k)) || '/home';
    const config = this.routeSeoMap[matchedKey];

    if (config) {
      this.titleService.setTitle(config.title);
      
      this.metaService.updateTag({ name: 'description', content: config.description });
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
      
      this.metaService.updateTag({ property: 'og:title', content: config.ogTitle || config.title });
      this.metaService.updateTag({ property: 'og:description', content: config.ogDescription || config.description });
      this.metaService.updateTag({ property: 'og:url', content: `https://worldexplorer.app${cleanUrl}` });
      
      this.metaService.updateTag({ name: 'twitter:title', content: config.ogTitle || config.title });
      this.metaService.updateTag({ name: 'twitter:description', content: config.ogDescription || config.description });
    }
  }
}
