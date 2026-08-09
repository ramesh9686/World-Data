import { WebSocketServer, WebSocket } from 'ws';

const API_KEY = process.env.AISSTREAM_API_KEY || '4b8a931efb8b56555196a3102f730916479f77d9';
const UPSTREAM_URL = 'wss://stream.aisstream.io/v0/stream';
const PORT = 3001;

console.log('=====================================================');
console.log('🚀 [AISStream Single-Connection Proxy] Initializing...');
console.log(`🔑 Using API Key: ${API_KEY.substring(0, 8)}...`);
console.log(`🌐 Proxy WebSocket Server Port: ws://localhost:${PORT}`);
console.log('=====================================================');

const wss = new WebSocketServer({ port: PORT });
const connectedClients = new Set();
const vesselCache = new Map();

let upstreamSocket = null;
let upstreamConnected = false;
let reconnectTimer = null;
let packetCount = 0;

function connectUpstream() {
  if (upstreamSocket) {
    try { upstreamSocket.terminate(); } catch (e) {}
    upstreamSocket = null;
  }

  console.log('\n📡 Connecting single persistent connection to AISStream.io upstream...');
  upstreamSocket = new WebSocket(UPSTREAM_URL);

  upstreamSocket.on('open', () => {
    upstreamConnected = true;
    console.log('✅ Connected to AISStream.io upstream server successfully!');

    const subscriptionPayload = {
      APIKey: API_KEY,
      BoundingBoxes: [
        [[48.0, -12.0], [60.0, 15.0]],    // English Channel & North Sea
        [[28.0, -10.0], [45.0, 36.0]],    // Mediterranean & Gibraltar
        [[1.0, 100.0], [15.0, 115.0]],    // Malacca Strait & Singapore
        [[20.0, -98.0], [45.0, -60.0]],   // US East Coast & Caribbean
        [[30.0, -125.0], [50.0, -115.0]]  // US West Coast
      ],
      FilterMessageTypes: ["PositionReport", "ShipStaticData", "StandardClassBPositionReport"]
    };

    console.log('📤 Sending global subscription request to AISStream.io...');
    upstreamSocket.send(JSON.stringify(subscriptionPayload));
  });

  upstreamSocket.on('message', (data) => {
    packetCount++;
    const messageStr = data.toString();

    // Cache latest vessel state
    try {
      const parsed = JSON.parse(messageStr);
      if (parsed.MetaData && parsed.MetaData.MMSI) {
        vesselCache.set(parsed.MetaData.MMSI, parsed);
      }
    } catch (e) {}

    if (packetCount % 20 === 1) {
      console.log(`📦 Broadcasted ${packetCount} packets from AISStream. Total unique cached vessels: ${vesselCache.size}`);
    }

    // Broadcast to all connected browser clients
    for (const client of connectedClients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    }
  });

  upstreamSocket.on('error', (err) => {
    console.error('❌ AISStream upstream error:', err.message || err);
  });

  upstreamSocket.on('close', (code, reason) => {
    upstreamConnected = false;
    console.warn(`🔒 AISStream upstream connection closed (Code: ${code}, Reason: ${reason ? reason.toString() : 'None'}).`);
    console.log('🔄 Retrying upstream connection in 5 seconds...');
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connectUpstream, 5000);
  });
}

// Handle browser client connections
wss.on('connection', (clientSocket, req) => {
  connectedClients.add(clientSocket);
  console.log(`✅ Web browser client connected from ${req.socket.remoteAddress}. Active clients: ${connectedClients.size}`);

  // Send current cached vessels immediately to new client so map fills instantly
  if (vesselCache.size > 0) {
    console.log(`⚡ Flushing ${vesselCache.size} cached vessels to new client...`);
    vesselCache.forEach((vesselPacket) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(JSON.stringify(vesselPacket));
      }
    });
  }

  clientSocket.on('close', () => {
    connectedClients.delete(clientSocket);
    console.log(`🔒 Client disconnected. Remaining clients: ${connectedClients.size}`);
  });

  clientSocket.on('error', (err) => {
    console.error('Client socket error:', err.message || err);
  });
});

// Start single persistent upstream connection
connectUpstream();
