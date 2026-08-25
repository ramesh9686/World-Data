import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
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

export interface TickerPair {
  pair: string;
  rate: string;
  change: string;
  isPos: boolean;
  isNeg: boolean;
}

import { CountUpComponent, SpotlightDirective } from '../shared/react-bits';

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [CommonModule, FormsModule, CountUpComponent, SpotlightDirective],
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
  selectedIntervalSec = 15; // Default: 15 seconds live refresh for dynamic feedback
  countdownSec = 15;
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
    TRY: '₺', RUB: '₽', EGP: 'E£', IDR: 'Rp', THB: '฿', MYR: 'RM', VND: '₫', PHP: '🇵🇭', PKR: '₨', BDT: '৳',
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
  defaultRatesVsUsd: Record<string, { name: string; symbol: string; rateVsUsd: number; change24h: number }> = {
    USD: { name: 'US Dollar', symbol: '$', rateVsUsd: 1.0, change24h: 0.0 },
    EUR: { name: 'Euro', symbol: '€', rateVsUsd: 0.92, change24h: 0.18 },
    GBP: { name: 'British Pound', symbol: '£', rateVsUsd: 0.77, change24h: 0.32 },
    JPY: { name: 'Japanese Yen', symbol: '¥', rateVsUsd: 155.4, change24h: -0.45 },
    INR: { name: 'Indian Rupee', symbol: '₹', rateVsUsd: 83.5, change24h: 0.08 },
    CAD: { name: 'Canadian Dollar', symbol: 'CA$', rateVsUsd: 1.37, change24h: 0.22 },
    AUD: { name: 'Australian Dollar', symbol: 'A$', rateVsUsd: 1.51, change24h: -0.15 },
    CHF: { name: 'Swiss Franc', symbol: 'CHF', rateVsUsd: 0.89, change24h: 0.05 },
    CNY: { name: 'Chinese Yuan', symbol: '¥', rateVsUsd: 7.25, change24h: -0.12 },
    BRL: { name: 'Brazilian Real', symbol: 'R$', rateVsUsd: 5.55, change24h: -0.85 },
    AED: { name: 'UAE Dirham', symbol: 'د.إ', rateVsUsd: 3.67, change24h: 0.01 },
    SAR: { name: 'Saudi Riyal', symbol: '﷼', rateVsUsd: 3.75, change24h: 0.00 },
    ZAR: { name: 'South African Rand', symbol: 'R', rateVsUsd: 18.2, change24h: 0.40 },
    MXN: { name: 'Mexican Peso', symbol: '$', rateVsUsd: 18.1, change24h: -0.30 },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', rateVsUsd: 1.34, change24h: 0.10 },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', rateVsUsd: 1.64, change24h: -0.05 },
    SEK: { name: 'Swedish Krona', symbol: 'kr', rateVsUsd: 10.55, change24h: 0.25 },
    NOK: { name: 'Norwegian Krone', symbol: 'kr', rateVsUsd: 10.70, change24h: -0.18 },
    KRW: { name: 'South Korean Won', symbol: '₩', rateVsUsd: 1378.0, change24h: -0.50 },
    HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', rateVsUsd: 7.81, change24h: 0.02 },
    TRY: { name: 'Turkish Lira', symbol: '₺', rateVsUsd: 32.8, change24h: -1.20 },
    RUB: { name: 'Russian Ruble', symbol: '₽', rateVsUsd: 88.5, change24h: -0.65 },
    EGP: { name: 'Egyptian Pound', symbol: 'E£', rateVsUsd: 47.8, change24h: -0.40 },
    IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', rateVsUsd: 16250.0, change24h: -0.15 },
    THB: { name: 'Thai Baht', symbol: '฿', rateVsUsd: 36.7, change24h: 0.12 },
    MYR: { name: 'Malaysian Ringgit', symbol: 'RM', rateVsUsd: 4.71, change24h: 0.05 },
    VND: { name: 'Vietnamese Dong', symbol: '₫', rateVsUsd: 25450.0, change24h: -0.08 },
    PHP: { name: 'Philippine Peso', symbol: '₱', rateVsUsd: 58.5, change24h: 0.14 },
    PKR: { name: 'Pakistani Rupee', symbol: '₨', rateVsUsd: 278.5, change24h: -0.10 },
    BDT: { name: 'Bangladeshi Taka', symbol: '৳', rateVsUsd: 117.5, change24h: -0.05 },
    NGN: { name: 'Nigerian Naira', symbol: '₦', rateVsUsd: 1480.0, change24h: -1.50 },
    KES: { name: 'Kenyan Shilling', symbol: 'KSh', rateVsUsd: 129.5, change24h: 0.30 },
    DZD: { name: 'Algerian Dinar', symbol: 'د.ج', rateVsUsd: 134.2, change24h: 0.02 },
    MAD: { name: 'Moroccan Dirham', symbol: 'د.م.', rateVsUsd: 9.95, change24h: 0.08 },
    QAR: { name: 'Qatari Riyal', symbol: '﷼', rateVsUsd: 3.64, change24h: 0.00 },
    KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', rateVsUsd: 0.307, change24h: 0.05 },
    OMR: { name: 'Omani Rial', symbol: '﷼', rateVsUsd: 0.385, change24h: 0.00 },
    BHD: { name: 'Bahraini Dinar', symbol: '.د.ب', rateVsUsd: 0.376, change24h: 0.00 },
    ILS: { name: 'Israeli Shekel', symbol: '₪', rateVsUsd: 3.68, change24h: -0.22 },
    CLP: { name: 'Chilean Peso', symbol: '$', rateVsUsd: 925.0, change24h: -0.45 },
    COP: { name: 'Colombian Peso', symbol: '$', rateVsUsd: 3950.0, change24h: -0.60 },
    PEN: { name: 'Peruvian Sol', symbol: 'S/.', rateVsUsd: 3.74, change24h: 0.05 },
    ARS: { name: 'Argentine Peso', symbol: '$', rateVsUsd: 920.0, change24h: -1.80 },
    UYU: { name: 'Uruguayan Peso', symbol: '$U', rateVsUsd: 39.8, change24h: 0.10 },
    CRC: { name: 'Costa Rican Colón', symbol: '₡', rateVsUsd: 520.0, change24h: 0.15 },
    DOP: { name: 'Dominican Peso', symbol: 'RD$', rateVsUsd: 59.0, change24h: -0.05 },
    HNL: { name: 'Honduran Lempira', symbol: 'L', rateVsUsd: 24.7, change24h: 0.00 },
    GTQ: { name: 'Guatemalan Quetzal', symbol: 'Q', rateVsUsd: 7.76, change24h: 0.02 },
    NIO: { name: 'Nicaraguan Córdoba', symbol: 'C$', rateVsUsd: 36.8, change24h: 0.00 },
    PAB: { name: 'Panamanian Balboa', symbol: 'B/.', rateVsUsd: 1.00, change24h: 0.00 },
    PYG: { name: 'Paraguayan Guaraní', symbol: '₲', rateVsUsd: 7550.0, change24h: -0.15 },
    BOB: { name: 'Bolivian Boliviano', symbol: 'Bs.', rateVsUsd: 6.91, change24h: 0.00 },
    VES: { name: 'Venezuelan Bolívar', symbol: 'Bs.S', rateVsUsd: 36.5, change24h: -2.50 },
    JMD: { name: 'Jamaican Dollar', symbol: 'J$', rateVsUsd: 156.0, change24h: -0.10 },
    BSD: { name: 'Bahamian Dollar', symbol: 'B$', rateVsUsd: 1.00, change24h: 0.00 },
    TTD: { name: 'Trinidad Dollar', symbol: 'TT$', rateVsUsd: 6.78, change24h: 0.00 },
    BBD: { name: 'Barbadian Dollar', symbol: 'Bds$', rateVsUsd: 2.00, change24h: 0.00 },
    AWG: { name: 'Aruban Florin', symbol: 'ƒ', rateVsUsd: 1.79, change24h: 0.00 },
    ANG: { name: 'Netherlands Antillean Guilder', symbol: 'NAƒ', rateVsUsd: 1.79, change24h: 0.00 },
    HTG: { name: 'Haitian Gourde', symbol: 'G', rateVsUsd: 132.5, change24h: -0.30 },
    FJD: { name: 'Fijian Dollar', symbol: 'FJ$', rateVsUsd: 2.25, change24h: 0.05 },
    PGK: { name: 'Papua New Guinean Kina', symbol: 'K', rateVsUsd: 3.88, change24h: 0.00 },
    WST: { name: 'Samoan Tālā', symbol: 'WS$', rateVsUsd: 2.74, change24h: 0.00 },
    TOP: { name: 'Tongan Paʻanga', symbol: 'T$', rateVsUsd: 2.36, change24h: 0.00 },
    SBD: { name: 'Solomon Islands Dollar', symbol: 'SI$', rateVsUsd: 8.45, change24h: 0.00 },
    VUV: { name: 'Vanuatu Vatu', symbol: 'VT', rateVsUsd: 119.5, change24h: 0.00 },
    XPF: { name: 'CFP Franc', symbol: '₣', rateVsUsd: 110.0, change24h: 0.00 },
    ISK: { name: 'Icelandic Króna', symbol: 'kr', rateVsUsd: 138.5, change24h: 0.18 },
    PLN: { name: 'Polish Złoty', symbol: 'zł', rateVsUsd: 3.96, change24h: 0.35 },
    CZK: { name: 'Czech Koruna', symbol: 'Kč', rateVsUsd: 23.2, change24h: 0.20 },
    HUF: { name: 'Hungarian Forint', symbol: 'Ft', rateVsUsd: 365.0, change24h: -0.28 },
    RON: { name: 'Romanian Leu', symbol: 'lei', rateVsUsd: 4.58, change24h: 0.10 },
    BGN: { name: 'Bulgarian Lev', symbol: 'лв', rateVsUsd: 1.80, change24h: 0.18 },
    RSD: { name: 'Serbian Dinar', symbol: 'дин.', rateVsUsd: 108.0, change24h: 0.05 },
    BAM: { name: 'Bosnia Mark', symbol: 'KM', rateVsUsd: 1.80, change24h: 0.18 },
    ALL: { name: 'Albanian Lek', symbol: 'L', rateVsUsd: 92.5, change24h: 0.12 },
    MKD: { name: 'Macedonian Denar', symbol: 'ден', rateVsUsd: 56.5, change24h: 0.10 },
    MDL: { name: 'Moldovan Leu', symbol: 'L', rateVsUsd: 17.7, change24h: 0.00 },
    GEL: { name: 'Georgian Lari', symbol: '₾', rateVsUsd: 2.78, change24h: 0.05 },
    AMD: { name: 'Armenian Dram', symbol: '֏', rateVsUsd: 388.0, change24h: 0.00 },
    AZN: { name: 'Azerbaijani Manat', symbol: '₼', rateVsUsd: 1.70, change24h: 0.00 },
    BYN: { name: 'Belarusian Ruble', symbol: 'Br', rateVsUsd: 3.27, change24h: -0.10 },
    KZT: { name: 'Kazakhstani Tenge', symbol: '₸', rateVsUsd: 448.0, change24h: -0.20 },
    UAH: { name: 'Ukrainian Hryvnia', symbol: '₴', rateVsUsd: 40.5, change24h: -0.15 },
    UZB: { name: 'Uzbekistani Som', symbol: 'soʻm', rateVsUsd: 12650.0, change24h: -0.05 },
    TMT: { name: 'Turkmenistan Manat', symbol: 'm', rateVsUsd: 3.50, change24h: 0.00 },
    TJS: { name: 'Tajikistani Somoni', symbol: 'SM', rateVsUsd: 10.9, change24h: 0.00 },
    KGS: { name: 'Kyrgystani Som', symbol: 'сом', rateVsUsd: 87.5, change24h: 0.00 },
    MNT: { name: 'Mongolian Tögrög', symbol: '₮', rateVsUsd: 3450.0, change24h: -0.10 },
    LAK: { name: 'Lao Kip', symbol: '₭', rateVsUsd: 21800.0, change24h: -0.40 },
    KHR: { name: 'Cambodian Riel', symbol: '៛', rateVsUsd: 4080.0, change24h: 0.00 },
    MMK: { name: 'Myanmar Kyat', symbol: 'Ks', rateVsUsd: 2100.0, change24h: -0.30 },
    LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs', rateVsUsd: 303.0, change24h: 0.15 },
    NPR: { name: 'Nepalese Rupee', symbol: 'Rs', rateVsUsd: 133.5, change24h: 0.08 },
    MVR: { name: 'Maldivian Rufiyaa', symbol: 'Rf', rateVsUsd: 15.4, change24h: 0.00 },
    AFN: { name: 'Afghan Afghani', symbol: '؋', rateVsUsd: 71.5, change24h: 0.10 },
    IQD: { name: 'Iraqi Dinar', symbol: 'ع.د', rateVsUsd: 1310.0, change24h: 0.00 },
    IRR: { name: 'Iranian Rial', symbol: '﷼', rateVsUsd: 42000.0, change24h: -0.50 },
    SYP: { name: 'Syrian Pound', symbol: 'LS', rateVsUsd: 13000.0, change24h: -0.80 },
    LBP: { name: 'Lebanese Pound', symbol: 'L£', rateVsUsd: 89500.0, change24h: -1.00 },
    JOD: { name: 'Jordanian Dinar', symbol: 'د.ا', rateVsUsd: 0.709, change24h: 0.00 },
    YER: { name: 'Yemeni Rial', symbol: '﷼', rateVsUsd: 250.0, change24h: 0.00 },
    LYD: { name: 'Libyan Dinar', symbol: 'ل.د', rateVsUsd: 4.85, change24h: -0.10 },
    TND: { name: 'Tunisian Dinar', symbol: 'د.ت', rateVsUsd: 3.12, change24h: 0.05 },
    SDG: { name: 'Sudanese Pound', symbol: 'ج.س.', rateVsUsd: 601.0, change24h: -0.90 },
    SSP: { name: 'South Sudanese Pound', symbol: 'SS£', rateVsUsd: 1550.0, change24h: -1.20 },
    ETB: { name: 'Ethiopian Birr', symbol: 'Br', rateVsUsd: 57.5, change24h: -0.20 },
    SOS: { name: 'Somali Shilling', symbol: 'Sh', rateVsUsd: 571.0, change24h: 0.00 },
    DJF: { name: 'Djiboutian Franc', symbol: 'Fdj', rateVsUsd: 177.7, change24h: 0.00 },
    ERN: { name: 'Eritrean Nakfa', symbol: 'Nfk', rateVsUsd: 15.0, change24h: 0.00 },
    UGX: { name: 'Ugandan Shilling', symbol: 'USh', rateVsUsd: 3750.0, change24h: -0.15 },
    RWF: { name: 'Rwandan Franc', symbol: 'FRw', rateVsUsd: 1310.0, change24h: -0.10 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'TSh', rateVsUsd: 2600.0, change24h: -0.05 },
    MWK: { name: 'Malawian Kwacha', symbol: 'MK', rateVsUsd: 1730.0, change24h: -0.30 },
    ZMW: { name: 'Zambian Kwacha', symbol: 'ZK', rateVsUsd: 25.8, change24h: -0.40 },
    BWP: { name: 'Botswana Pula', symbol: 'P', rateVsUsd: 13.6, change24h: 0.10 },
    NAD: { name: 'Namibian Dollar', symbol: 'N$', rateVsUsd: 18.2, change24h: 0.40 },
    SZL: { name: 'Swazi Lilangeni', symbol: 'E', rateVsUsd: 18.2, change24h: 0.40 },
    LSL: { name: 'Lesotho Loti', symbol: 'L', rateVsUsd: 18.2, change24h: 0.40 },
    MZN: { name: 'Mozambican Metical', symbol: 'MT', rateVsUsd: 63.8, change24h: 0.00 },
    AOA: { name: 'Angolan Kwanza', symbol: 'Kz', rateVsUsd: 855.0, change24h: -0.25 },
    CDF: { name: 'Congolese Franc', symbol: 'FC', rateVsUsd: 2820.0, change24h: -0.35 },
    XAF: { name: 'Central African CFA Franc', symbol: 'FCFA', rateVsUsd: 603.5, change24h: 0.18 },
    XOF: { name: 'West African CFA Franc', symbol: 'CFA', rateVsUsd: 603.5, change24h: 0.18 },
    GHS: { name: 'Ghanaian Cedi', symbol: '₵', rateVsUsd: 14.8, change24h: -0.50 },
    GMD: { name: 'Gambian Dalasi', symbol: 'D', rateVsUsd: 67.5, change24h: 0.00 },
    GNF: { name: 'Guinean Franc', symbol: 'FG', rateVsUsd: 8600.0, change24h: -0.10 },
    SLE: { name: 'Sierra Leonean Leone', symbol: 'Le', rateVsUsd: 22.5, change24h: -0.20 },
    LRD: { name: 'Liberian Dollar', symbol: 'L$', rateVsUsd: 194.0, change24h: 0.00 },
    CVE: { name: 'Cape Verdean Escudo', symbol: 'Esc', rateVsUsd: 101.5, change24h: 0.18 },
    STN: { name: 'São Tomé Dobra', symbol: 'Db', rateVsUsd: 22.5, change24h: 0.00 },
    KMF: { name: 'Comorian Franc', symbol: 'CF', rateVsUsd: 452.5, change24h: 0.18 },
    SCR: { name: 'Seychellois Rupee', symbol: 'SR', rateVsUsd: 13.6, change24h: 0.10 },
    MUR: { name: 'Mauritian Rupee', symbol: 'Rs', rateVsUsd: 46.5, change24h: 0.05 },
    MGA: { name: 'Malagasy Ariary', symbol: 'Ar', rateVsUsd: 4550.0, change24h: -0.20 }
  };

  // Major cross rates matrix currencies
  majorMatrixCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'AED'];

  constructor(
    private realtimeService: RealtimeDataService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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

  // Get Dynamic Ticker Items based on live exchange rates
  get tickerPairs(): TickerPair[] {
    const mainPairs = ['EUR', 'GBP', 'JPY', 'INR', 'CNY', 'CAD', 'AED', 'BRL', 'ZAR', 'AUD', 'CHF', 'SGD'];
    return mainPairs.map(code => {
      const rate = this.getRateVsBase(code);
      const symbol = this.getSymbolFor(code);
      const info = this.defaultRatesVsUsd[code] || { change24h: 0 };
      const changeVal = info.change24h;
      return {
        pair: `${this.baseCurrencyCode}/${code}`,
        rate: `${symbol}${rate.toFixed(4)}`,
        change: `${changeVal >= 0 ? '+' : ''}${changeVal.toFixed(2)}%`,
        isPos: changeVal > 0,
        isNeg: changeVal < 0
      };
    });
  }

  // Explicit Handlers to Ensure Angular OnPush Change Detection Triggers
  onAmountChange(newAmount: any): void {
    let parsed = parseFloat(newAmount);
    if (isNaN(parsed) || parsed < 0) {
      parsed = 0;
    }
    this.fxAmount = parsed;
    this.playUiSound('click');
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  onAmountInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.onAmountChange(target.value);
    }
  }

  setTargetCurrency(code: string): void {
    this.targetCurrencyCode = code;
    this.playUiSound('click');
    this.cdr.markForCheck();
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.cdr.markForCheck();
  }

  onSortChange(sort: any): void {
    this.sortBy = sort;
    this.playUiSound('click');
    this.cdr.markForCheck();
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

    this.ngZone.runOutsideAngular(() => {
      this.syncTimer = setInterval(() => {
        if (this.countdownSec > 1) {
          this.countdownSec--;
          // Perform subtle micro-tick live market simulation
          if (this.countdownSec % 3 === 0) {
            this.applyMicroTicks();
          }
        } else {
          this.fetchLiveMarketRates();
          this.countdownSec = this.selectedIntervalSec;
        }
        this.cdr.markForCheck();
      }, 1000);
    });
  }

  // Simulate Realistic Live Market Fluctuation Ticks
  private applyMicroTicks(): void {
    for (const code of Object.keys(this.defaultRatesVsUsd)) {
      if (code === 'USD') continue;
      const current = this.defaultRatesVsUsd[code];
      const deltaPercent = (Math.random() - 0.495) * 0.002; // Micro fluctuation ±0.1%
      current.rateVsUsd = Math.max(0.0001, current.rateVsUsd * (1 + deltaPercent));
      current.change24h = Number((current.change24h + (Math.random() - 0.5) * 0.04).toFixed(2));
    }
    this.buildForexDataset();
    this.cdr.markForCheck();
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
            let sanitizedRate = rate;
            // Outlier check: prevent distorted API inflation rates for IRR & IDR
            if (code === 'IRR' && rate > 500000) {
              sanitizedRate = 42000.0;
            }
            if (code === 'IDR' && rate > 25000) {
              sanitizedRate = 16250.0;
            }
            if (code === 'INR' && (rate > 120 || rate < 50)) {
              sanitizedRate = 83.50;
            }

            if (this.defaultRatesVsUsd[code]) {
              this.defaultRatesVsUsd[code].rateVsUsd = sanitizedRate;
            } else {
              this.defaultRatesVsUsd[code] = {
                name: code,
                symbol: this.currencySymbolMap[code] || '$',
                rateVsUsd: sanitizedRate,
                change24h: Number(((Math.random() - 0.5) * 2).toFixed(2))
              };
            }
          }
        }
      }

      // Re-populate all items
      this.buildForexDataset();
      this.playUiSound('preset');
      this.cdr.markForCheck();
      this.cdr.detectChanges();
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
        rateVsUsd: 1.0 + (country.name.length * 1.7) % 85,
        change24h: 0
      };

      const item: ForexItem = {
        countryCode: country.iso2Code || key.toUpperCase(),
        countryName: country.name,
        flag: country.flag || '🌐',
        flagUrl: country.flagUrl || '',
        currencyCode: parsed.code,
        currencyName: parsed.name || rateInfo.name,
        symbol: exactSymbol,
        rateVsUsd: rateInfo.rateVsUsd,
        change24h: rateInfo.change24h,
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
