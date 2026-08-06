import '@angular/compiler';
import { describe, it, expect, vi } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should instantiate App component with mock dependencies', () => {
    const mockRouter: any = { url: '/home', navigate: vi.fn() };
    const mockSeoService: any = { updateSeoForUrl: vi.fn() };
    const app = new App(mockRouter, mockSeoService);

    expect(app).toBeTruthy();
    expect(app.title()).toEqual('World Explorer');
    expect(app.isHomePage).toBe(true);
  });
});
