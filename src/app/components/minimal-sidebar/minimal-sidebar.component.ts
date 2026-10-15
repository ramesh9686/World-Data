import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ContentFilterService } from '../../services/content-filter.service';

export interface NavTabItem {
  id: string;
  label: string;
  shortLabel: string;
  sublabel: string;
  route: string;
  color: string;
  badge?: string;
  badgeColor?: string;
  keyHint?: string;
}

export interface DrawerModuleItem {
  id: string;
  label: string;
  description: string;
  route: string;
  category: string;
  badge: string;
  badgeColor: string;
}

@Component({
  selector: 'app-minimal-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './minimal-sidebar.component.html',
  styleUrl: './minimal-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinimalSidebarComponent implements OnInit, OnDestroy {
  @Output() privacyClick = new EventEmitter<void>();

  // Dock & Island layout modes
  public dockPosition: 'top' | 'bottom' = 'top';
  public isCollapsed: boolean = false;
  public isDrawerOpen: boolean = false;
  public activeRoute: string = '/home';
  public isSoundEnabled: boolean = true;
  public searchQuery: string = '';

  private audioCtx: AudioContext | null = null;
  private routerSub!: Subscription;

  // Primary top-level navigation tabs with gemstone colors (zero emojis)
  public primaryTabs: NavTabItem[] = [
    { id: 'home', label: 'Earth', shortLabel: 'Earth', sublabel: 'WebGL Dynamic Globe', route: '/home', color: '#38bdf8', keyHint: '1' },
    { id: 'world-data', label: 'World Data', shortLabel: 'Data', sublabel: 'GIS Map & Indicators', route: '/world-data', color: '#00f2fe', keyHint: '2' },
    { id: 'empires', label: 'Empires', shortLabel: 'Empires', sublabel: 'Historical Cartography', route: '/empires', color: '#f43f5e', keyHint: '3' },
    { id: 'maritime', label: 'Maritime', shortLabel: 'Radar', sublabel: 'Live AIS Vessel Radar', route: '/maritime', color: '#10b981', badge: 'LIVE', badgeColor: '#10b981', keyHint: '4' },
    { id: 'forex', label: 'Forex', shortLabel: 'Forex', sublabel: 'FX Exchange Rates', route: '/forex', color: '#f59e0b', keyHint: '5' }
  ];

  // Extended Ecosystem Modules in the Creative Drawer
  public allModules: DrawerModuleItem[] = [
    { id: 'locate', label: 'Country Locator', description: 'Interactive GIS country-finding game with precision scoring', route: '/locate', category: 'Game', badge: 'Play', badgeColor: '#ec4899' },
    { id: 'quiz', label: 'Global Quiz', description: 'Speed-run trivia on flags, capitals, and world culture', route: '/quiz', category: 'Game', badge: 'Trivia', badgeColor: '#a855f7' },
    { id: 'spatial-sql', label: 'DuckDB Spatial SQL', description: 'High-speed in-browser DuckDB spatial query engine', route: '/spatial-sql', category: 'Analytics', badge: 'SQL', badgeColor: '#ff5722' },
    { id: 'fishing', label: 'Fishing Watch', description: 'Ocean telemetry and commercial fishing fleet intelligence', route: '/fishing', category: 'Telemetry', badge: 'Ocean', badgeColor: '#84cc16' },
    { id: 'maritime-deep', label: 'Live Fleet Radar', description: 'Worldwide AIS transponder telemetry & live ship positions', route: '/maritime', category: 'Telemetry', badge: 'Live AIS', badgeColor: '#10b981' },
    { id: 'empires-history', label: 'Historical Cartography', description: '5,000+ years of civilizational boundaries & empires', route: '/empires', category: 'History', badge: 'Maps', badgeColor: '#ef4444' },
    { id: 'world-indicators', label: 'World Bank Indicators', description: 'Global socioeconomic and environmental time-series data', route: '/world-data', category: 'Analytics', badge: 'Data', badgeColor: '#00f2fe' }
  ];

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef,
    private contentFilter: ContentFilterService
  ) {}

  ngOnInit(): void {
    // Restore user preferences
    if (typeof window !== 'undefined') {
      try {
        const savedPos = localStorage.getItem('we_nav_dock_position');
        if (savedPos === 'bottom' || savedPos === 'top') {
          this.dockPosition = savedPos;
        }
        const savedSound = localStorage.getItem('we_nav_sound_enabled');
        if (savedSound !== null) {
          this.isSoundEnabled = savedSound === 'true';
        }
      } catch (e) {}
    }

    this.updateActiveRoute(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveRoute(event.urlAfterRedirects || event.url);
        this.isDrawerOpen = false;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  // Keyboard shortcut support: 1-5 for primary tabs, Esc to close drawer
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    if (event.key === 'Escape' && this.isDrawerOpen) {
      this.isDrawerOpen = false;
      this.playSfx(280, 'sine', 0.05);
      this.cdr.markForCheck();
      return;
    }

    const num = parseInt(event.key, 10);
    if (!isNaN(num) && num >= 1 && num <= this.primaryTabs.length) {
      const targetItem = this.primaryTabs[num - 1];
      if (targetItem) {
        event.preventDefault();
        this.navigateTo(targetItem.route);
      }
    }
  }

  // Close drawer on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dynamic-nav-island') && !target.closest('.ecosystem-drawer-overlay')) {
      if (this.isDrawerOpen) {
        this.isDrawerOpen = false;
        this.cdr.markForCheck();
      }
    }
  }

  public navigateTo(route: string): void {
    if (route) {
      this.playSfx(580, 'sine', 0.04);
      this.isDrawerOpen = false;
      this.router.navigate([route]);
    }
  }

  public toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
    if (this.isDrawerOpen) {
      this.searchQuery = '';
      this.playSfx(660, 'sine', 0.06);
    } else {
      this.playSfx(380, 'sine', 0.05);
    }
    this.cdr.markForCheck();
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.playSfx(this.isCollapsed ? 320 : 620, 'triangle', 0.05);
    this.cdr.markForCheck();
  }

  public toggleDockPosition(): void {
    this.dockPosition = this.dockPosition === 'top' ? 'bottom' : 'top';
    this.playSfx(720, 'sine', 0.06);
    try {
      localStorage.setItem('we_nav_dock_position', this.dockPosition);
    } catch (e) {}
    this.cdr.markForCheck();
  }

  public toggleSound(): void {
    this.isSoundEnabled = !this.isSoundEnabled;
    try {
      localStorage.setItem('we_nav_sound_enabled', String(this.isSoundEnabled));
    } catch (e) {}
    if (this.isSoundEnabled) {
      this.playSfx(880, 'sine', 0.07);
    }
    this.cdr.markForCheck();
  }

  public openPrivacyModal(): void {
    this.isDrawerOpen = false;
    this.playSfx(480, 'sine', 0.05);
    this.privacyClick.emit();
    this.cdr.markForCheck();
  }

  public isActive(route: string): boolean {
    if (route === '/home') {
      return this.activeRoute === '/home' || this.activeRoute === '/';
    }
    if (route === '/world-data') {
      return this.activeRoute.includes('world-data') || this.activeRoute.includes('geolibre') || this.activeRoute === '/map';
    }
    return this.activeRoute.startsWith(route);
  }

  public isSecondaryActive(): boolean {
    const secondaryRoutes = ['/locate', '/quiz', '/spatial-sql', '/fishing'];
    return secondaryRoutes.some(r => this.activeRoute.startsWith(r));
  }

  public get filteredModules(): DrawerModuleItem[] {
    if (!this.searchQuery.trim()) {
      return this.allModules;
    }
    const q = this.contentFilter.sanitize(this.searchQuery.trim().toLowerCase());
    return this.allModules.filter(m => 
      m.label.toLowerCase().includes(q) || 
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  private updateActiveRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (cleanUrl === '' || cleanUrl === '/' || cleanUrl === '/home') {
      this.activeRoute = '/home';
      this.isCollapsed = true; // Automatically nest into Zen Orb on homepage to reveal Orbital Ring!
    } else {
      this.activeRoute = cleanUrl;
      this.isCollapsed = false;
    }
    this.cdr.markForCheck();
  }

  // Futuristic Web Audio Synthesizer Micro-SFX
  private playSfx(frequency: number, type: OscillatorType = 'sine', duration: number = 0.05): void {
    if (!this.isSoundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioCtx && AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.15, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }
}
