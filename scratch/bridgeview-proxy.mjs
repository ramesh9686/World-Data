import http from 'http';
import crypto from 'crypto';

const API_KEY = process.env.AISSTREAM_API_KEY || '';
const UPSTREAM_URL = 'wss://stream.aisstream.io/v0/stream';
const PORT = 3001;

console.log(`[BridgeView AIS Proxy] Initializing server on ws://localhost:${PORT}...`);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', proxy: 'BridgeView AIS Proxy' }));
});

server.on('upgrade', (req, socket, head) => {
  const key = req.headers['sec-websocket-key'];
  const acceptKey = crypto.createHash('sha1').update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');

  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\n' +
    'Connection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${acceptKey}\r\n\r\n`
  );

  console.log('✅ Client connected to BridgeView AIS local proxy ws://localhost:3001!');

  const upstream = new WebSocket(UPSTREAM_URL);

  upstream.onopen = () => {
    console.log('✅ Connected to AISStream.io upstream! Sending subscription...');
    const subscription = {
      Apikey: API_KEY,
      BoundingBoxes: [
        [[48.0, -12.0], [60.0, 15.0]],    // English Channel
        [[28.0, -10.0], [45.0, 36.0]],    // Mediterranean
        [[-5.0, 95.0], [15.0, 115.0]],    // Malacca & Singapore
        [[24.0, -98.0], [45.0, -65.0]],   // US East Coast
        [[30.0, -125.0], [50.0, -115.0]]  // US West Coast
      ],
      FilterMessageTypes: ["PositionReport", "ShipStaticData"]
    };
    upstream.send(JSON.stringify(subscription));
  };

  upstream.onmessage = (event) => {
    if (socket.writable) {
      const dataStr = typeof event.data === 'string' ? event.data : event.data.toString();
      const payload = Buffer.from(dataStr, 'utf8');
      const length = payload.length;

      let header;
      if (length <= 125) {
        header = Buffer.from([0x81, length]);
      } else if (length <= 65535) {
        header = Buffer.alloc(4);
        header[0] = 0x81;
        header[1] = 126;
        header.writeUInt16BE(length, 2);
      } else {
        header = Buffer.alloc(10);
        header[0] = 0x81;
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(length), 2);
      }

      socket.write(Buffer.concat([header, payload]));
    }
  };

  upstream.onerror = (err) => {
    console.error('❌ Upstream error:', err);
  };

  upstream.onclose = () => {
    console.log('🔒 Upstream closed');
    socket.destroy();
  };

  socket.on('close', () => {
    console.log('🔒 Client disconnected');
    if (upstream.readyState === 1) upstream.close();
  });
});

server.listen(PORT, () => {
  console.log(`🚀 [BridgeView AIS Proxy Active] Listening on ws://localhost:${PORT}`);
});
