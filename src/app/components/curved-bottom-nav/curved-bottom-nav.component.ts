import { Component, OnInit, OnDestroy, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface NavItem {
  id: string;
  label: string;
  sublabel: string;
  route: string;
  icon: string;
  svgPath?: string;
}

@Component({
  selector: 'app-curved-bottom-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './curved-bottom-nav.component.html',
  styleUrl: './curved-bottom-nav.component.css'
})
export class CurvedBottomNavComponent implements OnInit, OnDestroy {
  @Output() privacyClick = new EventEmitter<void>();

  public navItems: NavItem[] = [
    { id: 'home', label: 'Home', sublabel: '3D Globe', route: '/home', icon: '🏠' },
    { id: 'world-data', label: 'World Data', sublabel: 'GIS & Indicators', route: '/world-data', icon: '🌐' },
    { id: 'empires', label: 'Empires', sublabel: 'Civilizations', route: '/empires', icon: '🏛️' },
    { id: 'maritime', label: 'Maritime', sublabel: 'Live AIS Radar', route: '/maritime', icon: '🚢' },
    { id: 'forex', label: 'Forex', sublabel: 'FX Matrix', route: '/forex', icon: '💱' },
    { id: 'more', label: 'More', sublabel: 'All Modules', route: '', icon: '🧭' }
  ];

  public secondaryModules = [
    { id: 'locate', label: 'Country Locator', desc: 'Geography Locator Game', route: '/locate', icon: '📍', badge: 'Game' },
    { id: 'quiz', label: 'Global Quiz', desc: 'Vector Globe Trivia', route: '/quiz', icon: '🎯', badge: 'Trivia' },
    { id: 'spatial-sql', label: 'DuckDB Spatial SQL', desc: 'In-Browser Spatial Query', route: '/spatial-sql', icon: '⚡', badge: 'SQL' },
    { id: 'fishing', label: 'Fishing Watch', desc: 'Ocean Intelligence & IUU', route: '/fishing', icon: '🐟', badge: 'AIS' },
    { id: 'classic-map', label: 'Classic 2D Map', desc: 'SVG Vector Overlay', route: '/classic-map', icon: '🗺️', badge: '2D' }
  ];

  public activeIndex: number = 0;
  public isMoreMenuOpen: boolean = false;
  public isSecondaryActive: boolean = false;
  public secondaryActiveLabel: string = '';
  private routerSub!: Subscription;

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.updateActiveIndexByUrl(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateActiveIndexByUrl(event.urlAfterRedirects || event.url);
        this.isMoreMenuOpen = false;
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  public updateActiveIndexByUrl(url: string): void {
    this.isSecondaryActive = false;
    this.secondaryActiveLabel = '';

    if (url === '/' || url.includes('home')) {
      this.activeIndex = 0;
      return;
    }
    if (url.includes('world-data') || url.includes('geolibre') || url.includes('map')) {
      this.activeIndex = 1;
      return;
    }
    if (url.includes('empires')) {
      this.activeIndex = 2;
      return;
    }
    if (url.includes('maritime')) {
      this.activeIndex = 3;
      return;
    }
    if (url.includes('forex')) {
      this.activeIndex = 4;
      return;
    }

    // Secondary routes trigger the "More" active slot (index 5)
    const matchedSec = this.secondaryModules.find(m => url.includes(m.id) || url.includes(m.route));
    if (matchedSec) {
      this.activeIndex = 5;
      this.isSecondaryActive = true;
      this.secondaryActiveLabel = matchedSec.label;
      return;
    }

    this.activeIndex = 0;
  }

  public onNavClick(index: number, item: NavItem, event: Event): void {
    if (item.id === 'more') {
      event.preventDefault();
      event.stopPropagation();
      this.isMoreMenuOpen = !this.isMoreMenuOpen;
      return;
    }
    this.activeIndex = index;
    this.isMoreMenuOpen = false;
    this.router.navigate([item.route]);
  }

  public selectSecondary(route: string): void {
    this.isMoreMenuOpen = false;
    this.router.navigate([route]);
  }

  public onPrivacyClick(): void {
    this.isMoreMenuOpen = false;
    this.privacyClick.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.curved-nav-container')) {
      this.isMoreMenuOpen = false;
    }
  }

  public get activeItem(): NavItem {
    return this.navItems[this.activeIndex] || this.navItems[0];
  }
}
