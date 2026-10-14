import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface SidebarItem {
  id: string;
  label: string;
  sublabel: string;
  route: string;
  icon: string;
  badge?: string;
}

@Component({
  selector: 'app-minimal-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minimal-sidebar.component.html',
  styleUrl: './minimal-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinimalSidebarComponent implements OnInit, OnDestroy {
  @Output() privacyClick = new EventEmitter<void>();

  public isExpanded: boolean = false;
  public activeRoute: string = '/home';

  public primaryNavItems: SidebarItem[] = [
    { id: 'home', label: '3D Earth', sublabel: 'WebGL Globe', route: '/home', icon: '🌍' },
    { id: 'world-data', label: 'World Data', sublabel: 'GIS & Indicators', route: '/world-data', icon: '🌐' },
    { id: 'empires', label: 'Empires', sublabel: 'Historical Cartography', route: '/empires', icon: '🏛️' },
    { id: 'maritime', label: 'Maritime', sublabel: 'Live AIS Vessel Radar', route: '/maritime', icon: '🚢', badge: 'LIVE' },
    { id: 'forex', label: 'Forex', sublabel: 'FX Exchange Matrix', route: '/forex', icon: '💱' },
    { id: 'quiz', label: 'Global Quiz', sublabel: 'Geography Trivia', route: '/quiz', icon: '🎯' },
    { id: 'locate', label: 'Country Locator', sublabel: 'Find Country Game', route: '/locate', icon: '📍' },
    { id: 'spatial-sql', label: 'Spatial SQL', sublabel: 'DuckDB In-Browser', route: '/spatial-sql', icon: '⚡', badge: 'SQL' },
    { id: 'fishing', label: 'Fishing Watch', sublabel: 'GFW Ocean Telemetry', route: '/fishing', icon: '🐟' }
  ];

  private routerSub!: Subscription;

  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateActiveRoute(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveRoute(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.cdr.markForCheck();
  }

  public navigate(item: SidebarItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  public openPrivacy(): void {
    this.privacyClick.emit();
  }

  private updateActiveRoute(url: string): void {
    const cleanUrl = url.split('?')[0].split('#')[0];
    if (cleanUrl === '' || cleanUrl === '/') {
      this.activeRoute = '/home';
    } else {
      this.activeRoute = cleanUrl;
    }
    this.cdr.markForCheck();
  }

  public isActive(route: string): boolean {
    if (route === '/world-data') {
      return this.activeRoute.includes('world-data') || this.activeRoute.includes('geolibre') || this.activeRoute === '/map';
    }
    return this.activeRoute.startsWith(route);
  }
}
