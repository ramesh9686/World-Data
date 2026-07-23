import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES_DATA, CountryData } from '../countries-data';
import {
  MaritimeChokepoint,
  MaritimeCanal,
  ShippingCorridor,
  MaritimePort,
  CargoVessel,
  STRATEGIC_CHOKEPOINTS,
  WORLD_CANALS,
  SHIPPING_CORRIDORS,
  GLOBAL_MEGAPORTS,
  CARGO_VESSEL_FLEET
} from '../maritime-data';

@Component({
  selector: 'app-maritime',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maritime.html',
  styleUrl: './maritime.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaritimeComponent implements OnInit, OnDestroy {
  // Datasets
  chokepoints = STRATEGIC_CHOKEPOINTS;
  canals = WORLD_CANALS;
  corridors = SHIPPING_CORRIDORS;
  megaports = GLOBAL_MEGAPORTS;
  vessels: CargoVessel[] = [];

  // Active Selections & Modals
  selectedChokepoint: MaritimeChokepoint | null = null;
  selectedCanal: MaritimeCanal | null = null;
  selectedVessel: CargoVessel | null = null;
  selectedPort: MaritimePort | null = null;
  selectedCountryData: CountryData | null = null;
  hoveredCountryName: string = '';
  selectedCargoFilter: 'All' | 'Container' | 'Tanker' | 'LNG' | 'Bulk' = 'All';

  // Viewport Camera Engine
  zoom = 1.0;
  panX = 0;
  panY = 0;
  isPanning = false;
  panStartX = 0;
  panStartY = 0;

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  // Animation Engine Timer
  private motionTimer: any = null;
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Clone fleet dataset for live mutation
    this.vessels = CARGO_VESSEL_FLEET.map(v => ({ ...v, progressPercent: v.progressPercent || 0 }));
    this.selectedChokepoint = this.chokepoints[0]; // Suez Canal default
    this.startVesselMotionEngine();
  }

  ngOnDestroy(): void {
    if (this.motionTimer) {
      clearInterval(this.motionTimer);
    }
  }

  // Real-Time Vessel Movement Engine (Runs every 40ms)
  private startVesselMotionEngine(): void {
    this.motionTimer = setInterval(() => {
      let updated = false;

      for (const vessel of this.vessels) {
        // Increment progress (speed factor)
        vessel.progressPercent += (vessel.speedKnots / 300) * vessel.speedMultiplier;
        if (vessel.progressPercent >= 100) {
          vessel.progressPercent = 0;
        }

        // Compute current interpolated SVG position (x, y) along waypoints
        const posAndHeading = this.interpolateWaypoints(vessel.waypoints, vessel.progressPercent);
        vessel.currentPos = { x: posAndHeading.x, y: posAndHeading.y };
        vessel.headingDeg = posAndHeading.headingDeg;
        updated = true;
      }

      if (updated) {
        this.cdr.markForCheck();
      }
    }, 40);
  }

  // Interpolate Position & Angle along SVG Waypoint Array
  private interpolateWaypoints(waypoints: { x: number; y: number }[], progressPercent: number): { x: number; y: number; headingDeg: number } {
    if (!waypoints || waypoints.length === 0) {
      return { x: 500, y: 300, headingDeg: 0 };
    }
    if (waypoints.length === 1) {
      return { x: waypoints[0].x, y: waypoints[0].y, headingDeg: 0 };
    }

    const totalSegments = waypoints.length - 1;
    const globalProgress = (progressPercent / 100) * totalSegments;
    const segmentIndex = Math.min(Math.floor(globalProgress), totalSegments - 1);
    const segmentProgress = globalProgress - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
    const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

    // Heading calculation in degrees
    const deltaX = p2.x - p1.x;
    const deltaY = p2.y - p1.y;
    const headingRad = Math.atan2(deltaY, deltaX);
    const headingDeg = (headingRad * 180) / Math.PI;

    return { x: currentX, y: currentY, headingDeg };
  }

  // Filtered Corridors & Vessels
  get filteredCorridors(): ShippingCorridor[] {
    if (this.selectedCargoFilter === 'All') return this.corridors;
    return this.corridors.filter(c => c.cargoType === this.selectedCargoFilter || c.cargoType === 'Multi');
  }

  get filteredVessels(): CargoVessel[] {
    if (this.selectedCargoFilter === 'All') return this.vessels;
    return this.vessels.filter(v => {
      if (this.selectedCargoFilter === 'Container' && v.vesselType.includes('Container')) return true;
      if (this.selectedCargoFilter === 'Tanker' && v.vesselType.includes('Tanker')) return true;
      if (this.selectedCargoFilter === 'LNG' && v.vesselType.includes('LNG')) return true;
      if (this.selectedCargoFilter === 'Bulk' && v.vesselType.includes('Bulk')) return true;
      return false;
    });
  }

  onCountryHover(name: string): void {
    this.hoveredCountryName = name;
    this.cdr.markForCheck();
  }

  onCountryLeave(): void {
    this.hoveredCountryName = '';
    this.cdr.markForCheck();
  }

  selectCountry(countryId: string, countryName: string): void {
    const key = countryId.toLowerCase();
    this.selectedCountryData = COUNTRIES_DATA[key] || {
      id: countryId.toUpperCase(),
      iso2Code: countryId.toUpperCase(),
      name: countryName,
      region: { id: '', iso2code: '', value: 'Coastal Realm' },
      adminregion: { id: '', iso2code: '', value: '' },
      incomeLevel: { id: '', iso2code: '', value: 'Global Trade Hub' },
      lendingType: { id: '', iso2code: '', value: '' },
      capitalCity: 'Coastal Capital',
      longitude: '0',
      latitude: '0',
      flag: '🌐',
      flagUrl: '',
      currencies: 'Local Currency',
      languages: 'National Language',
      subregion: 'Maritime Zone',
      area: 100000,
      borders: []
    };
    this.selectedChokepoint = null;
    this.selectedCanal = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.playUiSound('select');
    this.cdr.markForCheck();
  }

  // User Selection Actions
  selectChokepoint(cp: MaritimeChokepoint): void {
    this.selectedChokepoint = cp;
    this.selectedCanal = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.selectedCountryData = null;
    this.flyToLocation(cp.coordinates.cx, cp.coordinates.cy, 1.6);
    this.playUiSound('sonar');
  }

  selectCanal(canal: MaritimeCanal): void {
    this.selectedCanal = canal;
    this.selectedChokepoint = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.flyToLocation(canal.coordinates.cx, canal.coordinates.cy, 1.8);
    this.playUiSound('sonar');
  }

  selectPort(port: MaritimePort): void {
    this.selectedPort = port;
    this.selectedChokepoint = null;
    this.selectedVessel = null;
    this.flyToLocation(port.coordinates.cx, port.coordinates.cy, 1.8);
    this.playUiSound('select');
  }

  selectVessel(vessel: CargoVessel): void {
    this.selectedVessel = vessel;
    if (vessel.currentPos) {
      this.flyToLocation(vessel.currentPos.x, vessel.currentPos.y, 2.0);
    }
    this.playUiSound('ping');
  }

  setCargoFilter(filter: 'All' | 'Container' | 'Tanker' | 'LNG' | 'Bulk'): void {
    this.selectedCargoFilter = filter;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  // Camera Controls
  zoomIn(): void {
    this.zoom = Math.min(4.5, this.zoom + 0.3);
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  zoomOut(): void {
    this.zoom = Math.max(0.8, this.zoom - 0.3);
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  resetCamera(): void {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.selectedChokepoint = null;
    this.selectedVessel = null;
    this.selectedPort = null;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  flyToLocation(cx: number, cy: number, targetZoom: number = 1.6): void {
    // 505, 333 is central SVG canvas midpoint
    this.panX = (505 - cx) * targetZoom;
    this.panY = (333 - cy) * targetZoom;
    this.zoom = targetZoom;
    this.cdr.markForCheck();
  }

  // Pan & Drag Handlers
  startPan(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('.camera-control-group, .maritime-telemetry-dock, .filter-pill')) {
      return;
    }
    this.isPanning = true;
    this.panStartX = event.clientX - this.panX;
    this.panStartY = event.clientY - this.panY;
  }

  doPan(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.panX = event.clientX - this.panStartX;
    this.panY = event.clientY - this.panStartY;
    this.cdr.markForCheck();
  }

  endPan(): void {
    this.isPanning = false;
  }

  onWheelZoom(event: WheelEvent): void {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      const delta = event.deltaY < 0 ? 0.15 : -0.15;
      this.zoom = Math.min(4.5, Math.max(0.8, this.zoom + delta));
      this.cdr.markForCheck();
    }
  }

  // Web Audio Synthesizer SFX Engine
  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'sonar' | 'ping' | 'select'): void {
    if (this.audioMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'sonar') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'ping') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  }
}
