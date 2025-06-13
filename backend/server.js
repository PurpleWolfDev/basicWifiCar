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
    // console.log('Received from client:', msg);
    try {
      const parsed = JSON.parse(msg);
      if (parsed.direction) {
        // console.log("YESS")
        // Echo back the direction to this client
        // ws.send(parsed.direction);
        dirn = parsed.direction;
        speed = parsed.speed;
        console.log("Parsed from client:", parsed);  // ADD THIS
  console.log("TURBO:", parsed.turbo);
        // console.log(parsed)
        speed = parsed.turbo?speed*1.25:speed;
        // console.log(speed)
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

// Broadcast to ALL clients
function broadcast(message) {
  // console.log(wss.clients);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Example: send something every 5 seconds
// setInterval(() => {
//   if (dirn !== lastSent) {
//     if(speed!==lastSpeed) {
//       broadcast(JSON.stringify({dirn : dirn, speed: speed}));
//       lastSent = dirn;
//       speed = speed==80?speed:speed+10;
//     }
//     else {
//       broadcast(JSON.stringify({dirn : dirn, speed: speed}));
//       lastSent = dirn;
//       speed = speed==80?speed:speed+10;
//     }
//   }
//   else {
//     speed = speed==0?speed:speed-10;
//   }
// }, 200);

setInterval(() => {
  // if(dirn == 'w' || dirn=='a' || dirn=='d' || dirn=='m' || dirn == 'n') {console.log("speed increased");speed = speed==80?speed:speed+10;}
  // else if(dirn == 's' || dirn=='o' ||dirn == 'p') {console.log("speed decreased");speed = speed == -80?speed:speed-10;}
  // else {
  //   speed = speed==0?speed:Math.abs(speed)-10;
  // }
   broadcast(JSON.stringify({dirn : dirn, speed: speed}));
   console.log(speed);
}, 200);
