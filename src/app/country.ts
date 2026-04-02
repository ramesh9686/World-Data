import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

export interface CountryData {
  name: string;
  capitalCity: string;
  region: { value: string };
  incomeLevel: { value: string };
  longitude: string;
  latitude: string;
  iso2Code: string;
}

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly apiBase = 'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  getCountryData(countryCode: string): Observable<CountryData | null> {
    const url = `${this.apiBase}/${countryCode}?format=json`;
    return this.http.get<any>(url).pipe(
      map((response) => response?.[1]?.[0] ?? null),
      catchError(() => of(null))
    );
  }
}
