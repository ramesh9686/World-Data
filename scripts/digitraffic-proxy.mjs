import { WebSocketServer, WebSocket } from 'ws';
import https from 'https';
import zlib from 'zlib';

const PORT = 3001;
const POLL_INTERVAL_MS = 5000;

console.log('=====================================================');
console.log('🚀 [Digitraffic Real-Time Live AIS Proxy] Initializing...');
console.log(`🌐 Proxy WebSocket Server Port: ws://localhost:${PORT}`);
console.log('=====================================================');

const wss = new WebSocketServer({ port: PORT });
const connectedClients = new Set();
const vesselCache = new Map();
const vesselMetaMap = new Map();

// Fetch Vessel Metadata (Ship names, types, callsigns)
function fetchVesselMetadata() {
  const options = {
    hostname: 'meri.digitraffic.fi',
    path: '/api/ais/v1/vessels',
    headers: {
      'Digitraffic-User': 'WorldExplorerApp/1.0',
      'Accept-Encoding': 'gzip, deflate',
      'Accept': 'application/json'
    }
  };

  https.get(options, (res) => {
    if (res.statusCode !== 200) return;
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const buffer = Buffer.concat(chunks);
      zlib.gunzip(buffer, (err, decompressed) => {
        const text = err ? buffer.toString() : decompressed.toString();
        try {
          const list = JSON.parse(text);
          if (Array.isArray(list)) {
            list.forEach(v => {
              if (v.mmsi) {
                vesselMetaMap.set(v.mmsi, v);
              }
            });
            console.log(`📋 Fetched metadata for ${vesselMetaMap.size} ships from Digitraffic.`);
          }
        } catch (e) {}
      });
    });
  }).on('error', () => {});
}

// Fetch Real Live Ship Positions
function fetchLivePositions() {
  const options = {
    hostname: 'meri.digitraffic.fi',
    path: '/api/ais/v1/locations',
    headers: {
      'Digitraffic-User': 'WorldExplorerApp/1.0',
      'Accept-Encoding': 'gzip, deflate',
      'Accept': 'application/json'
    }
  };

  https.get(options, (res) => {
    if (res.statusCode !== 200) return;
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      const buffer = Buffer.concat(chunks);
      zlib.gunzip(buffer, (err, decompressed) => {
        const text = err ? buffer.toString() : decompressed.toString();
        try {
          const json = JSON.parse(text);
          const features = json.features || (Array.isArray(json) ? json : []);
          let newPings = 0;

          features.forEach(feat => {
            const props = feat.properties || {};
            const coords = feat.geometry?.coordinates || [];
            const mmsi = props.mmsi || feat.mmsi;
            const lng = coords[0];
            const lat = coords[1];

            if (!mmsi || lat === undefined || lng === undefined) return;

            const meta = vesselMetaMap.get(mmsi) || {};
            const shipName = meta.name ? meta.name.trim() : `Vessel-${mmsi}`;
            const shipType = meta.shipType || 70;

            const aisPacket = {
              MessageType: "PositionReport",
              MetaData: {
                MMSI: mmsi,
                MMSI_String: String(mmsi),
                ShipName: shipName,
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
                },
                ShipStaticData: {
                  UserID: mmsi,
                  Name: shipName,
                  Type: shipType
                }
              }
            };

            vesselCache.set(mmsi, aisPacket);
            newPings++;

            // Broadcast real live packet to all connected browser clients
            const msgStr = JSON.stringify(aisPacket);
            for (const client of connectedClients) {
              if (client.readyState === WebSocket.OPEN) {
                client.send(msgStr);
              }
            }
          });

          console.log(`📡 Streamed ${newPings} REAL LIVE vessel positions. Active tracked fleet: ${vesselCache.size} ships.`);
        } catch (e) {}
      });
    });
  }).on('error', (err) => {
    console.error('Error fetching live positions:', err.message);
  });
}

// Handle Browser WebSocket connections
wss.on('connection', (clientSocket, req) => {
  connectedClients.add(clientSocket);
  console.log(`✅ Web client connected from ${req.socket.remoteAddress}. Active clients: ${connectedClients.size}`);

  // Flush all cached real live ships immediately to client
  if (vesselCache.size > 0) {
    console.log(`⚡ Flushing ${vesselCache.size} REAL LIVE ships to browser client...`);
    vesselCache.forEach((packet) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify(packet));
      }
    });
  }

  clientSocket.on('close', () => {
    connectedClients.delete(clientSocket);
    console.log(`🔒 Client disconnected. Remaining clients: ${connectedClients.size}`);
  });
});

// Initial metadata & position fetch
fetchVesselMetadata();
setTimeout(fetchLivePositions, 1000);

// Poll live positions every 5 seconds & refresh metadata every 10 minutes
setInterval(fetchLivePositions, POLL_INTERVAL_MS);
setInterval(fetchVesselMetadata, 600000);
