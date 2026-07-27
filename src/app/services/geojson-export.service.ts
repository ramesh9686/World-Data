import { Injectable } from '@angular/core';
import { COUNTRIES_DATA, CountryData } from '../countries-data';
import {
  WORLD_CANALS,
  STRATEGIC_CHOKEPOINTS,
  GLOBAL_MEGAPORTS,
  CARGO_VESSEL_FLEET,
  ShippingCorridor,
  MaritimeCanal,
  MaritimeChokepoint,
  MaritimePort
} from '../maritime-data';

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPolygon';
    coordinates: number[] | number[][] | number[][][];
  };
  properties: Record<string, any>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

@Injectable({
  providedIn: 'root'
})
export class GeoJsonExportService {
  /**
   * Export all countries in World Explorer as a GeoJSON FeatureCollection
   */
  exportCountriesToGeoJSON(): GeoJSONFeatureCollection {
    const features: GeoJSONFeature[] = [];

    for (const key in COUNTRIES_DATA) {
      const c = COUNTRIES_DATA[key];
      const lat = parseFloat(c.latitude);
      const lng = parseFloat(c.longitude);

      if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
        features.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties: {
            id: c.id,
            iso2Code: c.iso2Code,
            name: c.name,
            capitalCity: c.capitalCity,
            region: c.region?.value || '',
            incomeLevel: c.incomeLevel?.value || '',
            flag: c.flag,
            area: c.area,
            subregion: c.subregion,
            currencies: c.currencies,
            languages: c.languages,
            borders: c.borders ? c.borders.join(', ') : ''
          }
        });
      }
    }

    return {
      type: 'FeatureCollection',
      features
    };
  }

  /**
   * Export Maritime & Logistics data (Canals, Chokepoints, Megaports, Vessels) as GeoJSON
   */
  exportMaritimeToGeoJSON(): GeoJSONFeatureCollection {
    const features: GeoJSONFeature[] = [];

    // 1. Canals
    WORLD_CANALS.forEach((canal: MaritimeCanal) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [canal.coordinates.lng, canal.coordinates.lat]
        },
        properties: {
          category: 'Maritime Canal',
          name: canal.name,
          country: canal.country,
          lengthKm: canal.lengthKm,
          lockCount: canal.lockCount,
          annualVessels: canal.annualVessels,
          summary: canal.summary,
          waterwayType: canal.waterwayType
        }
      });
    });

    // 2. Strategic Chokepoints
    STRATEGIC_CHOKEPOINTS.forEach((choke: MaritimeChokepoint) => {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [choke.coordinates.lng, choke.coordinates.lat]
        },
        properties: {
          category: 'Strategic Chokepoint',
          name: choke.name,
          country: choke.country,
          dailyVessels: choke.dailyVessels,
          cargoVolume: choke.cargoVolume,
          status: choke.status,
          summary: choke.summary,
          keyCommodities: choke.keyCommodities.join(', ')
        }
      });
    });

    // 3. Megaports
    GLOBAL_MEGAPORTS.forEach((port: MaritimePort) => {
      // Approximate lat/lng from SVG cx/cy
      const lng = (port.coordinates.cx - 500) * (360 / 1000);
      const lat = (250 - port.coordinates.cy) * (180 / 500);
      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng.toFixed(4)), parseFloat(lat.toFixed(4))]
        },
        properties: {
          category: 'Global Megaport',
          name: port.name,
          country: port.country,
          annualTEU: port.annualTEU,
          congestionIndex: port.congestionIndex,
          status: port.status
        }
      });
    });

    return {
      type: 'FeatureCollection',
      features
    };
  }

  /**
   * Trigger browser file download for a GeoJSON object
   */
  downloadGeoJSON(data: GeoJSONFeatureCollection, filename: string = 'world-explorer-dataset.geojson'): void {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Build GeoLibre deep link URL given target latitude, longitude, zoom level, and layer options
   */
  getGeoLibreDeepLink(lat: number, lng: number, zoom: number = 5, label?: string): string {
    const baseUrl = 'https://geolibre.app';
    const params = new URLSearchParams({
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      zoom: zoom.toString()
    });
    if (label) {
      params.append('title', label);
    }
    return `${baseUrl}/#${params.toString()}`;
  }
}
