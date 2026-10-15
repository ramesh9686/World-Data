import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ContentFilterService } from './content-filter.service';

export interface AisVesselPosition {
  mmsi: number;
  shipName: string;
  latitude: number;
  longitude: number;
  speedKnots: number;
  courseDeg: number;
  headingDeg: number;
  navStatus?: string;
  timeUtc: string;
  rawType?: string;
  country?: string;
  countryFlag?: string;
  vesselIcon?: string;
  vesselTypeName?: string;
  vesselColor?: string;
  qcStatus?: 'VERIFIED_100%' | 'WARNING' | 'REJECTED';
  vesselFinderUrl?: string;
}

export interface AisQcStats {
  totalPackets: number;
  validPackets: number;
  uniqueVessels: number;
  nullIslandErrors: number;
  outOfBoundsErrors: number;
  invalidMmsiErrors: number;
  speedErrors: number;
  dataIntegrityPct: string;
}

// Maritime Identification Digits (MID) Lookup Table (ITU Standards)
const MID_LOOKUP: { [mid: string]: { country: string; flag: string } } = {
  '201': { country: 'Albania', flag: '🇦🇱' },
  '205': { country: 'Belgium', flag: '🇧🇪' },
  '211': { country: 'Germany', flag: '🇩🇪' },
  '224': { country: 'Spain', flag: '🇪🇸' },
  '226': { country: 'France', flag: '🇫🇷' },
  '232': { country: 'United Kingdom', flag: '🇬🇧' },
  '237': { country: 'Greece', flag: '🇬🇷' },
  '244': { country: 'Netherlands', flag: '🇳🇱' },
  '248': { country: 'Malta', flag: '🇲🇹' },
  '257': { country: 'Norway', flag: '🇳🇴' },
  '271': { country: 'Turkey', flag: '🇹🇷' },
  '311': { country: 'Bahamas', flag: '🇧🇸' },
  '316': { country: 'Canada', flag: '🇨🇦' },
  '351': { country: 'Panama', flag: '🇵🇦' },
  '366': { country: 'United States', flag: '🇺🇸' },
  '412': { country: 'China', flag: '🇨🇳' },
  '419': { country: 'India', flag: '🇮🇳' },
  '431': { country: 'Japan', flag: '🇯🇵' },
  '440': { country: 'Korea (South)', flag: '🇰🇷' },
  '470': { country: 'UAE', flag: '🇦🇪' },
  '503': { country: 'Australia', flag: '🇦🇺' },
  '538': { country: 'Marshall Islands', flag: '🇲🇭' },
  '563': { country: 'Singapore', flag: '🇸🇬' },
  '622': { country: 'Egypt', flag: '🇪🇬' },
  '636': { country: 'Liberia', flag: '🇱🇷' }
};

@Injectable({
  providedIn: 'root'
})
export class AisStreamService {
  private socket: WebSocket | null = null;
  private isConnectedSubject = new BehaviorSubject<boolean>(false);
  public isConnected$: Observable<boolean> = this.isConnectedSubject.asObservable();

  private vesselPositionSubject = new Subject<AisVesselPosition>();
  public vesselPosition$: Observable<AisVesselPosition> = this.vesselPositionSubject.asObservable();

  private pingCountSubject = new BehaviorSubject<number>(0);
  public pingCount$: Observable<number> = this.pingCountSubject.asObservable();

  private activeVesselMap = new Map<number, AisVesselPosition>();
  private activeVesselsSubject = new BehaviorSubject<AisVesselPosition[]>([]);
  public activeVessels$: Observable<AisVesselPosition[]> = this.activeVesselsSubject.asObservable();

  // QC Stats BehaviorSubject
  private qcStats: AisQcStats = {
    totalPackets: 0,
    validPackets: 0,
    uniqueVessels: 0,
    nullIslandErrors: 0,
    outOfBoundsErrors: 0,
    invalidMmsiErrors: 0,
    speedErrors: 0,
    dataIntegrityPct: '100.0%'
  };
  private qcStatsSubject = new BehaviorSubject<AisQcStats>(this.qcStats);
  public qcStats$: Observable<AisQcStats> = this.qcStatsSubject.asObservable();

  private currentApiKey: string = environment.aisStreamApiKey || '';
  private proxyWsUrl: string = 'ws://localhost:3001';
  private directWsUrl: string = 'wss://stream.aisstream.io/v0/stream';
  private pingCounter = 0;
  private pendingVessels: AisVesselPosition[] = [];

  constructor(private contentFilter: ContentFilterService) {
    this.startThrottledEmitter();
    this.connect();
    this.startDirectDigitrafficPolling();
  }

  /**
   * Directly poll Digitraffic Open AIS REST API from browser as zero-dependency fallback
   */
  private startDirectDigitrafficPolling(): void {
    if (typeof window !== 'undefined') {
      const fetchLive = async () => {
        try {
          const res = await fetch('https://meri.digitraffic.fi/api/ais/v1/locations', {
            headers: {
              'Digitraffic-User': 'WorldExplorerApp/1.0',
              'Accept': 'application/json'
            }
          });
          if (res.ok) {
            const data = await res.json();
            const features = data.features || (Array.isArray(data) ? data : []);
            let count = 0;
            features.forEach((feat: any) => {
              const props = feat.properties || {};
              const coords = feat.geometry?.coordinates || [];
              const mmsi = props.mmsi || feat.mmsi;
              const lng = coords[0];
              const lat = coords[1];

              if (!mmsi || lat === undefined || lng === undefined) return;
              if (lat === 0 && lng === 0) return;
              if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return;

              const vesselPacket = {
                MessageType: "PositionReport",
                MetaData: {
                  MMSI: mmsi,
                  MMSI_String: String(mmsi),
                  ShipName: `Vessel-${mmsi}`,
                  latitude: parseFloat(lat.toFixed(5)),
                  longitude: parseFloat(lng.toFixed(5)),
                  time_utc: props.timestampExternal ? new Date(props.timestampExternal).toISOString() : new Date().toISOString()
                },
                Message: {
                  PositionReport: {
                    UserID: mmsi,
                    Latitude: parseFloat(lat.toFixed(5)),
                    Longitude: parseFloat(lng.toFixed(5)),
                    Sog: parseFloat((props.sog || 0).toFixed(1)),
                    Cog: Math.round(props.cog || 0),
                    TrueHeading: Math.round(props.heading || props.cog || 0),
                    NavigationalStatus: props.navStat || 0
                  }
                }
              };

              this.processAisMessage(vesselPacket);
              count++;
            });

            if (count > 0) {
              this.isConnectedSubject.next(true);
            }
          }
        } catch (e) {
          console.warn('Direct Digitraffic fetch notice:', e);
        }
      };

      fetchLive();
      setInterval(fetchLive, 5000);
    }
  }

  public getApiKey(): string {
    return this.currentApiKey;
  }

  public setApiKey(key: string): void {
    if (key) {
      this.currentApiKey = key.trim();
      this.connect();
    }
  }

  /**
   * Seed Active Commercial Fleet with diverse vessel categories (Container, Tanker, Bulk, LNG, Fishing)
   */
  private seedActiveFleetHubs(): void {
    const hubs = [
      { name: 'Strait of Malacca & Singapore', lat: 1.25, lng: 103.82, count: 320 },
      { name: 'English Channel & Rotterdam', lat: 51.0, lng: 1.5, count: 320 },
      { name: 'Suez Canal & Red Sea Corridor', lat: 29.8, lng: 32.5, count: 280 },
      { name: 'Panama Canal & Caribbean Corridor', lat: 8.9, lng: -79.5, count: 250 },
      { name: 'US West Coast & Long Beach Port', lat: 33.7, lng: -118.2, count: 250 },
      { name: 'Persian Gulf & Hormuz Strait', lat: 26.5, lng: 56.2, count: 250 },
      { name: 'East Asia & Shanghai Megaport', lat: 31.2, lng: 121.5, count: 320 },
      { name: 'Strait of Gibraltar & Mediterranean', lat: 35.9, lng: -5.6, count: 250 },
      { name: 'Tokyo Bay & East Japan Coast', lat: 35.4, lng: 139.7, count: 220 },
      { name: 'North Sea & Hamburg Entrance', lat: 53.5, lng: 9.9, count: 220 },
      { name: 'US East Coast & New York Harbor', lat: 40.6, lng: -74.0, count: 220 },
      { name: 'Cape of Good Hope Trade Route', lat: -34.3, lng: 18.4, count: 200 }
    ];

    let mmsiId = 211000100;

    // Distinct Color-Coded Vessel Allocation (Cargo = Green, Tanker = Red, Cruise = Purple, Fishing = Yellow)
    const vesselTypes = [
      { icon: '🚢', name: 'ULCV Container & Cargo Carrier', color: '#10b981', flag: '🇸🇬', country: 'Singapore' },
      { icon: '🛢️', name: 'VLCC Crude Oil & Chemical Tanker', color: '#ef4444', flag: '🇵🇦', country: 'Panama' },
      { icon: '📦', name: 'Cape-Size Dry Bulk Carrier', color: '#38bdf8', flag: '🇲🇭', country: 'Marshall Islands' },
      { icon: '⚓', name: 'LNG Liquefied Gas Carrier', color: '#00f2fe', flag: '🇱🇷', country: 'Liberia' },
      { icon: '🚢', name: 'Post-Panamax Container Vessel', color: '#10b981', flag: '🇩🇪', country: 'Germany' },
      { icon: '🛢️', name: 'Product Oil Tanker', color: '#ef4444', flag: '🇳🇱', country: 'Netherlands' },
      { icon: '🎣', name: 'Deep Sea Commercial Fishing Trawler', color: '#eab308', flag: '🇳🇴', country: 'Norway' },
      { icon: '🛳️', name: 'Ocean Passenger Cruise Liner', color: '#a855f7', flag: '🇧🇸', country: 'Bahamas' }
    ];

    const prefixes = ['Maersk', 'MSC', 'COSCO', 'CMA CGM', 'Hapag-Lloyd', 'ONE', 'Evergreen', 'HMM', 'ZIM', 'Wan Hai'];
    const suffixes = ['Titan', 'Vanguard', 'Pioneer', 'Horizon', 'Globe', 'Century', 'Voyager', 'Star', 'Empress', 'Valiant'];

    hubs.forEach(hub => {
      for (let i = 0; i < hub.count; i++) {
        mmsiId++;
        const latOffset = (Math.random() - 0.5) * 3.5;
        const lngOffset = (Math.random() - 0.5) * 4.5;
        const vType = vesselTypes[i % vesselTypes.length];
        const prefix = prefixes[i % prefixes.length];
        const suffix = suffixes[i % suffixes.length];
        const shipName = `${prefix} ${suffix} ${i + 1}`;
        const speed = parseFloat((8 + Math.random() * 14).toFixed(1));
        const heading = Math.floor(Math.random() * 360);

        const vessel: AisVesselPosition = {
          mmsi: mmsiId,
          shipName: shipName,
          latitude: parseFloat((hub.lat + latOffset).toFixed(4)),
          longitude: parseFloat((hub.lng + lngOffset).toFixed(4)),
          speedKnots: speed,
          courseDeg: heading,
          headingDeg: heading,
          timeUtc: new Date().toISOString(),
          rawType: 'PositionReport',
          country: vType.country,
          countryFlag: vType.flag,
          vesselIcon: vType.icon,
          vesselTypeName: vType.name,
          vesselColor: vType.color,
          qcStatus: 'VERIFIED_100%',
          vesselFinderUrl: `https://www.vesselfinder.com/vessels?name=${mmsiId}`
        };

        this.activeVesselMap.set(mmsiId, vessel);
        this.pendingVessels.push(vessel);
      }
    });


    this.qcStats.uniqueVessels = this.activeVesselMap.size;
  }

  private startKinematicMotionEngine(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        let pingsThisTick = 0;
        this.activeVesselMap.forEach(vessel => {
          if (vessel.speedKnots > 0) {
            const headingRad = ((vessel.headingDeg || vessel.courseDeg || 0) * Math.PI) / 180;
            const distanceDeg = (vessel.speedKnots * 0.000015);
            vessel.latitude += distanceDeg * Math.cos(headingRad);
            vessel.longitude += distanceDeg * Math.sin(headingRad);

            if (vessel.longitude > 180) vessel.longitude -= 360;
            if (vessel.longitude < -180) vessel.longitude += 360;

            pingsThisTick++;
            this.pendingVessels.push(vessel);
          }
        });

        if (pingsThisTick > 0) {
          this.pingCounter += pingsThisTick;
          this.qcStats.totalPackets += pingsThisTick;
          this.qcStats.validPackets += pingsThisTick;
          this.updateQcStats();
        }
      }, 500);
    }
  }

  private startThrottledEmitter(): void {
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (this.pendingVessels.length > 0) {
          const batch = [...this.pendingVessels];
          this.pendingVessels = [];
          batch.forEach(vessel => {
            this.vesselPositionSubject.next(vessel);
          });
        }

        this.pingCountSubject.next(this.pingCounter);
        this.activeVesselsSubject.next(Array.from(this.activeVesselMap.values()));
        this.updateQcStats();
      }, 200);
    }
  }

  /**
   * Connect to BridgeView AIS WebSocket Proxy on localhost:3001 with direct fallback
   */
  public connect(): void {
    if (this.socket) {
      try { this.socket.close(); } catch (e) { }
      this.socket = null;
    }

    try {
      console.log('Connecting to BridgeView AIS WebSocket proxy:', this.proxyWsUrl);
      this.socket = new WebSocket(this.proxyWsUrl);

      this.socket.onopen = () => {
        console.log('✅ BridgeView AIS WebSocket proxy connected!');
        this.isConnectedSubject.next(true);

        const subscription = {
          BoundingBoxes: [
            [[48.0, -12.0], [60.0, 15.0]],
            [[28.0, -10.0], [45.0, 36.0]],
            [[-5.0, 95.0], [15.0, 115.0]],
            [[24.0, -98.0], [45.0, -65.0]],
            [[30.0, -125.0], [50.0, -115.0]]
          ],
          FilterMessageTypes: ["PositionReport", "ShipStaticData"]
        };
        this.socket?.send(JSON.stringify(subscription));
      };

      this.socket.onmessage = async (event: MessageEvent) => {
        try {
          let rawText = '';
          if (typeof event.data === 'string') {
            rawText = event.data;
          } else if (event.data instanceof Blob) {
            rawText = await event.data.text();
          } else if (event.data instanceof ArrayBuffer) {
            rawText = new TextDecoder().decode(event.data);
          } else {
            rawText = String(event.data);
          }

          const data = JSON.parse(rawText);
          if (!data.error && !data.Error) {
            this.processAisMessage(data);
          }
        } catch (err) {
          console.warn('Error parsing incoming AISStream packet:', err);
        }
      };

      this.socket.onerror = () => {
        console.log('Proxy unavailable, attempting direct AISStream connection...');
        this.connectDirect();
      };

      this.socket.onclose = () => {
        this.isConnectedSubject.next(false);
      };
    } catch (err) {
      console.error('BridgeView AIS proxy connection error:', err);
      this.connectDirect();
    }
  }

  private connectDirect(): void {
    try {
      this.socket = new WebSocket(this.directWsUrl);
      this.socket.onopen = () => {
        console.log('✅ Direct AISStream.io connection open');
        this.isConnectedSubject.next(true);
        const subMsg = {
          APIKey: this.currentApiKey,
          BoundingBoxes: [
            [[48.0, -12.0], [60.0, 15.0]],
            [[28.0, -10.0], [45.0, 36.0]]
          ],
          FilterMessageTypes: ["PositionReport", "ShipStaticData"]
        };
        this.socket?.send(JSON.stringify(subMsg));
      };
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(String(event.data));
          this.processAisMessage(data);
        } catch (e) { }
      };
    } catch (e) { }
  }

  private processAisMessage(msg: any): void {
    if (!msg) return;

    this.pingCounter++;
    this.qcStats.totalPackets++;

    const messageType = msg.MessageType;
    const meta = msg.MetaData || {};
    const messageObj = msg.Message || {};
    let posReport = messageObj.PositionReport || messageObj.StandardClassBPositionReport || messageObj.ExtendedClassBPositionReport;
    let staticData = messageObj.ShipStaticData;

    const mmsi = meta.MMSI || (posReport ? posReport.UserID : (staticData ? staticData.UserID : 0));

    let lat = meta.latitude ?? meta.Latitude ?? (posReport ? posReport.Latitude : undefined);
    let lng = meta.longitude ?? meta.Longitude ?? (posReport ? posReport.Longitude : undefined);
    let speed = posReport ? (posReport.Sog ?? 0) : 0;
    let course = posReport ? (posReport.Cog ?? 0) : 0;
    let heading = posReport ? (posReport.TrueHeading === 511 ? posReport.Cog : (posReport.TrueHeading ?? 0)) : 0;

    if (lat === undefined || lng === undefined) return;

    const mmsiStr = String(mmsi);
    if (!mmsi || mmsiStr.length !== 9 || /^(\d)\1+$/.test(mmsiStr)) return;
    if (lat === 0 && lng === 0) return;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
    if (speed > 50) return;

    this.qcStats.validPackets++;

    const mid = mmsiStr.substring(0, 3);
    const midInfo = MID_LOOKUP[mid] || { country: 'International', flag: '🌐' };

    const rawShipName = meta.ShipName || meta.ship_name || (staticData ? staticData.Name : '');
    const existingVessel = this.activeVesselMap.get(mmsi);
    let resolvedShipName = (rawShipName && rawShipName.trim().length > 0)
      ? rawShipName.trim()
      : (existingVessel ? existingVessel.shipName : `Vessel-${mmsi}`);
    resolvedShipName = this.contentFilter.sanitize(resolvedShipName);

    const shipTypeCode = staticData ? staticData.Type : undefined;
    const logoInfo = this.resolveVesselLogo(resolvedShipName, shipTypeCode);

    const pos: AisVesselPosition = {
      mmsi: mmsi,
      shipName: resolvedShipName,
      latitude: parseFloat(lat.toFixed(5)),
      longitude: parseFloat(lng.toFixed(5)),
      speedKnots: parseFloat(speed.toFixed(1)),
      courseDeg: Math.round(course),
      headingDeg: Math.round(heading),
      timeUtc: meta.time_utc || new Date().toISOString(),
      rawType: messageType,
      country: midInfo.country,
      countryFlag: midInfo.flag,
      vesselIcon: logoInfo.icon,
      vesselTypeName: logoInfo.typeName,
      vesselColor: logoInfo.color,
      qcStatus: 'VERIFIED_100%',
      vesselFinderUrl: `https://www.vesselfinder.com/vessels?name=${mmsi}`
    };

    this.activeVesselMap.set(mmsi, pos);
    this.pendingVessels.push(pos);
    this.qcStats.uniqueVessels = this.activeVesselMap.size;
  }

  /**
   * Resolve vessel category, icon, and color using AIS Type codes + ship name rules
   */
  private resolveVesselLogo(shipName: string, aisTypeCode?: number): { icon: string; typeName: string; color: string } {
    // 1. Check AIS Type Code (ITU Standard 1-99)
    if (aisTypeCode !== undefined && aisTypeCode > 0) {
      if (aisTypeCode >= 70 && aisTypeCode <= 79) {
        return { icon: '🚢', typeName: 'ULCV Container & Cargo', color: '#10b981' }; // Neon Green
      }
      if (aisTypeCode >= 80 && aisTypeCode <= 89) {
        return { icon: '🛢️', typeName: 'VLCC Crude & Chemical Tanker', color: '#ef4444' }; // Red
      }
      if (aisTypeCode >= 60 && aisTypeCode <= 69) {
        return { icon: '🛳️', typeName: 'Passenger Cruise Ship', color: '#a855f7' }; // Purple
      }
      if (aisTypeCode === 30) {
        return { icon: '🎣', typeName: 'Commercial Fishing Vessel', color: '#eab308' }; // Yellow
      }
      if (aisTypeCode >= 50 && aisTypeCode <= 59) {
        return { icon: '🚤', typeName: 'Tug & Service Vessel', color: '#f97316' }; // Orange
      }
    }

    // 2. Fallback to Ship Name pattern matching
    const name = (shipName || '').toLowerCase();
    if (name.includes('tanker') || name.includes('oil') || name.includes('gas') || name.includes('lng') || name.includes('chem')) {
      return { icon: '🛢️', typeName: 'VLCC Crude & Chemical Tanker', color: '#ef4444' };
    }
    if (name.includes('bulk') || name.includes('ore') || name.includes('miner')) {
      return { icon: '📦', typeName: 'Cape-Size Bulk Carrier', color: '#38bdf8' };
    }
    if (name.includes('tug') || name.includes('pilot') || name.includes('push') || name.includes('tow')) {
      return { icon: '🚤', typeName: 'Tug & Service Vessel', color: '#f97316' };
    }
    if (name.includes('ferry') || name.includes('cruise') || name.includes('passenger')) {
      return { icon: '🛳️', typeName: 'Passenger Cruise Ship', color: '#a855f7' };
    }
    if (name.includes('fish') || name.includes('trawler')) {
      return { icon: '🎣', typeName: 'Commercial Fishing Vessel', color: '#eab308' };
    }

    // Default to Cargo Fleet Carrier
    return { icon: '🚢', typeName: 'ULCV Container & Cargo', color: '#10b981' };
  }

  private updateQcStats(): void {
    const total = this.qcStats.totalPackets || 1;
    const pct = ((this.qcStats.validPackets / total) * 100).toFixed(1) + '%';
    this.qcStats.dataIntegrityPct = pct;
    this.qcStatsSubject.next({ ...this.qcStats });
  }

  public disconnect(): void {
    if (this.socket) {
      try { this.socket.close(); } catch (e) { }
      this.socket = null;
    }
    this.isConnectedSubject.next(false);
  }

  public getActiveVessels(): AisVesselPosition[] {
    return Array.from(this.activeVesselMap.values());
  }

  public clearVessels(): void {
    this.activeVesselMap.clear();
    this.pendingVessels = [];
    this.activeVesselsSubject.next([]);
    this.qcStats = {
      totalPackets: 0,
      validPackets: 0,
      uniqueVessels: 0,
      nullIslandErrors: 0,
      outOfBoundsErrors: 0,
      invalidMmsiErrors: 0,
      speedErrors: 0,
      dataIntegrityPct: '100.0%'
    };
    this.qcStatsSubject.next(this.qcStats);
  }
}
