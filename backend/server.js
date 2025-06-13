const WebSocket = require('ws');

const PORT = 8080;
let speed = 0;
const wss = new WebSocket.Server({ port: PORT });
let dirn = 'q';
console.log(`WebSocket server is running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.send('Welcome to the WebSocket server!');

  ws.on('message', (msg) => {
   
    try {
      const parsed = JSON.parse(msg);
      if (parsed.direction) {
       
        dirn = parsed.direction;
        speed = parsed.speed;
        console.log("Parsed from client:", parsed);  
  console.log("TURBO:", parsed.turbo);
       
        speed = parsed.turbo?speed*1.25:speed;
        
      }
    } catch (err) {
      console.log('Invalid JSON:', msg);
      ws.send("Error: Invalid JSON");
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});


function broadcast(message) {

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


setInterval(() => {

   broadcast(JSON.stringify({dirn : dirn, speed: speed}));
   console.log(speed);
}, 200);
