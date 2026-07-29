import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HISTORICAL_EMPIRES, HistoricalEmpire } from '../empires-data';
import { WORLD_SVG_COUNTRY_PATHS, SVGCountryPath } from '../world-svg-paths';

@Component({
  selector: 'app-empires',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empires.html',
  styleUrl: './empires.css'
})
export class EmpiresComponent implements OnInit {
  empiresList: HistoricalEmpire[] = HISTORICAL_EMPIRES;
  selectedEmpireId: string = 'gupta-empire';
  selectedEmpire: HistoricalEmpire | null = HISTORICAL_EMPIRES[0];
  empireEraFilter: string = 'All';
  timelineEraYear: number = 400;

  worldPaths: SVGCountryPath[] = WORLD_SVG_COUNTRY_PATHS;
  spannedCountryCodes: Set<string> = new Set<string>();
  spannedCountryNames: string[] = [];

  // SVG Pan & Zoom State
  zoomLevel: number = 1.0;
  panX: number = 0;
  panY: number = 0;
  isPanning: boolean = false;
  startPanX: number = 0;
  startPanY: number = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.empiresList.length > 0) {
      this.selectEmpire(this.empiresList[0].id);
    }
  }

  get formattedTimelineYear(): string {
    return this.timelineEraYear > 0 ? `${this.timelineEraYear} CE` : `${Math.abs(this.timelineEraYear)} BCE`;
  }

  get filteredEmpires(): HistoricalEmpire[] {
    if (this.empireEraFilter === 'All') return this.empiresList;
    return this.empiresList.filter(e => e.era === this.empireEraFilter);
  }

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
  }

  selectEmpire(empireId: string): void {
    this.selectedEmpireId = empireId;
    const found = HISTORICAL_EMPIRES.find(e => e.id === empireId);
    if (found) {
      this.selectedEmpire = found;
      this.timelineEraYear = found.peakYear;

      const targetCodes = new Set(found.countryCodes.map(c => c.toLowerCase()));
      this.spannedCountryCodes = targetCodes;

      const names: string[] = [];
      this.worldPaths.forEach(p => {
        if (targetCodes.has(p.id)) {
          names.push(p.name);
        }
      });
      this.spannedCountryNames = names.length > 0 ? names : found.countryCodes.map(c => c.toUpperCase());

      // Focus / Pan map near capital city
      if (found.capitalCoords) {
        const cx = found.capitalCoords.cx || 505;
        const cy = found.capitalCoords.cy || 333;
        this.zoomLevel = 1.8;
        this.panX = (505 - cx * 1.8);
        this.panY = (333 - cy * 1.8);
      }
    }
    this.cdr.markForCheck();
  }

  isCountryShaded(pathId: string): boolean {
    return this.spannedCountryCodes.has(pathId.toLowerCase());
  }

  getCountryFill(pathId: string): string {
    if (this.isCountryShaded(pathId) && this.selectedEmpire) {
      return this.selectedEmpire.color || '#f59e0b';
    }
    return 'rgba(30, 41, 59, 0.45)';
  }

  getCountryOpacity(pathId: string): number {
    return this.isCountryShaded(pathId) ? 0.72 : 0.45;
  }

  getCountryStroke(pathId: string): string {
    return this.isCountryShaded(pathId) ? '#ffd700' : 'rgba(255, 255, 255, 0.12)';
  }

  getCountryStrokeWidth(pathId: string): number {
    return this.isCountryShaded(pathId) ? 2.5 : 0.75;
  }

  onTimelineEraScrub(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.timelineEraYear = val;

    let closestEmp = this.empiresList[0];
    let minDiff = Math.abs(closestEmp.peakYear - val);

    for (const emp of this.empiresList) {
      const diff = Math.abs(emp.peakYear - val);
      if (diff < minDiff) {
        minDiff = diff;
        closestEmp = emp;
      }
    }

    if (closestEmp && closestEmp.id !== this.selectedEmpireId) {
      this.selectEmpire(closestEmp.id);
    }
    this.cdr.markForCheck();
  }

  setEmpireEraFilter(era: string): void {
    this.empireEraFilter = era;
    this.cdr.markForCheck();
  }

  // Pan & Zoom Handlers
  zoomIn(): void {
    this.zoomLevel = Math.min(5.0, this.zoomLevel * 1.25);
    this.cdr.markForCheck();
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(0.8, this.zoomLevel / 1.25);
    this.cdr.markForCheck();
  }

  resetViewport(): void {
    this.zoomLevel = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.cdr.markForCheck();
  }

  startPan(event: MouseEvent): void {
    if (event.button !== 0) return;
    this.isPanning = true;
    this.startPanX = event.clientX - this.panX;
    this.startPanY = event.clientY - this.panY;
  }

  doPan(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panX = event.clientX - this.startPanX;
    this.panY = event.clientY - this.startPanY;
    this.cdr.markForCheck();
  }

  endPan(): void {
    this.isPanning = false;
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const zoomFactor = event.deltaY < 0 ? 1.15 : 0.88;
    const newZoom = Math.min(5.0, Math.max(0.8, this.zoomLevel * zoomFactor));

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    this.panX = mouseX - (mouseX - this.panX) * (newZoom / this.zoomLevel);
    this.panY = mouseY - (mouseY - this.panY) * (newZoom / this.zoomLevel);
    this.zoomLevel = newZoom;
    this.cdr.markForCheck();
  }
}
