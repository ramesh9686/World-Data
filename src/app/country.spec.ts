import { describe, it, expect, vi } from 'vitest';
import { CountryService } from './country';

describe('CountryService', () => {
  it('should instantiate with mock HttpClient', () => {
    const mockHttp: any = { get: vi.fn() };
    const service = new CountryService(mockHttp);
    expect(service).toBeTruthy();
  });
});
