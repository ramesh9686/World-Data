import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { CountryService } from './country';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        CountryService
      ]
    });
    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
