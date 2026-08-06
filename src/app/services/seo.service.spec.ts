import '@angular/compiler';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let mockTitle: any;
  let mockMeta: any;
  let mockRouter: any;
  let mockDocument: any;

  beforeEach(() => {
    mockTitle = { setTitle: vi.fn() };
    mockMeta = { updateTag: vi.fn() };
    mockRouter = { events: { pipe: () => ({ subscribe: () => {} }) } };
    mockDocument = {
      querySelector: vi.fn().mockReturnValue(null),
      getElementById: vi.fn().mockReturnValue(null),
      createElement: vi.fn().mockImplementation((tag: string) => ({
        setAttribute: vi.fn(),
        id: '',
        type: '',
        textContent: ''
      })),
      head: { appendChild: vi.fn() }
    };

    service = new SeoService(mockTitle, mockMeta, mockRouter, mockDocument);
  });

  it('should create the SeoService instance', () => {
    expect(service).toBeTruthy();
  });

  it('should update page title, meta description, and og tags for /maritime route', () => {
    service.updateSeoForUrl('/maritime');

    expect(mockTitle.setTitle).toHaveBeenCalledWith(expect.stringMatching(/Live Maritime Radar/));
    expect(mockMeta.updateTag).toHaveBeenCalledWith(expect.objectContaining({ name: 'description' }));
    expect(mockMeta.updateTag).toHaveBeenCalledWith(expect.objectContaining({ property: 'og:site_name', content: 'World Explorer Suite' }));
    expect(mockMeta.updateTag).toHaveBeenCalledWith(expect.objectContaining({ property: 'og:url', content: 'https://worldexplorer.app/maritime' }));
  });

  it('should update canonical link tag in DOM', () => {
    service.updateSeoForUrl('/world-data');
    expect(mockDocument.createElement).toHaveBeenCalledWith('link');
    expect(mockDocument.head.appendChild).toHaveBeenCalled();
  });

  it('should inject structured JSON-LD schema into DOM', () => {
    service.updateSeoForUrl('/quiz');
    expect(mockDocument.createElement).toHaveBeenCalledWith('script');
    expect(mockDocument.head.appendChild).toHaveBeenCalled();
  });
});
