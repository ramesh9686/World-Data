import { Injectable } from '@angular/core';

export interface WikiSummary {
  title: string;
  extract: string;
  description?: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WikiService {
  private cache = new Map<string, WikiSummary>();

  constructor() {}

  /**
   * Fetch live Wikipedia summary, extract text, thumbnail, and link for a polity name & year
   */
  async fetchWikiSummary(polityName: string, year?: number): Promise<WikiSummary | null> {
    const cleanName = polityName.trim();
    if (!cleanName) return null;

    const cacheKey = `${cleanName}_${year || ''}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // 1. Search Wikipedia title
      const searchQuery = year ? `${cleanName} history ${year > 0 ? year + ' AD' : Math.abs(year) + ' BC'}` : cleanName;
      let title = await this.searchWikiTitle(searchQuery);

      if (!title && year) {
        title = await this.searchWikiTitle(cleanName);
      }

      if (!title) {
        title = cleanName;
      }

      // 2. Fetch summary REST API
      const summary = await this.fetchSummaryByTitle(title);
      if (summary) {
        this.cache.set(cacheKey, summary);
        return summary;
      }

      return null;
    } catch (err) {
      console.warn('Wiki API fetch failed:', err);
      return null;
    }
  }

  private async searchWikiTitle(query: string): Promise<string | null> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: '1',
      format: 'json',
      origin: '*'
    });

    const url = `https://en.wikipedia.org/w/api.php?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const hits = data?.query?.search || [];
    return hits[0]?.title || null;
  }

  private async fetchSummaryByTitle(title: string): Promise<WikiSummary | null> {
    const encoded = encodeURIComponent(title.replace(/ /g, '_'));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;

    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;

    const data = await res.json();
    return {
      title: data.title || title,
      extract: data.extract || 'No extract text available.',
      description: data.description,
      thumbnail: data.thumbnail,
      pageUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encoded}`
    };
  }
}
