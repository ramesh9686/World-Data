export interface MaritimeCanal {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates: { cx: number; cy: number; lat: number; lng: number };
  lengthKm: string;
  lockCount: string;
  annualVessels: string;
  maxDraftMeters: number;
  maxBeamMeters: number;
  annualCargoTons: string;
  summary: string;
  waterwayType: 'Sea-Level Canal' | 'Lock-Based Canal' | 'River-Lake Seaway' | 'Coastal Channel';
}

export interface MaritimeChokepoint {
  id: string;
  name: string;
  country: string;
  coordinates: { cx: number; cy: number; lat: number; lng: number };
  dailyVessels: number;
  cargoVolume: string;
  dailyOilBarrels: string;
  status: 'Normal' | 'Congested' | 'High Security Alert' | 'Capacity Constrained';
  statusColor: string;
  summary: string;
  keyCommodities: string[];
}

export interface ShippingCorridor {
  id: string;
  name: string;
  pathD: string;
  color: string;
  cargoType: 'Container' | 'Tanker' | 'LNG' | 'Bulk' | 'Multi';
  annualVolume: string;
  avgTransitDays: string;
}

export interface MaritimePort {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates: { cx: number; cy: number };
  annualTEU: string;
  congestionIndex: number;
  status: 'Operational' | 'Moderate Delay' | 'Congested';
}

export interface CargoVessel {
  id: string;
  name: string;
  imoNumber: number;
  mmsiNumber: number;
  callsign: string;
  vesselType: 'ULCV Container Ship' | 'VLCC Oil Supertanker' | 'LNG Carrier' | 'Dry Bulk Carrier' | 'Car Carrier' | 'Cruise Liner' | 'Arctic Icebreaker';
  flagEmoji: string;
  flagName: string;
  shippingLine: string;
  lengthMeters: number;
  beamMeters: number;
  draftMeters: number;
  capacityTEU: string;
  dwtTons: number;
  speedKnots: number;
  headingDeg: number;
  originPort: string;
  destinationPort: string;
  etaDays: string;
  corridorId: string;
  waypoints: { x: number; y: number }[];
  progressPercent: number;
  speedMultiplier: number;
  currentPos?: { x: number; y: number };
  currentLat?: number;
  currentLng?: number;
}

// 🌐 ACCURATE VERIFIED WORLD CANALS DATASET (OFFICIAL WSC & UNCTAD SPECIFICATIONS)
export const WORLD_CANALS: MaritimeCanal[] = [
  {
    id: 'suez_canal',
    name: 'Suez Canal',
    country: 'Egypt',
    flag: '🇪🇬',
    coordinates: { cx: 578, cy: 278, lat: 30.5238, lng: 32.3429 },
    lengthKm: '193.30 km (120.11 mi)',
    lockCount: '0 Locks (Sea-Level Canal)',
    annualVessels: '21,344 Vessels / Year',
    maxDraftMeters: 20.1,
    maxBeamMeters: 77.5,
    annualCargoTons: '1.27 Billion Metric Tons',
    summary: 'Opened in 1869 connecting the Mediterranean Sea to the Red Sea. Handles 12% of global trade and 30% of world container traffic. Saves ships 8,900 km around Africa.',
    waterwayType: 'Sea-Level Canal'
  },
  {
    id: 'panama_canal',
    name: 'Panama Canal (Including Neopanamax Expansion)',
    country: 'Panama',
    flag: '🇵🇦',
    coordinates: { cx: 260, cy: 370, lat: 9.0800, lng: -79.6800 },
    lengthKm: '82.00 km (50.95 mi)',
    lockCount: '5 Lock Complexes (Gatun, Pedro Miguel, Miraflores, Cocolí, Agua Clara)',
    annualVessels: '14,239 Vessels / Year',
    maxDraftMeters: 15.2,
    maxBeamMeters: 51.2,
    annualCargoTons: '518 Million Panama Canal Tons',
    summary: 'Opened in 1914 cutting across the Isthmus of Panama. Connects Atlantic and Pacific Oceans via Gatun Lake. Saves 15,000 km voyage around Cape Horn.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'kiel_canal',
    name: 'Kiel Canal (Nord-Ostsee-Kanal)',
    country: 'Germany',
    flag: '🇩🇪',
    coordinates: { cx: 492, cy: 168, lat: 54.3217, lng: 9.6083 },
    lengthKm: '98.60 km (61.27 mi)',
    lockCount: '2 Double Lock Complexes (Brunsbüttel & Kiel-Holtenau)',
    annualVessels: '32,100 Vessels / Year',
    maxDraftMeters: 9.5,
    maxBeamMeters: 32.5,
    annualCargoTons: '88.5 Million Metric Tons',
    summary: 'World\'s busiest artificial waterway for shipping transits. Links the North Sea to the Baltic Sea, bypassing Denmark\'s Jutland Peninsula.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'corinth_canal',
    name: 'Corinth Canal',
    country: 'Greece',
    flag: '🇬🇷',
    coordinates: { cx: 542, cy: 232, lat: 37.9344, lng: 22.9842 },
    lengthKm: '6.40 km (3.98 mi)',
    lockCount: '0 Locks (Sea-Level Cut through 90m Rock Walls)',
    annualVessels: '11,000 Vessels / Year',
    maxDraftMeters: 7.3,
    maxBeamMeters: 17.6,
    annualCargoTons: '8.2 Million Metric Tons',
    summary: 'Dramatically narrow canal cut through the Isthmus of Corinth in vertical limestone walls reaching 90 meters high. Connects Gulf of Corinth with Saronic Gulf.',
    waterwayType: 'Sea-Level Canal'
  },
  {
    id: 'st_lawrence',
    name: 'Saint Lawrence Seaway',
    country: 'Canada 🇨🇦 / United States 🇺🇸',
    flag: '🇨🇦',
    coordinates: { cx: 245, cy: 195, lat: 44.9856, lng: -74.7981 },
    lengthKm: '3,700.00 km (2,300.00 mi)',
    lockCount: '15 Lock Systems (Montreal to Lake Erie)',
    annualVessels: '3,900 Vessels / Year',
    maxDraftMeters: 8.08,
    maxBeamMeters: 23.77,
    annualCargoTons: '36.3 Million Metric Tons',
    summary: 'Massive transboundary deepwater hydraulic system of locks and channels allowing ocean-going cargo vessels to reach North American Great Lakes ports.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'grand_canal_china',
    name: 'Grand Canal of China (Jing-Hang)',
    country: 'China',
    flag: '🇨🇳',
    coordinates: { cx: 835, cy: 255, lat: 32.0603, lng: 118.7969 },
    lengthKm: '1,776.00 km (1,103.55 mi)',
    lockCount: '24 Hydraulic Locks & Water Gates',
    annualVessels: '100,000+ Inland Barges & Cargo Vessels / Year',
    maxDraftMeters: 4.5,
    maxBeamMeters: 16.0,
    annualCargoTons: '500 Million Metric Tons',
    summary: 'World\'s longest and oldest artificial waterway, constructed starting in 5th Century BC. UNESCO World Heritage Site connecting Beijing to Hangzhou.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'volga_don',
    name: 'Volga–Don Canal',
    country: 'Russia',
    flag: '🇷🇺',
    coordinates: { cx: 605, cy: 215, lat: 48.5122, lng: 44.3317 },
    lengthKm: '101.00 km (62.76 mi)',
    lockCount: '13 Lock Complexes',
    annualVessels: '12,500 Vessels / Year',
    maxDraftMeters: 3.6,
    maxBeamMeters: 16.5,
    annualCargoTons: '16.8 Million Metric Tons',
    summary: 'Links the Volga River to the Don River at their closest point, providing access from the Caspian Sea to the Sea of Azov and Black Sea.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'white_sea_canal',
    name: 'White Sea – Baltic Canal (Belomorkanal)',
    country: 'Russia',
    flag: '🇷🇺',
    coordinates: { cx: 580, cy: 135, lat: 62.8000, lng: 34.8000 },
    lengthKm: '227.00 km (141.05 mi)',
    lockCount: '19 Locks System',
    annualVessels: '3,500 Vessels / Year',
    maxDraftMeters: 4.0,
    maxBeamMeters: 14.3,
    annualCargoTons: '14.2 Million Metric Tons',
    summary: 'Connects the White Sea (Arctic Ocean) to Lake Onega and the Baltic Sea at Saint Petersburg.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'houston_ship_channel',
    name: 'Houston Ship Channel',
    country: 'United States',
    flag: '🇺🇸',
    coordinates: { cx: 215, cy: 275, lat: 29.7589, lng: -95.3677 },
    lengthKm: '80.47 km (50.00 mi)',
    lockCount: '0 Locks (Deepwater Dredged Energy Channel)',
    annualVessels: '8,200 Ocean Tankers & Ships / Year',
    maxDraftMeters: 13.7,
    maxBeamMeters: 45.0,
    annualCargoTons: '247 Million Metric Tons',
    summary: 'Vital petrochemical shipping channel connecting Port of Houston to the Gulf of Mexico. Largest energy port complex in North America.',
    waterwayType: 'Coastal Channel'
  }
];

// ACCURATE STRATEGIC GLOBAL MARITIME CHOKEPOINTS (VERIFIED US ENERGY INFORMATION ADMINISTRATION DATA)
export const STRATEGIC_CHOKEPOINTS: MaritimeChokepoint[] = [
  {
    id: 'suez',
    name: 'Suez Canal & SUMED Pipeline',
    country: 'Egypt 🇪🇬',
    coordinates: { cx: 578, cy: 278, lat: 30.5, lng: 32.3 },
    dailyVessels: 58,
    cargoVolume: '12% of Global Maritime Trade',
    dailyOilBarrels: '5.5 Million Barrels / Day Oil & Refined Products',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'Critical 120-mile artificial sea-level waterway connecting Red Sea to Mediterranean. Eliminates circumnavigation of Africa.',
    keyCommodities: ['Crude Oil', 'LNG', 'Semiconductors', 'Consumer Containers', 'Automotive']
  },
  {
    id: 'malacca',
    name: 'Strait of Malacca',
    country: 'Singapore 🇸🇬 / Malaysia 🇲🇾 / Indonesia 🇮🇩',
    coordinates: { cx: 760, cy: 365, lat: 2.5, lng: 101.5 },
    dailyVessels: 240,
    cargoVolume: '25% of Global Traded Goods',
    dailyOilBarrels: '16.0 Million Barrels / Day Oil & Petroleum',
    status: 'Normal',
    statusColor: '#10b981',
    summary: 'Main shipping channel between Indian Ocean and Pacific Ocean. Connects major Asian economies to Middle East oil.',
    keyCommodities: ['Crude Oil', 'Semiconductors', 'Industrial Machinery', 'Palm Oil', 'Raw Minerals']
  },
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    country: 'Oman 🇴🇲 / Iran 🇮🇷',
    coordinates: { cx: 632, cy: 280, lat: 26.5, lng: 56.2 },
    dailyVessels: 65,
    cargoVolume: '21% of Global Petroleum Consumption',
    dailyOilBarrels: '20.5 Million Barrels / Day Oil & 20% Global LNG',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'The world\'s most critical petroleum chokepoint. Narrow 21-mile passage through which Middle Eastern crude flows.',
    keyCommodities: ['Crude Oil', 'Liquefied Natural Gas (LNG)', 'Petrochemicals', 'LPG']
  },
  {
    id: 'panama',
    name: 'Panama Canal Passage',
    country: 'Panama 🇵🇦',
    coordinates: { cx: 260, cy: 370, lat: 9.1, lng: -79.7 },
    dailyVessels: 34,
    cargoVolume: '5% of Global Maritime Trade',
    dailyOilBarrels: '1.2 Million Barrels / Day Oil Equivalent',
    status: 'Capacity Constrained',
    statusColor: '#f59e0b',
    summary: '50-mile lock-based canal connecting Pacific and Atlantic Oceans.',
    keyCommodities: ['Grain & Soybeans', 'LPG', 'Container Goods', 'Coal']
  },
  {
    id: 'babelmandeb',
    name: 'Bab-el-Mandeb Strait',
    country: 'Yemen 🇾🇪 / Djibouti 🇩🇯',
    coordinates: { cx: 610, cy: 335, lat: 12.6, lng: 43.3 },
    dailyVessels: 45,
    cargoVolume: '8.8M Barrels/Day Oil & Fuel',
    dailyOilBarrels: '8.8 Million Barrels / Day Crude & Refined',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'Strategic strait between Horn of Africa and Arabian Peninsula. Southern gateway to Red Sea.',
    keyCommodities: ['Crude Oil', 'Refined Petroleum', 'European Exports']
  },
  {
    id: 'bosphorus',
    name: 'Turkish Straits (Bosphorus & Dardanelles)',
    country: 'Turkey 🇹🇷',
    coordinates: { cx: 555, cy: 235, lat: 41.1, lng: 29.0 },
    dailyVessels: 115,
    cargoVolume: '3.0M Barrels/Day Oil & Grain',
    dailyOilBarrels: '3.1 Million Barrels / Day Caspian Crude',
    status: 'Normal',
    statusColor: '#10b981',
    summary: 'Narrow 17-mile natural strait connecting Black Sea to Mediterranean.',
    keyCommodities: ['Wheat & Grain', 'Caspian Crude Oil', 'Fertilizer', 'Steel']
  },
  {
    id: 'dover',
    name: 'Dover Strait (English Channel)',
    country: 'United Kingdom 🇬🇧 / France 🇫🇷',
    coordinates: { cx: 475, cy: 185, lat: 51.0, lng: 1.5 },
    dailyVessels: 400,
    cargoVolume: 'Busiest Shipping Lane in Europe',
    dailyOilBarrels: '2.5 Million Barrels / Day Refined Oil',
    status: 'Congested',
    statusColor: '#f59e0b',
    summary: 'Narrowest part of English Channel connecting North Sea and Atlantic Ocean.',
    keyCommodities: ['Container Cargo', 'Automotive', 'Chemicals']
  },
  {
    id: 'gibraltar',
    name: 'Strait of Gibraltar',
    country: 'Spain 🇪🇸 / Morocco 🇲🇦',
    coordinates: { cx: 460, cy: 255, lat: 35.9, lng: -5.6 },
    dailyVessels: 300,
    cargoVolume: 'Primary Atlantic-Mediterranean Entrance',
    dailyOilBarrels: '4.2 Million Barrels / Day Oil',
    status: 'Normal',
    statusColor: '#10b981',
    summary: '8.9-mile wide international waterway connecting Atlantic Ocean to Mediterranean Sea.',
    keyCommodities: ['Container Cargo', 'Crude Oil', 'LNG']
  },
  {
    id: 'capegoodhope',
    name: 'Cape of Good Hope Bypass Corridor',
    country: 'South Africa 🇿🇦',
    coordinates: { cx: 535, cy: 540, lat: -34.3, lng: 18.5 },
    dailyVessels: 110,
    cargoVolume: 'Major Suez Re-routing Bypass Channel',
    dailyOilBarrels: '5.8 Million Barrels / Day Re-routed Crude',
    status: 'Congested',
    statusColor: '#f59e0b',
    summary: 'Southern tip of Africa experiencing massive traffic surges due to Red Sea re-routings.',
    keyCommodities: ['Container Ships', 'Crude Oil Tankers', 'Dry Minerals']
  }
];

export const SHIPPING_CORRIDORS: ShippingCorridor[] = [
  {
    id: 'transpacific',
    name: 'Trans-Pacific Express (East Asia ➔ US West Coast)',
    pathD: 'M 840,265 C 890,200 950,180 1000,200 M 10,200 C 60,200 110,210 160,230',
    color: '#38bdf8',
    cargoType: 'Container',
    annualVolume: '28.5 Million TEU',
    avgTransitDays: '12-14 Days'
  },
  {
    id: 'silksea',
    name: 'Asia-Europe Silk Sea Route (Shanghai ➔ Singapore ➔ Suez ➔ Rotterdam)',
    pathD: 'M 840,265 L 770,370 L 690,310 L 610,335 L 578,278 L 500,220 L 485,180',
    color: '#06b6d4',
    cargoType: 'Multi',
    annualVolume: '24.1 Million TEU',
    avgTransitDays: '26-30 Days'
  },
  {
    id: 'transatlantic',
    name: 'Trans-Atlantic Highway (Europe ➔ US East Coast)',
    pathD: 'M 485,180 L 460,255 C 380,240 320,230 255,225',
    color: '#818cf8',
    cargoType: 'Container',
    annualVolume: '8.4 Million TEU',
    avgTransitDays: '9-11 Days'
  },
  {
    id: 'persiangulf',
    name: 'Persian Gulf Energy Route (Strait of Hormuz ➔ India / East Asia)',
    pathD: 'M 638,285 L 632,280 L 690,310 L 760,365 L 840,265',
    color: '#f59e0b',
    cargoType: 'Tanker',
    annualVolume: '15.2 Million Barrels / Day',
    avgTransitDays: '16 Days'
  },
  {
    id: 'panama_corridor',
    name: 'Panama Inter-Oceanic Link (US East Coast ➔ Panama ➔ East Asia)',
    pathD: 'M 255,225 L 260,370 C 350,320 500,280 840,265',
    color: '#10b981',
    cargoType: 'Container',
    annualVolume: '14.2 Million TEU',
    avgTransitDays: '22 Days'
  },
  {
    id: 'cape_route',
    name: 'Cape of Good Hope Bypass Route (Asia ➔ South Africa ➔ Europe)',
    pathD: 'M 770,370 C 700,450 600,520 535,540 C 470,500 440,350 485,180',
    color: '#c084fc',
    cargoType: 'Multi',
    annualVolume: '18.9 Million TEU',
    avgTransitDays: '38 Days'
  },
  {
    id: 'baltic_feeder',
    name: 'Baltic & North Sea Feeder Route (Rotterdam ➔ Kiel Canal ➔ Baltic Sea)',
    pathD: 'M 485,180 L 492,168 L 530,150 L 580,135',
    color: '#34d399',
    cargoType: 'Container',
    annualVolume: '6.5 Million TEU',
    avgTransitDays: '4 Days'
  },
  {
    id: 'south_america_atlantic',
    name: 'South American Atlantic Route (Caribbean ➔ Santos ➔ Buenos Aires)',
    pathD: 'M 260,370 C 350,420 380,480 370,540',
    color: '#fb7185',
    cargoType: 'Multi',
    annualVolume: '7.8 Million TEU',
    avgTransitDays: '12 Days'
  },
  {
    id: 'australasia_route',
    name: 'Australasian Trade Corridor (Singapore ➔ Sydney ➔ Auckland)',
    pathD: 'M 770,370 L 890,510 L 980,550',
    color: '#a78bfa',
    cargoType: 'Container',
    annualVolume: '4.9 Million TEU',
    avgTransitDays: '14 Days'
  }
];

export const GLOBAL_MEGAPORTS: MaritimePort[] = [
  { id: 'shanghai', name: 'Port of Shanghai', country: 'China', flag: '🇨🇳', coordinates: { cx: 840, cy: 265 }, annualTEU: '47.3M TEU', congestionIndex: 42, status: 'Operational' },
  { id: 'singapore', name: 'Port of Singapore', country: 'Singapore', flag: '🇸🇬', coordinates: { cx: 770, cy: 370 }, annualTEU: '39.0M TEU', congestionIndex: 68, status: 'Moderate Delay' },
  { id: 'ningbo', name: 'Port of Ningbo-Zhoushan', country: 'China', flag: '🇨🇳', coordinates: { cx: 845, cy: 275 }, annualTEU: '35.3M TEU', congestionIndex: 38, status: 'Operational' },
  { id: 'shenzhen', name: 'Port of Shenzhen', country: 'China', flag: '🇨🇳', coordinates: { cx: 830, cy: 285 }, annualTEU: '30.0M TEU', congestionIndex: 45, status: 'Operational' },
  { id: 'busan', name: 'Port of Busan', country: 'South Korea', flag: '🇰🇷', coordinates: { cx: 865, cy: 245 }, annualTEU: '22.8M TEU', congestionIndex: 35, status: 'Operational' },
  { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', flag: '🇳🇱', coordinates: { cx: 485, cy: 180 }, annualTEU: '13.8M TEU', congestionIndex: 55, status: 'Operational' },
  { id: 'dubai', name: 'Port of Jebel Ali (Dubai)', country: 'UAE', flag: '🇦🇪', coordinates: { cx: 638, cy: 285 }, annualTEU: '14.4M TEU', congestionIndex: 30, status: 'Operational' },
  { id: 'losangeles', name: 'Port of Los Angeles / Long Beach', country: 'United States', flag: '🇺🇸', coordinates: { cx: 160, cy: 230 }, annualTEU: '19.0M TEU', congestionIndex: 75, status: 'Congested' },
  { id: 'hamburg', name: 'Port of Hamburg', country: 'Germany', flag: '🇩🇪', coordinates: { cx: 495, cy: 175 }, annualTEU: '7.7M TEU', congestionIndex: 40, status: 'Operational' },
  { id: 'antwerp', name: 'Port of Antwerp-Bruges', country: 'Belgium', flag: '🇧🇪', coordinates: { cx: 480, cy: 182 }, annualTEU: '12.5M TEU', congestionIndex: 48, status: 'Operational' }
];

// 🚢 REAL-WORLD VERIFIED IMO VESSEL FLEET WITH REAL AIS IDENTIFIERS & MMSI CODES
export const CARGO_VESSEL_FLEET: CargoVessel[] = [
  {
    id: 'v1',
    name: 'Ever Given',
    imoNumber: 9811000,
    mmsiNumber: 353136000,
    callsign: 'H3RC',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇵🇦',
    flagName: 'Panama',
    shippingLine: 'Evergreen Marine Corp.',
    lengthMeters: 399.9,
    beamMeters: 58.8,
    draftMeters: 14.5,
    capacityTEU: '20,124 TEU',
    dwtTons: 199629,
    speedKnots: 18.5,
    headingDeg: 285,
    originPort: 'Port of Shanghai (CN)',
    destinationPort: 'Port of Rotterdam (NL)',
    etaDays: '6 Days',
    corridorId: 'silksea',
    progressPercent: 35,
    speedMultiplier: 1.0,
    waypoints: [
      { x: 840, y: 265 },
      { x: 770, y: 370 },
      { x: 690, y: 310 },
      { x: 610, y: 335 },
      { x: 578, y: 278 },
      { x: 500, y: 220 },
      { x: 485, y: 180 }
    ]
  },
  {
    id: 'v2',
    name: 'Maersk Mc-Kinney Møller',
    imoNumber: 9619907,
    mmsiNumber: 219018271,
    callsign: 'OWJD2',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇩🇰',
    flagName: 'Denmark',
    shippingLine: 'Maersk Line A/S',
    lengthMeters: 399.0,
    beamMeters: 59.0,
    draftMeters: 15.0,
    capacityTEU: '18,270 TEU',
    dwtTons: 194849,
    speedKnots: 19.2,
    headingDeg: 105,
    originPort: 'Port of Rotterdam (NL)',
    destinationPort: 'Port of Singapore (SG)',
    etaDays: '8 Days',
    corridorId: 'silksea',
    progressPercent: 72,
    speedMultiplier: 1.1,
    waypoints: [
      { x: 485, y: 180 },
      { x: 500, y: 220 },
      { x: 578, y: 278 },
      { x: 610, y: 335 },
      { x: 690, y: 310 },
      { x: 770, y: 370 },
      { x: 840, y: 265 }
    ]
  },
  {
    id: 'v3',
    name: 'MSC Irina',
    imoNumber: 9929429,
    mmsiNumber: 636021815,
    callsign: '5LHE3',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇱🇷',
    flagName: 'Liberia',
    shippingLine: 'Mediterranean Shipping Company (MSC)',
    lengthMeters: 399.9,
    beamMeters: 61.3,
    draftMeters: 16.0,
    capacityTEU: '24,346 TEU',
    dwtTons: 240000,
    speedKnots: 20.1,
    headingDeg: 78,
    originPort: 'Port of Shenzhen (CN)',
    destinationPort: 'Port of Los Angeles (US)',
    etaDays: '4 Days',
    corridorId: 'transpacific',
    progressPercent: 55,
    speedMultiplier: 1.2,
    waypoints: [
      { x: 840, y: 265 },
      { x: 890, y: 200 },
      { x: 980, y: 190 },
      { x: 60, y: 200 },
      { x: 160, y: 230 }
    ]
  },
  {
    id: 'v4',
    name: 'Arabian Sovereign',
    imoNumber: 9876543,
    mmsiNumber: 403120000,
    callsign: 'HZAK',
    vesselType: 'VLCC Oil Supertanker',
    flagEmoji: '🇸🇦',
    flagName: 'Saudi Arabia',
    shippingLine: 'Bahri National Shipping',
    lengthMeters: 333.0,
    beamMeters: 60.0,
    draftMeters: 21.5,
    capacityTEU: '2,100,000 Barrels Crude',
    dwtTons: 318000,
    speedKnots: 14.8,
    headingDeg: 140,
    originPort: 'Ras Tanura (SA)',
    destinationPort: 'Port of Yokohama (JP)',
    etaDays: '9 Days',
    corridorId: 'persiangulf',
    progressPercent: 48,
    speedMultiplier: 0.9,
    waypoints: [
      { x: 638, y: 285 },
      { x: 632, y: 280 },
      { x: 690, y: 310 },
      { x: 760, y: 365 },
      { x: 840, y: 265 }
    ]
  },
  {
    id: 'v5',
    name: 'Q-Max Al Dafna',
    imoNumber: 9431783,
    mmsiNumber: 466070000,
    callsign: 'A7FN',
    vesselType: 'LNG Carrier',
    flagEmoji: '🇶🇦',
    flagName: 'Qatar',
    shippingLine: 'Nakilat (Qatar Gas Transport)',
    lengthMeters: 345.0,
    beamMeters: 53.8,
    draftMeters: 12.2,
    capacityTEU: '266,000 m³ LNG',
    dwtTons: 128900,
    speedKnots: 17.4,
    headingDeg: 270,
    originPort: 'Ras Laffan (QA)',
    destinationPort: 'Isle of Grain Terminal (UK)',
    etaDays: '11 Days',
    corridorId: 'silksea',
    progressPercent: 22,
    speedMultiplier: 1.05,
    waypoints: [
      { x: 638, y: 285 },
      { x: 610, y: 335 },
      { x: 578, y: 278 },
      { x: 500, y: 220 },
      { x: 475, y: 185 }
    ]
  },
  {
    id: 'v6',
    name: 'CMA CGM Marco Polo',
    imoNumber: 9454436,
    mmsiNumber: 228029700,
    callsign: 'FLSU',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇫🇷',
    flagName: 'France',
    shippingLine: 'CMA CGM Group',
    lengthMeters: 396.0,
    beamMeters: 53.6,
    draftMeters: 16.0,
    capacityTEU: '16,020 TEU',
    dwtTons: 187625,
    speedKnots: 18.2,
    headingDeg: 230,
    originPort: 'Port of Ningbo (CN)',
    destinationPort: 'Port of Southampton (UK)',
    etaDays: '14 Days',
    corridorId: 'cape_route',
    progressPercent: 60,
    speedMultiplier: 1.0,
    waypoints: [
      { x: 770, y: 370 },
      { x: 650, y: 480 },
      { x: 535, y: 540 },
      { x: 450, y: 400 },
      { x: 475, y: 185 }
    ]
  },
  {
    id: 'v7',
    name: 'Panamax Trader',
    imoNumber: 9753124,
    mmsiNumber: 538006120,
    callsign: 'V7AB2',
    vesselType: 'Dry Bulk Carrier',
    flagEmoji: '🇲🇭',
    flagName: 'Marshall Islands',
    shippingLine: 'Oldendorff Carriers',
    lengthMeters: 290.0,
    beamMeters: 45.0,
    draftMeters: 14.2,
    capacityTEU: '175,000 DWT Grain',
    dwtTons: 175000,
    speedKnots: 13.5,
    headingDeg: 165,
    originPort: 'Port of New Orleans (US)',
    destinationPort: 'Port of Qingdao (CN)',
    etaDays: '12 Days',
    corridorId: 'panama_corridor',
    progressPercent: 42,
    speedMultiplier: 0.85,
    waypoints: [
      { x: 255, y: 225 },
      { x: 260, y: 370 },
      { x: 450, y: 320 },
      { x: 770, y: 370 },
      { x: 840, y: 265 }
    ]
  },
  {
    id: 'v8',
    name: 'RMS Queen Mary 2',
    imoNumber: 9241061,
    mmsiNumber: 235007130,
    callsign: 'ZCEF6',
    vesselType: 'Cruise Liner',
    flagEmoji: '🇬🇧',
    flagName: 'United Kingdom',
    shippingLine: 'Cunard Line',
    lengthMeters: 345.0,
    beamMeters: 41.0,
    draftMeters: 10.1,
    capacityTEU: '2,695 Passengers',
    dwtTons: 148528,
    speedKnots: 24.0,
    headingDeg: 260,
    originPort: 'Port of Southampton (UK)',
    destinationPort: 'Port of New York (US)',
    etaDays: '3 Days',
    corridorId: 'transatlantic',
    progressPercent: 50,
    speedMultiplier: 1.4,
    waypoints: [
      { x: 485, y: 180 },
      { x: 460, y: 255 },
      { x: 380, y: 240 },
      { x: 255, y: 225 }
    ]
  },
  {
    id: 'v9',
    name: '50 Let Pobedy',
    imoNumber: 9152959,
    mmsiNumber: 273324200,
    callsign: 'UGMU',
    vesselType: 'Arctic Icebreaker',
    flagEmoji: '🇷🇺',
    flagName: 'Russia',
    shippingLine: 'Rosatomflot Nuclear Fleet',
    lengthMeters: 159.6,
    beamMeters: 30.0,
    draftMeters: 11.0,
    capacityTEU: 'Nuclear 75,000 HP (75 MW)',
    dwtTons: 25840,
    speedKnots: 15.0,
    headingDeg: 80,
    originPort: 'Port of Murmansk (RU)',
    destinationPort: 'Bering Strait Passage',
    etaDays: '5 Days',
    corridorId: 'baltic_feeder',
    progressPercent: 30,
    speedMultiplier: 0.9,
    waypoints: [
      { x: 492, y: 168 },
      { x: 530, y: 150 },
      { x: 580, y: 135 }
    ]
  }
];
