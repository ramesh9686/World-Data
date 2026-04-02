import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryService, CountryData } from '../country';

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
  loading = false;
  error = false;

  constructor(private countryService: CountryService) {}

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

  private fetchCountryData(countryCode: string): void {
    this.loading = true;
    this.error = false;
    this.countryData = null;

    this.countryService.getCountryData(countryCode).subscribe({
      next: (data) => {
        this.countryData = data;
        this.loading = false;
        if (!data) {
          this.error = true;
        }
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }
}
