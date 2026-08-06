import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

export interface RouteSeoConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemaType?: 'WebApplication' | 'EducationalApplication' | 'Dataset' | 'ExchangeRate' | 'Maritime' | 'HistoricalMap';
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://worldexplorer.app';
  private readonly defaultOgImage = `${this.baseUrl}/assets/og-preview.jpg`;

  private routeSeoMap: { [key: string]: RouteSeoConfig } = {
    '/home': {
      title: 'World Explorer - 3D Earth Globe & Interactive GIS Telemetry',
      description: 'Explore a photorealistic 3D WebGL Earth globe with day/night modes, real-time spatial telemetry, global country discovery, and interactive GIS modules.',
      keywords: '3D Earth Globe, WebGL Earth, Interactive 3D World Map, GIS Explorer, Telemetry Suite, Photorealistic Globe',
      ogTitle: 'World Explorer - Photorealistic 3D Earth Globe & GIS Suite',
      ogDescription: 'Interactive 3D WebGL Earth globe with real-time planetary rendering and spatial telemetry.',
      schemaType: 'WebApplication'
    },
    '/world-data': {
      title: 'World Data Core - 3D WebGL Globe & World Bank Indicators',
      description: 'Interactive 3D WebGL Globe displaying global population, GDP, life expectancy, land area, economic trends, and World Bank indicators.',
      keywords: 'World Data, 3D WebGL Globe, World Bank Indicators, Country Statistics, Spatial GIS Data, Economic Indicators, Global Demographics',
      ogTitle: 'World Data Core - 3D WebGL Spatial Explorer',
      ogDescription: 'Analyze global country statistics, World Bank economic metrics, and spatial demographics on an interactive 3D WebGL Globe.',
      schemaType: 'Dataset'
    },
    '/maritime': {
      title: 'Live Maritime Radar - Real-Time AIS Vessel Tracking & Canal Telemetry',
      description: 'Real-time AIS vessel radar tracking container ships, oil tankers, bulk carriers, and naval fleets through Panama, Suez, and Malacca canals with AISStream live WebSocket radar.',
      keywords: 'Maritime Radar, Live Vessel Tracker, AIS Ships Map, VesselFinder, Suez Canal Live Vessels, Indian Ocean Shipping Fleets, AIS Telemetry',
      ogTitle: 'Live Maritime Vessel Radar & AIS Telemetry',
      ogDescription: 'Track thousands of container ships, oil supertankers, and maritime fleets in real time with AISStream live WebSocket radar.',
      schemaType: 'Maritime'
    },
    '/quiz': {
      title: 'Global Geography Quiz - Vector Globe Trivia Challenge',
      description: 'Test your world knowledge with 15-second speed trivia, capital cities, flags, landmarks, and Gen-Z Aura rank badges.',
      keywords: 'Geography Quiz, World Trivia Game, Capital Cities Quiz, Map Trivia Challenge, Geo Knowledge Test, Geography Leaderboard',
      ogTitle: 'Global Geography Quiz & Trivia Challenge',
      ogDescription: 'Test your geography skills with real-time vector map trivia, capital city questions, and earn top Geo God Aura ranks!',
      schemaType: 'EducationalApplication'
    },
    '/forex': {
      title: 'Live Forex Matrix - Foreign Exchange Rates & Financial Capitals',
      description: 'Track real-time currency exchange rates (USD, EUR, GBP, JPY, INR, CAD, AUD) mapped to global financial centers and capital markets.',
      keywords: 'Live Forex Matrix, Currency Exchange Rates, USD FX Rates, Financial Capitals Map, Live Currency Converter, Global FX Telemetry',
      ogTitle: 'Live Forex Currency Matrix & Financial Capitals',
      ogDescription: 'Real-time foreign exchange telemetry matrix mapping global currencies to major financial centers.',
      schemaType: 'ExchangeRate'
    },
    '/empires': {
      title: 'Historical Empires Explorer - Ancient Civilizations & Temporal Atlas',
      description: 'Travel through 34-year temporal timelines and explore ancient civilizations: Roman Empire, Gupta Empire, Ottoman Empire, British Empire, Han Dynasty, and Seshat databases.',
      keywords: 'Historical Empires Map, Ancient Civilizations, Roman Empire Territory, Gupta Empire Maps, Historical Atlas Timeline, Temporal GeoJSON',
      ogTitle: 'Historical Empires & Ancient Civilizations Explorer',
      ogDescription: 'Explore interactive shaded maps and historical timelines of ancient empires across 3,000 years of global history.',
      schemaType: 'HistoricalMap'
    },
    '/spatial-sql': {
      title: 'DuckDB Spatial SQL - In-Browser WebAssembly GIS Analytics Engine',
      description: 'Execute high-performance in-browser spatial SQL queries using WebAssembly DuckDB and GeoJSON analytical engines directly in your browser.',
      keywords: 'DuckDB Spatial SQL, WebAssembly GIS Query, In-Browser Spatial Analytics, GeoJSON Query Engine, WKT Geometry, WebAssembly Spatial Database',
      ogTitle: 'DuckDB Spatial SQL Engine in WebAssembly',
      ogDescription: 'Perform spatial GIS queries, buffer calculations, and geometry intersections directly in your browser with DuckDB WebAssembly.',
      schemaType: 'Dataset'
    },
    '/locate': {
      title: 'Country Locator Game - Interactive Vector Map Discovery',
      description: 'Find target countries on an interactive world vector map, test your speed, and build your geography knowledge streak.',
      keywords: 'Country Locator Game, Map Discovery, Find Country Map, Geography Location Game, Interactive Map Challenge',
      ogTitle: 'Interactive Country Locator Geography Game',
      ogDescription: 'Test your country location skills on an interactive vector map challenge.',
      schemaType: 'EducationalApplication'
    },
    '/classic-map': {
      title: 'Classic 2D Map - Vector Shaded World Explorer',
      description: 'Explore a 2D vector shaded world map with camera pan/zoom controls, country telemetry cards, and temporal time-lapse sliders.',
      keywords: '2D World Map, Vector SVG Map, Choropleth Map Explorer, Country Telemetry Cards, Vector Shaded World',
      ogTitle: 'Classic 2D Vector World Explorer Map',
      ogDescription: 'High-definition 2D vector shaded map with temporal time-lapse sliders and interactive country telemetry.',
      schemaType: 'WebApplication'
    }
  };

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
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
    const cleanUrl = (url.split('?')[0] || '/').toLowerCase();
    
    // Normalize aliases
    let matchedKey = '/home';
    if (cleanUrl === '/' || cleanUrl === '/home') {
      matchedKey = '/home';
    } else if (cleanUrl.includes('spatial-sql') || cleanUrl.includes('duckdb')) {
      matchedKey = '/spatial-sql';
    } else if (cleanUrl.includes('world-data') || cleanUrl === '/map' || cleanUrl.includes('geolibre')) {
      matchedKey = '/world-data';
    } else if (cleanUrl.includes('classic-map')) {
      matchedKey = '/classic-map';
    } else if (cleanUrl.includes('maritime')) {
      matchedKey = '/maritime';
    } else if (cleanUrl.includes('quiz')) {
      matchedKey = '/quiz';
    } else if (cleanUrl.includes('forex')) {
      matchedKey = '/forex';
    } else if (cleanUrl.includes('empires')) {
      matchedKey = '/empires';
    } else if (cleanUrl.includes('locate')) {
      matchedKey = '/locate';
    }

    const config = this.routeSeoMap[matchedKey] || this.routeSeoMap['/home'];
    const canonicalUrl = `${this.baseUrl}${cleanUrl === '/' ? '' : cleanUrl}`;

    // 1. Page Title
    this.titleService.setTitle(config.title);

    // 2. Standard Meta Tags
    this.metaService.updateTag({ name: 'description', content: config.description });
    this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
    this.metaService.updateTag({ name: 'author', content: 'World Explorer Team' });

    // 3. Open Graph Tags
    this.metaService.updateTag({ property: 'og:site_name', content: 'World Explorer Suite' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:locale', content: 'en_US' });
    this.metaService.updateTag({ property: 'og:title', content: config.ogTitle || config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.ogDescription || config.description });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:image', content: config.ogImage || this.defaultOgImage });
    this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
    this.metaService.updateTag({ property: 'og:image:height', content: '630' });
    this.metaService.updateTag({ property: 'og:image:alt', content: 'World Explorer 3D Globe and Spatial Telemetry Preview' });

    // 4. Twitter Card Meta Tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.ogTitle || config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.ogDescription || config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.ogImage || this.defaultOgImage });

    // 5. Canonical Link Tag
    this.setCanonicalUrl(canonicalUrl);

    // 6. Dynamic JSON-LD Structured Data
    this.updateJsonLdSchema(config, canonicalUrl);
  }

  private setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private updateJsonLdSchema(config: RouteSeoConfig, currentUrl: string): void {
    let script = this.document.getElementById('route-jsonld') as HTMLScriptElement;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'route-jsonld';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    const jsonLdData: any = {
      '@context': 'https://schema.org',
      '@type': config.schemaType === 'EducationalApplication' ? 'EducationalApplication' :
               config.schemaType === 'Dataset' ? 'Dataset' : 'WebApplication',
      'name': config.ogTitle || config.title,
      'url': currentUrl,
      'description': config.description,
      'applicationCategory': 'EducationalApplication',
      'operatingSystem': 'All',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'World Explorer',
        'url': this.baseUrl,
        'logo': `${this.baseUrl}/favicon.ico`
      }
    };

    script.textContent = JSON.stringify(jsonLdData, null, 2);
  }
}

