import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  weatherDescription: string;
  weatherIcon: string;
  pressure: number;
}

export interface AirQualityData {
  usAqi: number;
  aqiLevel: string;
  aqiColor: string;
  pm25: number;
  pm10: number;
  ozone: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  sulphurDioxide: number;
}

export interface RealtimeData {
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeDataService {
  private readonly weatherBase = '/weather-api/v1/forecast';
  private readonly aqiBase = '/aqi-api/v1/air-quality';
  private readonly REQUEST_TIMEOUT_MS = 8000;

  private cache = new Map<string, RealtimeData>();

  constructor(private http: HttpClient) {}

  getRealtimeData(lat: string, lng: string): Observable<RealtimeData> {
    if (!lat || !lng) {
      return of({ weather: null, airQuality: null, timestamp: '' });
    }

    const cacheKey = `${lat},${lng}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    const weatherUrl = `${this.weatherBase}?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure`;
    const aqiUrl = `${this.aqiBase}?latitude=${lat}&longitude=${lng}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;

    return forkJoin([
      this.http.get(weatherUrl).pipe(catchError(() => of(null))),
      this.http.get(aqiUrl).pipe(catchError(() => of(null)))
    ]).pipe(
      map(([weatherRes, aqiRes]) => {
        const result: RealtimeData = {
          weather: this.parseWeather(weatherRes),
          airQuality: this.parseAqi(aqiRes),
          timestamp: new Date().toISOString(),
        };
        this.cache.set(cacheKey, result);
        return result;
      }),
      timeout({
        each: this.REQUEST_TIMEOUT_MS,
        with: () => of({ weather: null, airQuality: null, timestamp: '' })
      }),
      catchError(() => {
        return of({ weather: null, airQuality: null, timestamp: '' });
      })
    );
  }

  getLiveForexRates(baseCurrency: string = 'USD'): Observable<Record<string, number> | null> {
    const url = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    return this.http.get<any>(url).pipe(
      map(res => (res && res.result === 'success' && res.rates) ? res.rates : null),
      timeout({ each: 6000, with: () => of(null) }),
      catchError(() => of(null))
    );
  }

  private parseWeather(raw: any): WeatherData | null {
    if (!raw?.current) return null;
    const c = raw.current;
    const code = c.weather_code ?? 0;
    return {
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      weatherCode: code,
      weatherDescription: this.getWeatherDescription(code),
      weatherIcon: this.getWeatherIcon(code),
      pressure: c.surface_pressure,
    };
  }

  private parseAqi(raw: any): AirQualityData | null {
    if (!raw?.current) return null;
    const c = raw.current;
    const aqi = c.us_aqi ?? 0;
    return {
      usAqi: aqi,
      aqiLevel: this.getAqiLevel(aqi),
      aqiColor: this.getAqiColor(aqi),
      pm25: c.pm2_5 ?? 0,
      pm10: c.pm10 ?? 0,
      ozone: c.ozone ?? 0,
      carbonMonoxide: c.carbon_monoxide ?? 0,
      nitrogenDioxide: c.nitrogen_dioxide ?? 0,
      sulphurDioxide: c.sulphur_dioxide ?? 0,
    };
  }

  private getWeatherDescription(code: number): string {
    const descriptions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight showers',
      81: 'Moderate showers',
      82: 'Violent showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail',
      99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] ?? 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code <= 48) return '🌫️';
    if (code <= 57) return '🌧️';
    if (code <= 65) return '🌧️';
    if (code <= 67) return '🌨️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    if (code <= 86) return '🌨️';
    return '⛈️';
  }

  private getAqiLevel(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy (Sensitive)';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  private getAqiColor(aqi: number): string {
    if (aqi <= 50) return 'aqi-good';
    if (aqi <= 100) return 'aqi-moderate';
    if (aqi <= 150) return 'aqi-sensitive';
    if (aqi <= 200) return 'aqi-unhealthy';
    if (aqi <= 300) return 'aqi-very-unhealthy';
    return 'aqi-hazardous';
  }
}
