import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { COUNTRIES_DATA } from '../countries-data';

export interface GuessRecord {
  countryCode: string;
  countryName: string;
  distanceKm: number;
  directionLabel: string;
  directionArrow: string;
  tempStatus: string;
  tempEmoji: string;
  tempColor: string;
}

@Component({
  selector: 'app-locate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locate.html',
  styleUrl: './locate.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocateComponent implements OnInit {
  targetCountryCode = '';
  targetCountryName = '';
  targetLat = 0;
  targetLng = 0;
  targetRegion = '';
  
  attempts = 0;
  maxAttempts = 6;
  guessHistory: GuessRecord[] = [];
  gameCompleted = false;
  gameWon = false;
  hintRevealed = false;
  hintText = '';
  lastDistance: number | null = null;
  proximityMessage = 'Click any country on the world map to make your first guess!';
  revealedTargetCode: string | null = null;

  // Camera viewport transform & smooth panning
  zoom = 1.0;
  panX = 0;
  panY = 0;

  get viewportTransform(): string {
    return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
  }

  // Audio SFX Engine
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame(): void {
    // Clear any previous glowing animation class
    if (this.revealedTargetCode) {
      const prevEl = document.getElementById(this.revealedTargetCode);
      if (prevEl) prevEl.classList.remove('glowing-target');
    }

    const countryKeys = Object.keys(COUNTRIES_DATA);
    if (countryKeys.length === 0) return;

    // Pick random target country with valid coordinates
    let targetKey = '';
    do {
      targetKey = countryKeys[Math.floor(Math.random() * countryKeys.length)];
    } while (!COUNTRIES_DATA[targetKey].latitude || !COUNTRIES_DATA[targetKey].longitude);

    const target = COUNTRIES_DATA[targetKey];
    this.targetCountryCode = targetKey;
    this.targetCountryName = target.name;
    this.targetLat = parseFloat(target.latitude);
    this.targetLng = parseFloat(target.longitude);
    this.targetRegion = target.region.value || 'Global';

    this.attempts = 0;
    this.guessHistory = [];
    this.gameCompleted = false;
    this.gameWon = false;
    this.hintRevealed = false;
    this.hintText = '';
    this.lastDistance = null;
    this.revealedTargetCode = null;
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.proximityMessage = 'Target Acquired! Click any country on the map to start guessing!';

    this.cdr.markForCheck();
  }

  onCountrySelected(event: MouseEvent): void {
    if (this.gameCompleted) return;

    const targetEl = event.target as SVGElement;
    if (!targetEl || targetEl.tagName !== 'path' || !targetEl.id) return;

    const code = targetEl.id.toLowerCase();
    const guessedCountry = COUNTRIES_DATA[code];
    if (!guessedCountry || !guessedCountry.latitude || !guessedCountry.longitude) return;

    // Prevent duplicate consecutive guesses
    if (this.guessHistory.some(g => g.countryCode.toLowerCase() === code)) {
      this.proximityMessage = `You already guessed ${guessedCountry.name}! Try another country.`;
      this.cdr.markForCheck();
      return;
    }

    const guessLat = parseFloat(guessedCountry.latitude);
    const guessLng = parseFloat(guessedCountry.longitude);

    // Calculate Haversine distance in KM
    const distanceKm = this.calculateHaversineDistance(guessLat, guessLng, this.targetLat, this.targetLng);
    
    // Calculate bearing compass direction
    const bearing = this.calculateBearing(guessLat, guessLng, this.targetLat, this.targetLng);

    // Determine temperature status
    const isTarget = code === this.targetCountryCode.toLowerCase() || distanceKm === 0;
    const tempInfo = this.getTemperatureStatus(distanceKm, isTarget);

    const record: GuessRecord = {
      countryCode: code,
      countryName: guessedCountry.name,
      distanceKm,
      directionLabel: bearing.label,
      directionArrow: bearing.arrow,
      tempStatus: tempInfo.status,
      tempEmoji: tempInfo.emoji,
      tempColor: tempInfo.color
    };

    this.guessHistory.unshift(record);
    this.attempts++;

    if (isTarget) {
      this.gameWon = true;
      this.gameCompleted = true;
      this.revealedTargetCode = this.targetCountryCode.toLowerCase();
      this.proximityMessage = `🎉 BINGO! Target acquired! You found ${this.targetCountryName} in ${this.attempts} attempts!`;
      this.playUiSound('win');
      this.highlightAndFlyToTarget();
    } else if (this.attempts >= this.maxAttempts) {
      this.gameCompleted = true;
      this.revealedTargetCode = this.targetCountryCode.toLowerCase();
      this.proximityMessage = `💔 Game Over! The secret target country was ${this.targetCountryName}. Watch it glow on the map below!`;
      this.playUiSound('wrong');
      this.highlightAndFlyToTarget();
    } else {
      let warmCoolNote = '';
      if (this.lastDistance !== null) {
        if (distanceKm < this.lastDistance) {
          warmCoolNote = '🔥 Warmer than previous guess!';
        } else {
          warmCoolNote = '🧊 Colder than previous guess!';
        }
      }
      this.lastDistance = distanceKm;
      this.proximityMessage = `${record.countryName} is ${distanceKm.toLocaleString()} km away (${bearing.arrow} ${bearing.label}). ${tempInfo.emoji} ${tempInfo.status}! ${warmCoolNote}`;
      this.playUiSound('ping');
    }

    this.cdr.markForCheck();
  }

  highlightAndFlyToTarget(): void {
    if (!this.revealedTargetCode) return;

    setTimeout(() => {
      const targetEl = document.getElementById(this.revealedTargetCode!);
      if (targetEl) {
        targetEl.classList.add('glowing-target');
        const parent = targetEl.parentNode;
        if (parent) {
          parent.appendChild(targetEl); // Move path to front layer for glow effect
        }

        const el = targetEl as unknown as SVGGraphicsElement;
        if (el && typeof el.getBBox === 'function') {
          try {
            const bbox = el.getBBox();
            const svgCenterX = bbox.x + bbox.width / 2;
            const svgCenterY = bbox.y + bbox.height / 2;
            this.zoom = 2.2;
            this.panX = (505 - svgCenterX) * this.zoom;
            this.panY = (333 - svgCenterY) * this.zoom;
            this.cdr.markForCheck();
          } catch (e) {}
        }
      }
    }, 100);
  }

  revealHint(): void {
    if (this.hintRevealed) return;
    this.hintRevealed = true;
    this.hintText = `💡 Hint: The secret country is located in ${this.targetRegion}!`;
    this.cdr.markForCheck();
  }

  // Viewport Camera Controls
  zoomIn(): void {
    this.zoom = Math.min(5.0, this.zoom + 0.3);
    this.cdr.markForCheck();
  }

  zoomOut(): void {
    this.zoom = Math.max(0.8, this.zoom - 0.3);
    this.cdr.markForCheck();
  }

  resetCamera(): void {
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.cdr.markForCheck();
  }

  onWheelZoom(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.15 : -0.15;
    this.zoom = Math.min(5.0, Math.max(0.8, this.zoom + delta));
    this.cdr.markForCheck();
  }

  // Haversine Distance Calculation Formula
  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  // Compass Bearing Direction Calculation
  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): { label: string, arrow: string } {
    const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
              Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
    let brng = Math.atan2(y, x) * 180 / Math.PI;
    brng = (brng + 360) % 360;

    if (brng >= 337.5 || brng < 22.5) return { label: 'North', arrow: '⬆️' };
    if (brng >= 22.5 && brng < 67.5) return { label: 'North-East', arrow: '↗️' };
    if (brng >= 67.5 && brng < 112.5) return { label: 'East', arrow: '➡️' };
    if (brng >= 112.5 && brng < 157.5) return { label: 'South-East', arrow: '↘️' };
    if (brng >= 157.5 && brng < 202.5) return { label: 'South', arrow: '⬇️' };
    if (brng >= 202.5 && brng < 247.5) return { label: 'South-West', arrow: '↙️' };
    if (brng >= 247.5 && brng < 292.5) return { label: 'West', arrow: '⬅️' };
    return { label: 'North-West', arrow: '↖️' };
  }

  // Proximity Temperature Rules
  private getTemperatureStatus(distanceKm: number, isTarget: boolean): { status: string, emoji: string, color: string } {
    if (isTarget) return { status: 'BINGO! Target Acquired', emoji: '🎉', color: '#10b981' };
    if (distanceKm < 800) return { status: 'Sizzling Hot!', emoji: '🌋', color: '#ef4444' };
    if (distanceKm < 2000) return { status: 'Hotter!', emoji: '🔥', color: '#f97316' };
    if (distanceKm < 4000) return { status: 'Warm', emoji: '☀️', color: '#eab308' };
    if (distanceKm < 8000) return { status: 'Cold', emoji: '❄️', color: '#38bdf8' };
    return { status: 'Freezing Cold', emoji: '🧊', color: '#818cf8' };
  }

  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    this.cdr.markForCheck();
  }

  playUiSound(type: 'ping' | 'win' | 'wrong'): void {
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

      if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }
}
