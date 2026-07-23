export interface MaritimeCanal {
  id: string;
  name: string;
  country: string;
  flag: string;
  coordinates: { cx: number; cy: number; lat: number; lng: number };
  lengthKm: string;
  lockCount: string;
  annualVessels: string;
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
  vesselType: 'ULCV Container Ship' | 'VLCC Oil Supertanker' | 'LNG Carrier' | 'Dry Bulk Carrier' | 'Car Carrier' | 'Cruise Liner' | 'Arctic Icebreaker';
  flagEmoji: string;
  flagName: string;
  lengthMeters: number;
  capacityTEU: string;
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
}

// 🌐 ALL WORLD FAMOUS CANALS
export const WORLD_CANALS: MaritimeCanal[] = [
  {
    id: 'suez_canal',
    name: 'Suez Canal',
    country: 'Egypt',
    flag: '🇪🇬',
    coordinates: { cx: 578, cy: 278, lat: 30.5, lng: 32.3 },
    lengthKm: '193.3 km (120 mi)',
    lockCount: '0 Locks (Sea-Level Canal)',
    annualVessels: '21,300 Vessels / Year',
    summary: 'Constructed in 1869 connecting the Mediterranean Sea to the Red Sea. Handles 12% of global trade and 30% of world container ship traffic.',
    waterwayType: 'Sea-Level Canal'
  },
  {
    id: 'panama_canal',
    name: 'Panama Canal',
    country: 'Panama',
    flag: '🇵🇦',
    coordinates: { cx: 260, cy: 370, lat: 9.1, lng: -79.7 },
    lengthKm: '82 km (51 mi)',
    lockCount: '3 Sets of Locks (Gatun, Pedro Miguel, Miraflores)',
    annualVessels: '14,000 Vessels / Year',
    summary: 'Opened in 1914 cutting across the Isthmus of Panama. Connects Atlantic and Pacific Oceans, saving vessels 8,000 nautical miles around Cape Horn.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'kiel_canal',
    name: 'Kiel Canal (Nord-Ostsee-Kanal)',
    country: 'Germany',
    flag: '🇩🇪',
    coordinates: { cx: 492, cy: 168, lat: 54.3, lng: 9.6 },
    lengthKm: '98 km (61 mi)',
    lockCount: '2 Sets of Locks (Brunsbüttel & Kiel-Holtenau)',
    annualVessels: '32,000 Vessels / Year',
    summary: 'Busiest artificial waterway in Europe. Links the North Sea to the Baltic Sea, bypassing the Jutland peninsula of Denmark.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'corinth_canal',
    name: 'Corinth Canal',
    country: 'Greece',
    flag: '🇬🇷',
    coordinates: { cx: 542, cy: 232, lat: 37.9, lng: 22.9 },
    lengthKm: '6.4 km (4 mi)',
    lockCount: '0 Locks (Sea-Level Canal in Steep Rock Cut)',
    annualVessels: '11,000 Vessels / Year',
    summary: 'Dramatically narrow canal cut through the Isthmus of Corinth in rock walls reaching 90 meters high. Connects Gulf of Corinth with Saronic Gulf.',
    waterwayType: 'Sea-Level Canal'
  },
  {
    id: 'st_lawrence',
    name: 'Saint Lawrence Seaway',
    country: 'Canada 🇨🇦 / United States 🇺🇸',
    flag: '🇨🇦',
    coordinates: { cx: 245, cy: 195, lat: 45.0, lng: -74.8 },
    lengthKm: '3,700 km (2,300 mi)',
    lockCount: '15 Locks System',
    annualVessels: '4,000 Vessels / Year',
    summary: 'Massive hydraulic engineering system of locks and canals allowing ocean-going vessels to travel from Atlantic Ocean to Great Lakes ports.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'grand_canal_china',
    name: 'Grand Canal of China (Jing-Hang)',
    country: 'China',
    flag: '🇨🇳',
    coordinates: { cx: 835, cy: 255, lat: 32.0, lng: 118.8 },
    lengthKm: '1,776 km (1,104 mi)',
    lockCount: '24 Locks & Water Gates',
    annualVessels: '100,000+ Barges & Inland Ships / Year',
    summary: 'World\'s longest and oldest artificial canal, built starting in 5th Century BC. UNESCO World Heritage Site connecting Beijing to Hangzhou.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'volga_don',
    name: 'Volga–Don Canal',
    country: 'Russia',
    flag: '🇷🇺',
    coordinates: { cx: 605, cy: 215, lat: 48.5, lng: 44.3 },
    lengthKm: '101 km (63 mi)',
    lockCount: '13 Locks System',
    annualVessels: '12,500 Vessels / Year',
    summary: 'Links the Volga River to the Don River at their closest point, providing access from the Caspian Sea to the Sea of Azov and Black Sea.',
    waterwayType: 'Lock-Based Canal'
  },
  {
    id: 'white_sea_canal',
    name: 'White Sea – Baltic Canal (Belomorkanal)',
    country: 'Russia',
    flag: '🇷🇺',
    coordinates: { cx: 580, cy: 135, lat: 62.8, lng: 34.8 },
    lengthKm: '227 km (141 mi)',
    lockCount: '19 Locks System',
    annualVessels: '3,500 Vessels / Year',
    summary: 'Connects the White Sea (Arctic Ocean) to Lake Onega and the Baltic Sea at Saint Petersburg.',
    waterwayType: 'River-Lake Seaway'
  },
  {
    id: 'houston_ship_channel',
    name: 'Houston Ship Channel',
    country: 'United States',
    flag: '🇺🇸',
    coordinates: { cx: 215, cy: 275, lat: 29.7, lng: -95.1 },
    lengthKm: '80 km (50 mi)',
    lockCount: '0 Locks (Deepwater Dredged Channel)',
    annualVessels: '8,200 Tankers & Ships / Year',
    summary: 'Crucial petrochemical waterway connecting the Port of Houston to the Gulf of Mexico. One of the busiest energy ports on Earth.',
    waterwayType: 'Coastal Channel'
  }
];

// Strategic Global Shipping Bottlenecks & Chokepoints
export const STRATEGIC_CHOKEPOINTS: MaritimeChokepoint[] = [
  {
    id: 'suez',
    name: 'Suez Canal',
    country: 'Egypt 🇪🇬',
    coordinates: { cx: 578, cy: 278, lat: 30.5, lng: 32.3 },
    dailyVessels: 58,
    cargoVolume: '12% of Global Trade (~1.2B Tons/yr)',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'Critical 120-mile artificial sea-level waterway connecting Red Sea to Mediterranean. Eliminates circumnavigation of Africa.',
    keyCommodities: ['Crude Oil', 'LNG', 'Electronics', 'Consumer Goods', 'Automotive']
  },
  {
    id: 'malacca',
    name: 'Strait of Malacca',
    country: 'Singapore 🇸🇬 / Malaysia 🇲🇾 / Indonesia 🇮🇩',
    coordinates: { cx: 760, cy: 365, lat: 2.5, lng: 101.5 },
    dailyVessels: 240,
    cargoVolume: '25% of Global Traded Goods & 15M bpd Oil',
    status: 'Normal',
    statusColor: '#10b981',
    summary: 'Main shipping channel between Indian Ocean and Pacific Ocean. Connects major Asian economies to Middle East oil.',
    keyCommodities: ['Crude Oil', 'Semiconductors', 'Machinery', 'Palm Oil', 'Raw Minerals']
  },
  {
    id: 'hormuz',
    name: 'Strait of Hormuz',
    country: 'Oman 🇴🇲 / Iran 🇮🇷',
    coordinates: { cx: 632, cy: 280, lat: 26.5, lng: 56.2 },
    dailyVessels: 65,
    cargoVolume: '21% of Global Petroleum Consumption (~20.5M bpd)',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'The world\'s most critical petroleum chokepoint. Narrow 21-mile passage through which Middle Eastern oil flows.',
    keyCommodities: ['Crude Oil', 'Liquefied Natural Gas (LNG)', 'Petrochemicals']
  },
  {
    id: 'panama',
    name: 'Panama Canal',
    country: 'Panama 🇵🇦',
    coordinates: { cx: 260, cy: 370, lat: 9.1, lng: -79.7 },
    dailyVessels: 34,
    cargoVolume: '5% of Global Maritime Trade',
    status: 'Capacity Constrained',
    statusColor: '#f59e0b',
    summary: '50-mile lock-based canal connecting Pacific and Atlantic Oceans.',
    keyCommodities: ['Grain', 'LPG', 'Containers', 'Coal']
  },
  {
    id: 'babelmandeb',
    name: 'Bab-el-Mandeb Strait',
    country: 'Yemen 🇾🇪 / Djibouti 🇩🇯',
    coordinates: { cx: 610, cy: 335, lat: 12.6, lng: 43.3 },
    dailyVessels: 45,
    cargoVolume: '8.8M Barrels/Day Oil & Fuel',
    status: 'High Security Alert',
    statusColor: '#ef4444',
    summary: 'Strategic strait between Horn of Africa and Arabian Peninsula. Southern gateway to Red Sea.',
    keyCommodities: ['Crude Oil', 'Refined Petroleum', 'European Goods']
  },
  {
    id: 'bosphorus',
    name: 'Turkish Straits (Bosphorus)',
    country: 'Turkey 🇹🇷',
    coordinates: { cx: 555, cy: 235, lat: 41.1, lng: 29.0 },
    dailyVessels: 115,
    cargoVolume: '3.0M Barrels/Day Oil & Grain',
    status: 'Normal',
    statusColor: '#10b981',
    summary: 'Narrow 17-mile natural strait connecting Black Sea to Mediterranean.',
    keyCommodities: ['Wheat & Grain', 'Caspian Oil', 'Fertilizer', 'Steel']
  },
  {
    id: 'dover',
    name: 'Dover Strait',
    country: 'United Kingdom 🇬🇧 / France 🇫🇷',
    coordinates: { cx: 475, cy: 185, lat: 51.0, lng: 1.5 },
    dailyVessels: 400,
    cargoVolume: 'Busiest Shipping Lane in Europe',
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
    status: 'Normal',
    statusColor: '#10b981',
    summary: '8.9-mile wide international waterway connecting Atlantic Ocean to Mediterranean Sea.',
    keyCommodities: ['Container Cargo', 'Crude Oil', 'LNG']
  },
  {
    id: 'capegoodhope',
    name: 'Cape of Good Hope',
    country: 'South Africa 🇿🇦',
    coordinates: { cx: 535, cy: 540, lat: -34.3, lng: 18.5 },
    dailyVessels: 110,
    cargoVolume: 'Major Suez Re-routing Bypass Channel',
    status: 'Congested',
    statusColor: '#f59e0b',
    summary: 'Southern tip of Africa experiencing massive traffic surges due to Red Sea re-routings.',
    keyCommodities: ['Containers', 'Crude Oil', 'Dry Minerals']
  }
];

// ALL GLOBAL MARITIME SHIPPING CORRIDORS & SEA LANES
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

// Top Global Container Megaports
export const GLOBAL_MEGAPORTS: MaritimePort[] = [
  { id: 'shanghai', name: 'Port of Shanghai', country: 'China', flag: '🇨🇳', coordinates: { cx: 840, cy: 265 }, annualTEU: '47.3M TEU', congestionIndex: 42, status: 'Operational' },
  { id: 'singapore', name: 'Port of Singapore', country: 'Singapore', flag: '🇸🇬', coordinates: { cx: 770, cy: 370 }, annualTEU: '37.5M TEU', congestionIndex: 68, status: 'Moderate Delay' },
  { id: 'ningbo', name: 'Port of Ningbo-Zhoushan', country: 'China', flag: '🇨🇳', coordinates: { cx: 845, cy: 275 }, annualTEU: '33.3M TEU', congestionIndex: 38, status: 'Operational' },
  { id: 'shenzhen', name: 'Port of Shenzhen', country: 'China', flag: '🇨🇳', coordinates: { cx: 830, cy: 285 }, annualTEU: '28.8M TEU', congestionIndex: 45, status: 'Operational' },
  { id: 'busan', name: 'Port of Busan', country: 'South Korea', flag: '🇰🇷', coordinates: { cx: 865, cy: 245 }, annualTEU: '22.7M TEU', congestionIndex: 35, status: 'Operational' },
  { id: 'rotterdam', name: 'Port of Rotterdam', country: 'Netherlands', flag: '🇳🇱', coordinates: { cx: 485, cy: 180 }, annualTEU: '15.3M TEU', congestionIndex: 55, status: 'Operational' },
  { id: 'dubai', name: 'Port of Jebel Ali (Dubai)', country: 'UAE', flag: '🇦🇪', coordinates: { cx: 638, cy: 285 }, annualTEU: '14.1M TEU', congestionIndex: 30, status: 'Operational' },
  { id: 'losangeles', name: 'Port of Los Angeles / Long Beach', country: 'United States', flag: '🇺🇸', coordinates: { cx: 160, cy: 230 }, annualTEU: '10.6M TEU', congestionIndex: 75, status: 'Congested' },
  { id: 'hamburg', name: 'Port of Hamburg', country: 'Germany', flag: '🇩🇪', coordinates: { cx: 495, cy: 175 }, annualTEU: '8.3M TEU', congestionIndex: 40, status: 'Operational' },
  { id: 'antwerp', name: 'Port of Antwerp-Bruges', country: 'Belgium', flag: '🇧🇪', coordinates: { cx: 480, cy: 182 }, annualTEU: '12.5M TEU', congestionIndex: 48, status: 'Operational' }
];

// Active Simulated Cargo Vessel Fleet (With Real-Time Motion Waypoints)
export const CARGO_VESSEL_FLEET: CargoVessel[] = [
  {
    id: 'v1',
    name: 'Ever Given II',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇵anal',
    flagName: 'Panama 🇵🇦',
    lengthMeters: 400,
    capacityTEU: '20,388 TEU',
    speedKnots: 18.5,
    headingDeg: 285,
    originPort: 'Shanghai, China',
    destinationPort: 'Rotterdam, Netherlands',
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
    name: 'Maersk Triple-E (Mc-Kinney)',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇩🇰',
    flagName: 'Denmark',
    lengthMeters: 399,
    capacityTEU: '18,270 TEU',
    speedKnots: 19.2,
    headingDeg: 105,
    originPort: 'Rotterdam, Netherlands',
    destinationPort: 'Singapore',
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
    name: 'MSC Irina Titan',
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇱🇷',
    flagName: 'Liberia',
    lengthMeters: 400,
    capacityTEU: '24,346 TEU',
    speedKnots: 20.1,
    headingDeg: 78,
    originPort: 'Shenzhen, China',
    destinationPort: 'Los Angeles, USA',
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
    vesselType: 'VLCC Oil Supertanker',
    flagEmoji: '🇸🇦',
    flagName: 'Saudi Arabia',
    lengthMeters: 333,
    capacityTEU: '2,100,000 Barrels Crude',
    speedKnots: 14.8,
    headingDeg: 140,
    originPort: 'Ras Tanura, Saudi Arabia',
    destinationPort: 'Yokohama, Japan',
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
    vesselType: 'LNG Carrier',
    flagEmoji: '🇶🇦',
    flagName: 'Qatar',
    lengthMeters: 345,
    capacityTEU: '266,000 m³ LNG',
    speedKnots: 17.4,
    headingDeg: 270,
    originPort: 'Ras Laffan, Qatar',
    destinationPort: 'Isle of Grain, UK',
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
    vesselType: 'ULCV Container Ship',
    flagEmoji: '🇫🇷',
    flagName: 'France',
    lengthMeters: 396,
    capacityTEU: '16,020 TEU',
    speedKnots: 18.2,
    headingDeg: 230,
    originPort: 'Ningbo, China',
    destinationPort: 'Southampton, UK',
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
    vesselType: 'Dry Bulk Carrier',
    flagEmoji: '🇲🇭',
    flagName: 'Marshall Islands',
    lengthMeters: 290,
    capacityTEU: '175,000 DWT Grain',
    speedKnots: 13.5,
    headingDeg: 165,
    originPort: 'New Orleans, USA',
    destinationPort: 'Qingdao, China',
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
    name: 'Queen Mary 2',
    vesselType: 'Cruise Liner',
    flagEmoji: '🇬🇧',
    flagName: 'United Kingdom',
    lengthMeters: 345,
    capacityTEU: '2,695 Passengers',
    speedKnots: 24.0,
    headingDeg: 260,
    originPort: 'Southampton, UK',
    destinationPort: 'New York, USA',
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
    vesselType: 'Arctic Icebreaker',
    flagEmoji: '🇷🇺',
    flagName: 'Russia',
    lengthMeters: 160,
    capacityTEU: 'Nuclear 75,000 HP',
    speedKnots: 15.0,
    headingDeg: 80,
    originPort: 'Murmansk, Russia',
    destinationPort: 'Bering Strait',
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
