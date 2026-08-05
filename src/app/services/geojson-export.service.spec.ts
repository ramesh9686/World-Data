import { describe, it, expect } from 'vitest';
import { GeoJsonExportService } from './geojson-export.service';

describe('GeoJsonExportService', () => {
  const service = new GeoJsonExportService();

  it('should export countries dataset as valid GeoJSON FeatureCollection', () => {
    const geojson = service.exportCountriesToGeoJSON();
    expect(geojson.type).toBe('FeatureCollection');
    expect(Array.isArray(geojson.features)).toBe(true);
    expect(geojson.features.length).toBeGreaterThan(50);

    const firstFeature = geojson.features[0];
    expect(firstFeature.type).toBe('Feature');
    expect(firstFeature.geometry.type).toBe('Point');
    expect(firstFeature.properties['name']).toBeDefined();
  });

  it('should export maritime dataset as valid GeoJSON FeatureCollection', () => {
    const geojson = service.exportMaritimeToGeoJSON();
    expect(geojson.type).toBe('FeatureCollection');
    expect(geojson.features.length).toBeGreaterThan(10);
  });

  it('should generate valid GeoLibre deep link URL', () => {
    const url = service.getGeoLibreDeepLink(30.5, 32.3, 7, 'Suez Canal');
    expect(url).toContain('https://geolibre.app');
    expect(url).toContain('lat=30.5000');
    expect(url).toContain('lng=32.3000');
    expect(url).toContain('zoom=7');
  });
});
