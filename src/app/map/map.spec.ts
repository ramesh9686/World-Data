import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { MapComponent } from './map';

describe('MapComponent', () => {
  it('should instantiate MapComponent with mock dependencies', () => {
    const mockCountryService: any = {};
    const mockRealtimeService: any = {};
    const mockWbService: any = { getTopics: vi.fn().mockReturnValue([]) };
    const mockGeoJsonService: any = {};
    const mockCdr: any = { markForCheck: vi.fn() };
    const mockRouter: any = { navigate: vi.fn() };

    const component = new MapComponent(
      mockCountryService,
      mockRealtimeService,
      mockWbService,
      mockGeoJsonService,
      mockCdr,
      mockRouter
    );

    expect(component).toBeTruthy();
    expect(component.wbTopics).toEqual([]);
  });
});
