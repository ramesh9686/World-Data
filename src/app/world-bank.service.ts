import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { WB_TOPICS, WB_INDICATORS_BY_TOPIC, WB_ALL_INDICATORS, WBTopic, WBIndicator } from './indicators-data';

export type WorldBankTopic = WBTopic;
export type WorldBankIndicator = WBIndicator;

export interface WorldBankDataPoint {
  year: number;
  value: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class WorldBankService {
  private dataCache = new Map<string, WorldBankDataPoint[]>();

  constructor(private http: HttpClient) {}

  /**
   * Returns all 21 World Bank topics instantly (0ms) from static data.
   */
  getTopics(): WorldBankTopic[] {
    return WB_TOPICS;
  }

  /**
   * Returns all indicators for a given topic instantly (0ms) from static data.
   * Contains ALL indicators from the World Bank API (not just curated ones).
   */
  /**
   * Returns all indicators for a given topic instantly (0ms) from static data.
   * Intersperses high-quality WHO and UN SDG indicators.
   */
  getIndicatorsByTopic(topicId: number): WorldBankIndicator[] {
    const list = WB_INDICATORS_BY_TOPIC[topicId] || [];

    // Inject WHO and UN indicators into relevant categories
    if (topicId === 8) { // Health
      const healthIndicators: WorldBankIndicator[] = [
        { id: 'WHO:WHOSIS_000001', name: 'WHO: Life expectancy at birth (years)', sourceNote: 'Source: WHO Global Health Observatory. Average number of years a newborn is expected to live.' },
        { id: 'WHO:WHOSIS_000015', name: 'WHO: Healthy life expectancy (HALE) at birth (years)', sourceNote: 'Source: WHO Global Health Observatory. Life expectancy in full health.' },
        { id: 'WHO:MDG_0000000001', name: 'WHO: Infant mortality rate (per 1,000 live births)', sourceNote: 'Source: WHO Global Health Observatory. Probability of dying before age 1.' },
        { id: 'WHO:MDG_0000000007', name: 'WHO: Under-five mortality rate (per 1,000 live births)', sourceNote: 'Source: WHO Global Health Observatory. Probability of dying before age 5.' },
        { id: 'WHO:WHS8_110', name: 'WHO: Maternal mortality ratio (per 100,000 live births)', sourceNote: 'Source: WHO Global Health Observatory. Number of maternal deaths per 100,000 live births.' },
        { id: 'WHO:WHS3_41', name: 'WHO: Adult obesity prevalence (%)', sourceNote: 'Source: WHO Global Health Observatory. Percentage of adults with BMI >= 30.' },
        { id: 'WHO:WHS3_46', name: 'WHO: Tobacco use prevalence (%)', sourceNote: 'Source: WHO Global Health Observatory. Percentage of current tobacco users aged 15+.' }
      ];
      return [...healthIndicators, ...list];
    }

    if (topicId === 11) { // Poverty
      const povertyIndicators: WorldBankIndicator[] = [
        { id: 'UN:1.1.1', name: 'UN SDG: Extreme poverty headcount ratio (%)', sourceNote: 'Source: UN Statistics SDG API. Proportion of population below international poverty line ($2.15/day).' }
      ];
      return [...povertyIndicators, ...list];
    }

    if (topicId === 1) { // Agriculture & Hunger
      const agriIndicators: WorldBankIndicator[] = [
        { id: 'UN:2.1.1', name: 'UN SDG: Prevalence of undernourishment (%)', sourceNote: 'Source: UN Statistics SDG API. Percentage of population with insufficient food consumption.' }
      ];
      return [...agriIndicators, ...list];
    }

    if (topicId === 4) { // Education
      const eduIndicators: WorldBankIndicator[] = [
        { id: 'UN:4.1.1', name: 'UN SDG: Minimum proficiency in reading/math (%)', sourceNote: 'Source: UN Statistics SDG API. Proportion of children achieving minimum proficiency.' }
      ];
      return [...eduIndicators, ...list];
    }

    if (topicId === 17) { // Gender
      const genderIndicators: WorldBankIndicator[] = [
        { id: 'UN:5.5.1', name: 'UN SDG: Seats held by women in parliament (%)', sourceNote: 'Source: UN Statistics SDG API. Proportion of seats held by women in national parliaments.' }
      ];
      return [...genderIndicators, ...list];
    }

    if (topicId === 6) { // Environment / Water
      const envIndicators: WorldBankIndicator[] = [
        { id: 'UN:6.1.1', name: 'UN SDG: Safely managed drinking water access (%)', sourceNote: 'Source: UN Statistics SDG API. Proportion of population using safely managed water.' }
      ];
      return [...envIndicators, ...list];
    }

    if (topicId === 5) { // Energy & Mining
      const energyIndicators: WorldBankIndicator[] = [
        { id: 'UN:7.1.1', name: 'UN SDG: Access to electricity (%)', sourceNote: 'Source: UN Statistics SDG API. Proportion of population with electricity access.' }
      ];
      return [...energyIndicators, ...list];
    }

    if (topicId === 19) { // Climate
      const climateIndicators: WorldBankIndicator[] = [
        { id: 'UN:13.1.1', name: 'UN SDG: Disaster-attributed deaths per 100k', sourceNote: 'Source: UN Statistics SDG API. Deaths, missing, or directly affected persons from disasters.' }
      ];
      return [...climateIndicators, ...list];
    }

    return list;
  }

  /**
   * Returns all 29,556 indicators instantly (0ms) from static data.
   */
  getAllIndicators(): WorldBankIndicator[] {
    return WB_ALL_INDICATORS;
  }

  /**
   * Fetches time-series data for a specific indicator and country.
   * Dynamically routes to WHO GHO, UN Statistics SDG, or World Bank API.
   */
  getIndicatorData(countryCode: string, indicatorId: string): Observable<WorldBankDataPoint[]> {
    const cacheKey = `${countryCode}_${indicatorId}`;
    const cached = this.dataCache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    let url = '';
    let isWHO = false;
    let isUN = false;

    if (indicatorId.startsWith('WHO:')) {
      isWHO = true;
      const whoCode = indicatorId.substring(4);
      // Use the local proxy /gho-api for CORS support during dev
      url = `/gho-api/api/${whoCode}?$filter=SpatialDimType eq 'COUNTRY' and SpatialDim eq '${countryCode.toUpperCase()}'`;
    } else if (indicatorId.startsWith('UN:')) {
      isUN = true;
      const unCode = indicatorId.substring(3);
      url = `https://unstats.un.org/SDGAPI/v1/sdg/Indicator/Data?indicator=${unCode}&areaCode=${countryCode.toUpperCase()}`;
    } else {
      url = `/v2/country/${countryCode.toLowerCase()}/indicator/${indicatorId}?format=json&per_page=60`;
    }

    console.log('[IndicatorData] Fetching:', url);

    return this.http.get<any>(url).pipe(
      timeout(15000),
      map(res => {
        let rawPoints: any[] = [];

        if (isWHO) {
          const list = res?.value || [];
          // Filter for both sexes ('SEX_BTSX') to avoid repeating years
          const hasBothSexes = list.some((item: any) => item.Dim1 === 'SEX_BTSX');
          const filteredList = hasBothSexes ? list.filter((item: any) => item.Dim1 === 'SEX_BTSX') : list;

          rawPoints = filteredList.map((item: any) => ({
            year: parseInt(item.TimeDim || item.TimeDimValue, 10),
            value: item.NumericValue !== undefined && item.NumericValue !== null ? parseFloat(item.NumericValue) : null
          }));
        } else if (isUN) {
          const list = res?.data || [];
          rawPoints = list.map((item: any) => ({
            year: parseInt(item.timePeriodStart || item.year, 10),
            value: item.value !== undefined && item.value !== null ? parseFloat(item.value) : null
          }));
        } else {
          if (Array.isArray(res) && res.length > 1 && Array.isArray(res[1])) {
            rawPoints = res[1].map((item: any) => ({
              year: parseInt(item.date, 10),
              value: item.value !== null ? parseFloat(item.value) : null
            }));
          }
        }

        // Clean, sort, and deduplicate years
        const cleaned = rawPoints
          .filter((pt: any) => !isNaN(pt.year) && pt.value !== null && !isNaN(pt.value))
          .sort((a: any, b: any) => a.year - b.year);

        const uniqueYears: Record<number, boolean> = {};
        const deduplicated: WorldBankDataPoint[] = [];

        for (const pt of cleaned) {
          if (!uniqueYears[pt.year]) {
            uniqueYears[pt.year] = true;
            deduplicated.push(pt);
          }
        }

        console.log('[IndicatorData] Result for', indicatorId, ':', deduplicated.length, 'data points');
        this.dataCache.set(cacheKey, deduplicated);
        return deduplicated;
      }),
      catchError((err) => {
        console.error('[IndicatorData] Error fetching', indicatorId, ':', err?.message || err);
        return of([]);
      })
    );
  }
}
