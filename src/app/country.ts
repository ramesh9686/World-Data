import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { COUNTRIES_DATA, CountryData } from './countries-data';
export type { CountryData };

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) {}

  getCountryData(countryCode: string): Observable<CountryData | null> {
    const key = countryCode.toLowerCase();
    const data = COUNTRIES_DATA[key] ?? null;
    return of(data);
  }
}
