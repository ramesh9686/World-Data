import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COUNTRIES_DATA, CountryData } from '../countries-data';
import { RealtimeDataService } from '../realtime-data.service';

export interface ForexItem {
  countryCode: string;
  countryName: string;
  flag: string;
  flagUrl: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  rateVsUsd: number;
  change24h: number;
  region: string;
  subregion: string;
}

export interface OrbitSatellite {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateVsBase: number;
  convertedVal: number;
  angleDeg: number;
  radiusPx: number;
}

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forex.html',
  styleUrl: './forex.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForexComponent implements OnInit, OnDestroy {
  // Converter Controls
  fxAmount = 1000;
  baseCurrencyCode = 'USD';
  targetCurrencyCode = 'EUR';
  searchQuery = '';
  selectedRegion = 'All';
  viewMode: 'grid' | 'orbit' | 'table' = 'grid';
  sortBy: 'name' | 'rateAsc' | 'rateDesc' | 'convertedDesc' | 'changeDesc' = 'convertedDesc';

  // Live Rate Telemetry Update Engine
  selectedIntervalSec = 1800; // Default: 30 minutes (1800s)
  countdownSec = 1800;
  lastSyncTimeFormatted = '';
  isSyncing = false;
  private syncTimer: any = null;

  // Sound Engine
  audioMuted = false;
  private audioCtx: AudioContext | null = null;

  // Master Dataset of All Countries & Currencies
  allForexItems: ForexItem[] = [];
  uniqueCurrencies: { code: string; name: string; symbol: string; flag: string; rateVsUsd: number }[] = [];

  // Authentic Currency Symbol Lookup Dictionary
  private readonly currencySymbolMap: Record<string, string> = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹', CAD: 'CA$', AUD: 'A$', CHF: 'CHF', CNY: '¥', BRL: 'R$',
    AED: 'د.إ', SAR: '﷼', ZAR: 'R', MXN: '$', SGD: 'S$', NZD: 'NZ$', SEK: 'kr', NOK: 'kr', KRW: '₩', HKD: 'HK$',
    TRY: '₺', RUB: '₽', EGP: 'E£', IDR: 'Rp', THB: '฿', MYR: 'RM', VND: '₫', PHP: '₱', PKR: '₨', BDT: '৳',
    NGN: '₦', KES: 'KSh', DZD: 'د.ج', MAD: 'د.م.', QAR: '﷼', KWD: 'د.ك', OMR: '﷼', BHD: '.د.ب', ILS: '₪', CLP: '$',
    COP: '$', PEN: 'S/.', ARS: '$', UYU: '$U', CRC: '₡', DOP: 'RD$', HNL: 'L', GTQ: 'Q', NIO: 'C$', PAB: 'B/.',
    PYG: '₲', BOB: 'Bs.', VES: 'Bs.S', JMD: 'J$', BSD: 'B$', TTD: 'TT$', BBD: 'Bds$', AWG: 'ƒ', ANG: 'NAƒ',
    HTG: 'G', FJD: 'FJ$', PGK: 'K', WST: 'WS$', TOP: 'T$', SBD: 'SI$', VUV: 'VT', XPF: '₣', ISK: 'kr', PLN: 'zł',
    CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв', RSD: 'дин.', BAM: 'KM', ALL: 'L', MKD: 'ден', MDL: 'L', GEL: '₾',
    AMD: '֏', AZN: '₼', BYN: 'Br', KZT: '₸', UAH: '₴', UZB: 'soʻm', TMT: 'm', TJS: 'SM', KGS: 'сом', MNT: '₮',
    LAK: '₭', KHR: '៛', MMK: 'Ks', LKR: 'Rs', NPR: 'Rs', MVR: 'Rf', AFN: '؋', IQD: 'ع.د', IRR: '﷼', SYP: 'LS',
    LBP: 'L£', JOD: 'د.ا', YER: '﷼', LYD: 'ل.د', TND: 'د.ت', SDG: 'ج.س.', SSP: 'SS£', ETB: 'Br', SOS: 'Sh',
    DJF: 'Fdj', ERN: 'Nfk', UGX: 'USh', RWF: 'FRw', TZS: 'TSh', MWK: 'MK', ZMW: 'ZK', BWP: 'P', NAD: 'N$',
    SZL: 'E', LSL: 'L', MZN: 'MT', AOA: 'Kz', CDF: 'FC', XAF: 'FCFA', XOF: 'CFA', GHS: '₵', GMD: 'D', GNF: 'FG',
    SLE: 'Le', LRD: 'L$', CVE: 'Esc', STN: 'Db', KMF: 'CF', SCR: 'SR', MUR: 'Rs', MGA: 'Ar'
  };

  // Market Exchange Rates relative to 1 USD
  private defaultRatesVsUsd: Record<string, { name: string; symbol: string; rateVsUsd: number }> = {
    USD: { name: 'US Dollar', symbol: '$', rateVsUsd: 1.0 },
    EUR: { name: 'Euro', symbol: '€', rateVsUsd: 0.92 },
    GBP: { name: 'British Pound', symbol: '£', rateVsUsd: 0.77 },
    JPY: { name: 'Japanese Yen', symbol: '¥', rateVsUsd: 155.4 },
    INR: { name: 'Indian Rupee', symbol: '₹', rateVsUsd: 83.5 },
    CAD: { name: 'Canadian Dollar', symbol: 'CA$', rateVsUsd: 1.37 },
    AUD: { name: 'Australian Dollar', symbol: 'A$', rateVsUsd: 1.51 },
    CHF: { name: 'Swiss Franc', symbol: 'CHF', rateVsUsd: 0.89 },
    CNY: { name: 'Chinese Yuan', symbol: '¥', rateVsUsd: 7.25 },
    BRL: { name: 'Brazilian Real', symbol: 'R$', rateVsUsd: 5.55 },
    AED: { name: 'UAE Dirham', symbol: 'د.إ', rateVsUsd: 3.67 },
    SAR: { name: 'Saudi Riyal', symbol: '﷼', rateVsUsd: 3.75 },
    ZAR: { name: 'South African Rand', symbol: 'R', rateVsUsd: 18.2 },
    MXN: { name: 'Mexican Peso', symbol: '$', rateVsUsd: 18.1 },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', rateVsUsd: 1.34 },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rateVsUsd: 1.64 },
    SEK: { name: 'Swedish Krona', symbol: 'kr', rateVsUsd: 10.55 },
    NOK: { name: 'Norwegian Krone', symbol: 'kr', rateVsUsd: 10.70 },
    KRW: { name: 'South Korean Won', symbol: '₩', rateVsUsd: 1378.0 },
    HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rateVsUsd: 7.81 },
    TRY: { name: 'Turkish Lira', symbol: '₺', rateVsUsd: 32.8 },
    RUB: { name: 'Russian Ruble', symbol: '₽', rateVsUsd: 88.5 },
    EGP: { name: 'Egyptian Pound', symbol: 'E£', rateVsUsd: 47.8 },
    IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', rateVsUsd: 16250.0 },
    THB: { name: 'Thai Baht', symbol: '฿', rateVsUsd: 36.7 },
    MYR: { name: 'Malaysian Ringgit', symbol: 'RM', rateVsUsd: 4.71 },
    VND: { name: 'Vietnamese Dong', symbol: '₫', rateVsUsd: 25450.0 },
    PHP: { name: 'Philippine Peso', symbol: '₱', rateVsUsd: 58.5 },
    PKR: { name: 'Pakistani Rupee', symbol: '₨', rateVsUsd: 278.5 },
    BDT: { name: 'Bangladeshi Taka', symbol: '৳', rateVsUsd: 117.5 },
    NGN: { name: 'Nigerian Naira', symbol: '₦', rateVsUsd: 1480.0 },
    KES: { name: 'Kenyan Shilling', symbol: 'KSh', rateVsUsd: 129.5 },
    DZD: { name: 'Algerian Dinar', symbol: 'د.ج', rateVsUsd: 134.2 },
    MAD: { name: 'Moroccan Dirham', symbol: 'د.م.', rateVsUsd: 9.95 },
    QAR: { name: 'Qatari Riyal', symbol: '﷼', rateVsUsd: 3.64 },
    KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', rateVsUsd: 0.307 },
    OMR: { name: 'Omani Rial', symbol: '﷼', rateVsUsd: 0.385 },
    BHD: { name: 'Bahraini Dinar', symbol: '.د.b', rateVsUsd: 0.376 },
    ILS: { name: 'Israeli Shekel', symbol: '₪', rateVsUsd: 3.68 },
    CLP: { name: 'Chilean Peso', symbol: '$', rateVsUsd: 925.0 },
    COP: { name: 'Colombian Peso', symbol: '$', rateVsUsd: 3950.0 },
    PEN: { name: 'Peruvian Sol', symbol: 'S/.', rateVsUsd: 3.74 },
    ARS: { name: 'Argentine Peso', symbol: '$', rateVsUsd: 920.0 },
    UYU: { name: 'Uruguayan Peso', symbol: '$U', rateVsUsd: 39.8 },
    CRC: { name: 'Costa Rican Colón', symbol: '₡', rateVsUsd: 520.0 },
    DOP: { name: 'Dominican Peso', symbol: 'RD$', rateVsUsd: 59.0 },
    HNL: { name: 'Honduran Lempira', symbol: 'L', rateVsUsd: 24.7 },
    GTQ: { name: 'Guatemalan Quetzal', symbol: 'Q', rateVsUsd: 7.76 },
    NIO: { name: 'Nicaraguan Córdoba', symbol: 'C$', rateVsUsd: 36.8 },
    PAB: { name: 'Panamanian Balboa', symbol: 'B/.', rateVsUsd: 1.00 },
    PYG: { name: 'Paraguayan Guaraní', symbol: '₲', rateVsUsd: 7550.0 },
    BOB: { name: 'Bolivian Boliviano', symbol: 'Bs.', rateVsUsd: 6.91 },
    VES: { name: 'Venezuelan Bolívar', symbol: 'Bs.S', rateVsUsd: 36.5 },
    JMD: { name: 'Jamaican Dollar', symbol: 'J$', rateVsUsd: 156.0 },
    BSD: { name: 'Bahamian Dollar', symbol: 'B$', rateVsUsd: 1.00 },
    TTD: { name: 'Trinidad Dollar', symbol: 'TT$', rateVsUsd: 6.78 },
    BBD: { name: 'Barbadian Dollar', symbol: 'Bds$', rateVsUsd: 2.00 },
    AWG: { name: 'Aruban Florin', symbol: 'ƒ', rateVsUsd: 1.79 },
    ANG: { name: 'Netherlands Antillean Guilder', symbol: 'NAƒ', rateVsUsd: 1.79 },
    HTG: { name: 'Haitian Gourde', symbol: 'G', rateVsUsd: 132.5 },
    FJD: { name: 'Fijian Dollar', symbol: 'FJ$', rateVsUsd: 2.25 },
    PGK: { name: 'Papua New Guinean Kina', symbol: 'K', rateVsUsd: 3.88 },
    WST: { name: 'Samoan Tālā', symbol: 'WS$', rateVsUsd: 2.74 },
    TOP: { name: 'Tongan Paʻanga', symbol: 'T$', rateVsUsd: 2.36 },
    SBD: { name: 'Solomon Islands Dollar', symbol: 'SI$', rateVsUsd: 8.45 },
    VUV: { name: 'Vanuatu Vatu', symbol: 'VT', rateVsUsd: 119.5 },
    XPF: { name: 'CFP Franc', symbol: '₣', rateVsUsd: 110.0 },
    ISK: { name: 'Icelandic Króna', symbol: 'kr', rateVsUsd: 138.5 },
    PLN: { name: 'Polish Złoty', symbol: 'zł', rateVsUsd: 3.96 },
    CZK: { name: 'Czech Koruna', symbol: 'Kč', rateVsUsd: 23.2 },
    HUF: { name: 'Hungarian Forint', symbol: 'Ft', rateVsUsd: 365.0 },
    RON: { name: 'Romanian Leu', symbol: 'lei', rateVsUsd: 4.58 },
    BGN: { name: 'Bulgarian Lev', symbol: 'лв', rateVsUsd: 1.80 },
    RSD: { name: 'Serbian Dinar', symbol: 'дин.', rateVsUsd: 108.0 },
    BAM: { name: 'Bosnia Mark', symbol: 'KM', rateVsUsd: 1.80 },
    ALL: { name: 'Albanian Lek', symbol: 'L', rateVsUsd: 92.5 },
    MKD: { name: 'Macedonian Denar', symbol: 'ден', rateVsUsd: 56.5 },
    MDL: { name: 'Moldovan Leu', symbol: 'L', rateVsUsd: 17.7 },
    GEL: { name: 'Georgian Lari', symbol: '₾', rateVsUsd: 2.78 },
    AMD: { name: 'Armenian Dram', symbol: '֏', rateVsUsd: 388.0 },
    AZN: { name: 'Azerbaijani Manat', symbol: '₼', rateVsUsd: 1.70 },
    BYN: { name: 'Belarusian Ruble', symbol: 'Br', rateVsUsd: 3.27 },
    KZT: { name: 'Kazakhstani Tenge', symbol: '₸', rateVsUsd: 448.0 },
    UAH: { name: 'Ukrainian Hryvnia', symbol: '₴', rateVsUsd: 40.5 },
    UZB: { name: 'Uzbekistani Som', symbol: 'soʻm', rateVsUsd: 12650.0 },
    TMT: { name: 'Turkmenistan Manat', symbol: 'm', rateVsUsd: 3.50 },
    TJS: { name: 'Tajikistani Somoni', symbol: 'SM', rateVsUsd: 10.9 },
    KGS: { name: 'Kyrgystani Som', symbol: 'сом', rateVsUsd: 87.5 },
    MNT: { name: 'Mongolian Tögrög', symbol: '₮', rateVsUsd: 3450.0 },
    LAK: { name: 'Lao Kip', symbol: '₭', rateVsUsd: 21800.0 },
    KHR: { name: 'Cambodian Riel', symbol: '៛', rateVsUsd: 4080.0 },
    MMK: { name: 'Myanmar Kyat', symbol: 'Ks', rateVsUsd: 2100.0 },
    LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs', rateVsUsd: 303.0 },
    NPR: { name: 'Nepalese Rupee', symbol: 'Rs', rateVsUsd: 133.5 },
    MVR: { name: 'Maldivian Rufiyaa', symbol: 'Rf', rateVsUsd: 15.4 },
    AFN: { name: 'Afghan Afghani', symbol: '؋', rateVsUsd: 71.5 },
    IQD: { name: 'Iraqi Dinar', symbol: 'ع.د', rateVsUsd: 1310.0 },
    IRR: { name: 'Iranian Rial', symbol: '﷼', rateVsUsd: 42000.0 },
    SYP: { name: 'Syrian Pound', symbol: 'LS', rateVsUsd: 13000.0 },
    LBP: { name: 'Lebanese Pound', symbol: 'L£', rateVsUsd: 89500.0 },
    JOD: { name: 'Jordanian Dinar', symbol: 'د.ا', rateVsUsd: 0.709 },
    YER: { name: 'Yemeni Rial', symbol: '﷼', rateVsUsd: 250.0 },
    LYD: { name: 'Libyan Dinar', symbol: 'ل.د', rateVsUsd: 4.85 },
    TND: { name: 'Tunisian Dinar', symbol: 'د.ت', rateVsUsd: 3.12 },
    SDG: { name: 'Sudanese Pound', symbol: 'ج.س.', rateVsUsd: 601.0 },
    SSP: { name: 'South Sudanese Pound', symbol: 'SS£', rateVsUsd: 1550.0 },
    ETB: { name: 'Ethiopian Birr', symbol: 'Br', rateVsUsd: 57.5 },
    SOS: { name: 'Somali Shilling', symbol: 'Sh', rateVsUsd: 571.0 },
    DJF: { name: 'Djiboutian Franc', symbol: 'Fdj', rateVsUsd: 177.7 },
    ERN: { name: 'Eritrean Nakfa', symbol: 'Nfk', rateVsUsd: 15.0 },
    UGX: { name: 'Ugandan Shilling', symbol: 'USh', rateVsUsd: 3750.0 },
    RWF: { name: 'Rwandan Franc', symbol: 'FRw', rateVsUsd: 1310.0 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rateVsUsd: 2600.0 },
    MWK: { name: 'Malawian Kwacha', symbol: 'MK', rateVsUsd: 1730.0 },
    ZMW: { name: 'Zambian Kwacha', symbol: 'ZK', rateVsUsd: 25.8 },
    BWP: { name: 'Botswana Pula', symbol: 'P', rateVsUsd: 13.6 },
    NAD: { name: 'Namibian Dollar', symbol: 'N$', rateVsUsd: 18.2 },
    SZL: { name: 'Swazi Lilangeni', symbol: 'E', rateVsUsd: 18.2 },
    LSL: { name: 'Lesotho Loti', symbol: 'L', rateVsUsd: 18.2 },
    MZN: { name: 'Mozambican Metical', symbol: 'MT', rateVsUsd: 63.8 },
    AOA: { name: 'Angolan Kwanza', symbol: 'Kz', rateVsUsd: 855.0 },
    CDF: { name: 'Congolese Franc', symbol: 'FC', rateVsUsd: 2820.0 },
    XAF: { name: 'Central African CFA Franc', symbol: 'FCFA', rateVsUsd: 603.5 },
    XOF: { name: 'West African CFA Franc', symbol: 'CFA', rateVsUsd: 603.5 },
    GHS: { name: 'Ghanaian Cedi', symbol: '₵', rateVsUsd: 14.8 },
    GMD: { name: 'Gambian Dalasi', symbol: 'D', rateVsUsd: 67.5 },
    GNF: { name: 'Guinean Franc', symbol: 'FG', rateVsUsd: 8600.0 },
    SLE: { name: 'Sierra Leonean Leone', symbol: 'Le', rateVsUsd: 22.5 },
    LRD: { name: 'Liberian Dollar', symbol: 'L$', rateVsUsd: 194.0 },
    CVE: { name: 'Cape Verdean Escudo', symbol: 'Esc', rateVsUsd: 101.5 },
    STN: { name: 'São Tomé Dobra', symbol: 'Db', rateVsUsd: 22.5 },
    KMF: { name: 'Comorian Franc', symbol: 'CF', rateVsUsd: 452.5 },
    SCR: { name: 'Seychellois Rupee', symbol: 'SR', rateVsUsd: 13.6 },
    MUR: { name: 'Mauritian Rupee', symbol: 'Rs', rateVsUsd: 46.5 },
    MGA: { name: 'Malagasy Ariary', symbol: 'Ar', rateVsUsd: 4550.0 }
  };

  // Major cross rates matrix currencies
  majorMatrixCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'AED'];

  constructor(
    private realtimeService: RealtimeDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForexDataset();
    this.fetchLiveMarketRates();
    this.startTelemetryTimer();
  }

  ngOnDestroy(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  // Live Auto-Refresh Telemetry Engine
  setIntervalOption(seconds: number): void {
    this.selectedIntervalSec = seconds;
    this.countdownSec = seconds;
    this.playUiSound('click');
    this.startTelemetryTimer();
    this.cdr.markForCheck();
  }

  startTelemetryTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    if (this.selectedIntervalSec <= 0) {
      return; // Manual refresh only
    }

    this.syncTimer = setInterval(() => {
      if (this.countdownSec > 1) {
        this.countdownSec--;
      } else {
        this.fetchLiveMarketRates();
        this.countdownSec = this.selectedIntervalSec;
      }
      this.cdr.markForCheck();
    }, 1000);
  }

  fetchLiveMarketRates(): void {
    this.isSyncing = true;
    this.cdr.markForCheck();

    this.realtimeService.getLiveForexRates('USD').subscribe(liveRates => {
      this.isSyncing = false;
      const now = new Date();
      this.lastSyncTimeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      if (liveRates) {
        // Update defaultRatesVsUsd with live exchange rates from public API
        for (const [code, rate] of Object.entries(liveRates)) {
          if (typeof rate === 'number' && rate > 0) {
            if (this.defaultRatesVsUsd[code]) {
              this.defaultRatesVsUsd[code].rateVsUsd = rate;
            } else {
              this.defaultRatesVsUsd[code] = {
                name: code,
                symbol: this.currencySymbolMap[code] || '$',
                rateVsUsd: rate
              };
            }
          }
        }
      }

      // Re-populate all items
      this.buildForexDataset();
      this.playUiSound('preset');
      this.cdr.markForCheck();
    });
  }

  get countdownFormatted(): string {
    if (this.selectedIntervalSec <= 0) return 'Manual Sync';
    const m = Math.floor(this.countdownSec / 60);
    const s = this.countdownSec % 60;
    if (m > 0) {
      return `${m}m ${s < 10 ? '0' : ''}${s}s`;
    }
    return `${s}s`;
  }

  private buildForexDataset(): void {
    const items: ForexItem[] = [];
    const uniqueMap = new Map<string, { code: string; name: string; symbol: string; flag: string; rateVsUsd: number }>();

    for (const [key, country] of Object.entries(COUNTRIES_DATA)) {
      if (!country.name || !country.region || country.region.value === 'Aggregates') {
        continue;
      }

      const parsed = this.parseCurrencyString(country.currencies, country.name);
      const exactSymbol = this.currencySymbolMap[parsed.code] || parsed.symbol || '$';
      
      const rateInfo = this.defaultRatesVsUsd[parsed.code] || {
        name: parsed.name,
        symbol: exactSymbol,
        rateVsUsd: 1.0 + (country.name.length * 1.7) % 85
      };

      // Pseudo-deterministic 24h change (-2.5% to +2.5%)
      const seed = (country.name.charCodeAt(0) * 17 + country.name.length * 3) % 50;
      const change24h = Number(((seed - 25) / 10).toFixed(2));

      const item: ForexItem = {
        countryCode: country.iso2Code || key.toUpperCase(),
        countryName: country.name,
        flag: country.flag || '🌐',
        flagUrl: country.flagUrl || '',
        currencyCode: parsed.code,
        currencyName: parsed.name || rateInfo.name,
        symbol: exactSymbol,
        rateVsUsd: rateInfo.rateVsUsd,
        change24h: change24h,
        region: country.region.value ? country.region.value.trim() : 'Other',
        subregion: country.subregion || ''
      };

      items.push(item);

      if (!uniqueMap.has(parsed.code)) {
        uniqueMap.set(parsed.code, {
          code: parsed.code,
          name: parsed.name || rateInfo.name,
          symbol: exactSymbol,
          flag: country.flag || '🌐',
          rateVsUsd: rateInfo.rateVsUsd
        });
      }
    }

    this.allForexItems = items;
    this.uniqueCurrencies = Array.from(uniqueMap.values()).sort((a, b) => a.code.localeCompare(b.code));
    this.cdr.markForCheck();
  }

  private parseCurrencyString(rawCurrency: string, countryName: string): { code: string; name: string; symbol: string } {
    if (!rawCurrency || rawCurrency.trim() === '') {
      return { code: 'USD', name: 'US Dollar', symbol: '$' };
    }

    const match = rawCurrency.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    const fullName = match && match[1] ? match[1].trim() : rawCurrency.trim();
    let symbol = match && match[2] ? match[2].trim() : '$';

    let code = 'USD';
    const lowerName = fullName.toLowerCase();

    if (lowerName.includes('euro')) code = 'EUR';
    else if (lowerName.includes('pound')) code = 'GBP';
    else if (lowerName.includes('yen')) code = 'JPY';
    else if (lowerName.includes('rupee')) {
      if (countryName.includes('India')) code = 'INR';
      else if (countryName.includes('Pakistan')) code = 'PKR';
      else if (countryName.includes('Sri Lanka')) code = 'LKR';
      else if (countryName.includes('Nepal')) code = 'NPR';
      else if (countryName.includes('Mauritius')) code = 'MUR';
      else code = 'INR';
    } else if (lowerName.includes('dollar')) {
      if (countryName.includes('United States') || countryName.includes('American')) code = 'USD';
      else if (countryName.includes('Canada')) code = 'CAD';
      else if (countryName.includes('Australia')) code = 'AUD';
      else if (countryName.includes('New Zealand')) code = 'NZD';
      else if (countryName.includes('Singapore')) code = 'SGD';
      else if (countryName.includes('Hong Kong')) code = 'HKD';
      else code = 'USD';
    } else if (lowerName.includes('yuan') || lowerName.includes('renminbi')) code = 'CNY';
    else if (lowerName.includes('franc')) {
      if (countryName.includes('Switzerland')) code = 'CHF';
      else code = 'XAF';
    } else if (lowerName.includes('dirham')) {
      if (countryName.includes('United Arab')) code = 'AED';
      else if (countryName.includes('Morocco')) code = 'MAD';
      else code = 'AED';
    } else if (lowerName.includes('riyal') || lowerName.includes('rial')) {
      if (countryName.includes('Saudi')) code = 'SAR';
      else if (countryName.includes('Qatar')) code = 'QAR';
      else if (countryName.includes('Oman')) code = 'OMR';
      else if (countryName.includes('Iran')) code = 'IRR';
      else code = 'SAR';
    } else if (lowerName.includes('real')) code = 'BRL';
    else if (lowerName.includes('rand')) code = 'ZAR';
    else if (lowerName.includes('peso')) {
      if (countryName.includes('Mexico')) code = 'MXN';
      else if (countryName.includes('Argentina')) code = 'ARS';
      else if (countryName.includes('Chile')) code = 'CLP';
      else if (countryName.includes('Colombia')) code = 'COP';
      else if (countryName.includes('Philippines')) code = 'PHP';
      else code = 'MXN';
    } else if (lowerName.includes('krona') || lowerName.includes('krone')) {
      if (countryName.includes('Sweden')) code = 'SEK';
      else if (countryName.includes('Norway')) code = 'NOK';
      else if (countryName.includes('Iceland')) code = 'ISK';
      else code = 'SEK';
    } else if (lowerName.includes('dinar')) {
      if (countryName.includes('Kuwait')) code = 'KWD';
      else if (countryName.includes('Bahrain')) code = 'BHD';
      else if (countryName.includes('Algeria')) code = 'DZD';
      else if (countryName.includes('Iraq')) code = 'IQD';
      else code = 'KWD';
    } else {
      for (const keyCode of Object.keys(this.defaultRatesVsUsd)) {
        if (this.defaultRatesVsUsd[keyCode].name.toLowerCase() === lowerName) {
          code = keyCode;
          break;
        }
      }
    }

    if (this.currencySymbolMap[code]) {
      symbol = this.currencySymbolMap[code];
    }

    return { code, name: fullName, symbol };
  }

  // Get Symbol by Currency Code
  getSymbolFor(code: string): string {
    return this.currencySymbolMap[code] || this.defaultRatesVsUsd[code]?.symbol || '$';
  }

  // Get Flag Emoji by Currency Code
  getFlagFor(code: string): string {
    const found = this.allForexItems.find(item => item.currencyCode === code);
    if (found && found.flag) return found.flag;
    const flagMap: Record<string, string> = {
      USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', INR: '🇮🇳', CAD: '🇨🇦', AUD: '🇦🇺',
      CHF: '🇨🇭', CNY: '🇨🇳', BRL: '🇧🇷', AED: '🇦🇪', SAR: '🇸🇦', ZAR: '🇿🇦', MXN: '🇲🇽',
      SGD: '🇸🇬', NZD: '🇳🇿', SEK: '🇸🇪', NOK: '🇳🇴', KRW: '🇰🇷', HKD: '🇭🇰', TRY: '🇹🇷',
      RUB: '🇷🇺', EGP: '🇪🇬', IDR: '🇮🇩', THB: '🇹🇭', MYR: '🇲🇾', VND: '🇻🇳', PHP: '🇵🇭'
    };
    return flagMap[code] || '🌐';
  }

  // Get High-Res CDN Flag URL by Currency Code
  getFlagUrlFor(code: string): string {
    const found = this.allForexItems.find(item => item.countryCode);
    if (found && found.countryCode) {
      return `https://flagcdn.com/w40/${found.countryCode.toLowerCase()}.png`;
    }
    const isoMap: Record<string, string> = {
      USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', INR: 'in', CAD: 'ca', AUD: 'au',
      CHF: 'ch', CNY: 'cn', BRL: 'br', AED: 'ae', SAR: 'sa', ZAR: 'za', MXN: 'mx',
      SGD: 'sg', NZD: 'nz', SEK: 'se', NOK: 'no', KRW: 'kr', HKD: 'hk', TRY: 'tr',
      RUB: 'ru', EGP: 'eg', IDR: 'id', THB: 'th', MYR: 'my', VND: 'vn', PHP: 'ph'
    };
    const c = isoMap[code] || 'un';
    return `https://flagcdn.com/w40/${c}.png`;
  }

  // Get Rate vs Base Currency
  getRateVsBase(targetCode: string): number {
    const baseInfo = this.defaultRatesVsUsd[this.baseCurrencyCode] || this.defaultRatesVsUsd['USD'];
    const targetInfo = this.defaultRatesVsUsd[targetCode] || { rateVsUsd: 1.0 };
    return targetInfo.rateVsUsd / baseInfo.rateVsUsd;
  }

  // Convert Amount to Target Currency
  convertValue(targetCode: string): number {
    return this.fxAmount * this.getRateVsBase(targetCode);
  }

  // Active Base Info
  get baseInfo() {
    const rate = this.defaultRatesVsUsd[this.baseCurrencyCode] || { name: 'US Dollar', symbol: '$', rateVsUsd: 1.0 };
    const sym = this.currencySymbolMap[this.baseCurrencyCode] || rate.symbol;
    return { name: rate.name, symbol: sym, rateVsUsd: rate.rateVsUsd };
  }

  // Active Target Info
  get targetInfo() {
    const rate = this.defaultRatesVsUsd[this.targetCurrencyCode] || { name: 'Euro', symbol: '€', rateVsUsd: 0.92 };
    const sym = this.currencySymbolMap[this.targetCurrencyCode] || rate.symbol;
    return { name: rate.name, symbol: sym, rateVsUsd: rate.rateVsUsd };
  }

  // Filtered & Sorted Forex List
  get filteredForexItems(): ForexItem[] {
    let result = this.allForexItems.filter(item => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        item.countryName.toLowerCase().includes(q) || 
        item.currencyCode.toLowerCase().includes(q) || 
        item.currencyName.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q);

      const matchesRegion = this.selectedRegion === 'All' || 
        item.region.toLowerCase().includes(this.selectedRegion.toLowerCase());

      return matchesSearch && matchesRegion;
    });

    return result.sort((a, b) => {
      if (this.sortBy === 'name') {
        return a.countryName.localeCompare(b.countryName);
      } else if (this.sortBy === 'rateAsc') {
        return this.getRateVsBase(a.currencyCode) - this.getRateVsBase(b.currencyCode);
      } else if (this.sortBy === 'rateDesc') {
        return this.getRateVsBase(b.currencyCode) - this.getRateVsBase(a.currencyCode);
      } else if (this.sortBy === 'changeDesc') {
        return b.change24h - a.change24h;
      } else {
        return this.convertValue(b.currencyCode) - this.convertValue(a.currencyCode);
      }
    });
  }

  // Forex Orbit Ring View Items
  get orbitSatellites(): OrbitSatellite[] {
    const topCodes = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'BRL', 'AED', 'SAR']
      .filter(c => c !== this.baseCurrencyCode)
      .slice(0, 10);

    const stepAngle = 360 / topCodes.length;

    return topCodes.map((code, index) => {
      const item = this.allForexItems.find(f => f.currencyCode === code) || {
        countryName: code,
        flag: '🌐'
      };

      const angleDeg = index * stepAngle;
      const rateVsBase = this.getRateVsBase(code);

      return {
        code,
        name: this.defaultRatesVsUsd[code]?.name || code,
        symbol: this.getSymbolFor(code),
        flag: item.flag,
        rateVsBase,
        convertedVal: this.convertValue(code),
        angleDeg,
        radiusPx: 210
      };
    });
  }

  // User Actions
  setBaseCurrency(code: string): void {
    if (this.baseCurrencyCode === code) return;
    this.baseCurrencyCode = code;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  swapBaseAndTarget(): void {
    const temp = this.baseCurrencyCode;
    this.baseCurrencyCode = this.targetCurrencyCode;
    this.targetCurrencyCode = temp;
    this.playUiSound('swap');
    this.cdr.markForCheck();
  }

  setAmountPreset(amount: number): void {
    this.fxAmount = amount;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  setRegionFilter(region: string): void {
    this.selectedRegion = region;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  setViewMode(mode: 'grid' | 'orbit' | 'table'): void {
    this.viewMode = mode;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  getCrossRate(baseCode: string, targetCode: string): number {
    const b = this.defaultRatesVsUsd[baseCode]?.rateVsUsd || 1.0;
    const t = this.defaultRatesVsUsd[targetCode]?.rateVsUsd || 1.0;
    return t / b;
  }

  toggleAudio(): void {
    this.audioMuted = !this.audioMuted;
    this.cdr.markForCheck();
  }

  playUiSound(type: 'click' | 'swap' | 'preset'): void {
    if (this.audioMuted) return;
    try {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      const now = this.audioCtx.currentTime;

      if (type === 'swap') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  }
}
