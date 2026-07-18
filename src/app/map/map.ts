import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../country';
import { COUNTRIES_DATA } from '../countries-data';
import { RealtimeDataService, RealtimeData } from '../realtime-data.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  selectedCountry = '';
  countryData: CountryData | null = null;
  realtimeData: RealtimeData | null = null;
  loading = false;
  loadingRealtime = false;
  error = false;

  constructor(
    private countryService: CountryService,
    private realtimeService: RealtimeDataService
  ) {}

  onCountrySelected(event: MouseEvent): void {
    const target = event.target as SVGElement;

    if (target.tagName !== 'path') {
      return;
    }

    // Remove previous selection
    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }

    // Highlight new selection
    target.classList.add('selected');

    const countryCode = target.id;
    if (countryCode) {
      this.selectedCountry = countryCode;
      this.fetchCountryData(countryCode);
    }
  }

  getCountryCodeFromIso3(iso3: string): string {
    const code = Object.keys(COUNTRIES_DATA).find(
      (key) => COUNTRIES_DATA[key].id.toLowerCase() === iso3.toLowerCase()
    );
    return code || '';
  }

  getCountryNameFromIso3(iso3: string): string {
    const code = this.getCountryCodeFromIso3(iso3);
    return code ? COUNTRIES_DATA[code].name : iso3;
  }

  selectNeighbour(iso3: string): void {
    const code = this.getCountryCodeFromIso3(iso3);
    if (!code) {
      return;
    }

    // Highlight the path in the SVG
    const prev = document.querySelector('path.selected');
    if (prev) {
      prev.classList.remove('selected');
    }

    const path = document.getElementById(code.toLowerCase());
    if (path) {
      path.classList.add('selected');
      path.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    this.selectedCountry = code;
    this.fetchCountryData(code);
  }

  getWindDirectionLabel(degrees: number): string {
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(degrees / 22.5) % 16;
    return dirs[idx];
  }

  private fetchCountryData(countryCode: string): void {
    this.loading = true;
    this.error = false;
    this.countryData = null;
    this.realtimeData = null;

    this.countryService.getCountryData(countryCode).subscribe({
      next: (data) => {
        this.countryData = data;
        this.loading = false;
        if (!data) {
          this.error = true;
        } else {
          this.fetchRealtimeData(data.latitude, data.longitude);
        }
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  private fetchRealtimeData(lat: string, lng: string): void {
    if (!lat || !lng) {
      return;
    }
    this.loadingRealtime = true;
    this.realtimeService.getRealtimeData(lat, lng).subscribe({
      next: (data) => {
        this.realtimeData = data;
        this.loadingRealtime = false;
      },
      error: () => {
        this.loadingRealtime = false;
      },
    });
  }
}

