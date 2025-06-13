// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';

// const RCController = () => {

//    const [isConnected, setIsConnected] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [laser, laserConfig] = useState(false);
//   const [auto, autoConfig] = useState(false);
//   const [speed, speedConfig] = useState(false);
//   const [camera, cameraConfig] = useState(false);
//   const ws = useRef(null);

//   useEffect(() => {
//     // Connect to the ESP8266 or Node.js WebSocket server
//     ws.current = new WebSocket('ws://192.168.198.210:8080'); // use your IP & port

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//       setIsConnected(true);
//     };

//     ws.current.onmessage = (event) => {
//       console.log('Message from server:', event.data);
//       setMessages(prev => [...prev, event.data]);
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket disconnected');
//       setIsConnected(false);
//     };

//     return () => {
//       ws.current.close();
//     };
//   }, []);

//   const sendCommand = (command) => {
//     if (ws.current && isConnected) {
//       ws.current.send(command);
//     }
//   };

//   const [powerOn, setPowerOn] = useState(true);
//   const [turbo, setTurbo] = useState(false);
//   const [activeMovement, setActiveMovement] = useState(null);
//   const movementInterval = useRef(null);

//   // Handle button press (start movement)
//   const handleMovementStart = (direction) => {
//     // console.log(direction)
    
//     setActiveMovement(direction);
//     // Immediate first movement
//     sendMovementCommand(direction);
    
//     // Set up repeating movement while button is held
//     movementInterval.current = setInterval(() => {
//       sendMovementCommand(direction);
//     }, 100); // Send command every 100ms while held
//   };

//   // Handle button release (stop movement)
//   const handleMovementEnd = () => {
//     if (movementInterval.current) {
//       clearInterval(movementInterval.current);
//       movementInterval.current = null;
//     }
//     if (activeMovement) {
//       sendMovementCommand('stop');
//       setActiveMovement(null);
//     }
//   };

//   // Clean up intervals on unmount
//   useEffect(() => {
//     return () => {
//       if (movementInterval.current) {
//         clearInterval(movementInterval.current);
//       }
//       const handleContextmenu = e => {
//               e.preventDefault()
//           }
//           document.addEventListener('contextmenu', handleContextmenu)
//           return function cleanup() {
//               document.removeEventListener('contextmenu', handleContextmenu)
//           }
//     };
//   }, []);
  

//   // Simulate sending command to RC car
//   const sendMovementCommand = (direction) => {
//     // console.log(`Sending command: ${direction} ${turbo ? '(TURBO)' : ''}`);
//     // console.log(`Sending command: ${direction} ${turbo ? '(TURBO)' : ''}`);
//     if (ws.current && isConnected) {
//       const command = turbo ? `${direction}_turbo` : `control_${direction}`;
//       console.log(command);
//       if(direction=="forward") {
//         ws.current.send(JSON.stringify({direction:'w'}));
//       }
//       if(direction=="backward") {
//         ws.current.send(JSON.stringify({direction:'s'}));
//       }
//       if(direction=="right") {
//         ws.current.send(JSON.stringify({direction:'d'}));
//       }
//       if(direction=="left") {
//         ws.current.send(JSON.stringify({direction:'a'}));
//       }
//       if(direction=="stop") {
//         ws.current.send(JSON.stringify({direction:'q'}));
//       }
//       // ws.current.send(JSON.stringify({turbo:turbo, dirn:direction, auto: auto, camera:camera, laser:laser}));
//   }
//   };

//   return (
//     <div className="controller-container">
//       {/* Top Bar - same as before */}
//       <div className="top-bar">
//         <div className="power-status">
//           <div className={`status-light ${powerOn ? 'on' : 'off'}`}></div>
//           <span>{powerOn ? 'CONNECTED' : 'OFFLINE'}</span>
//         </div>
//         <div className="camera-feed">
//           {powerOn ? 'LIVE FEED' : 'NO SIGNAL'}
//         </div>
//         <div className="laser-toggle">
//           <button 
//             className={`laser-btn ${laser ? 'active' : ''}`}
//             onClick={() => setLaser(!laser)}
//             disabled={!powerOn}
//           >
//             LASER {laser ? 'ON' : 'OFF'}
//           </button>
//         </div>
//       </div>

//       {/* Main Content - enhanced movement controls */}
//       <div className="main-content">
//         <div className="turbo-section">
//           <button
//             className={`turbo-btn ${turbo ? 'active' : ''}`}
//             onClick={() => setTurbo(!turbo)}
//             disabled={!powerOn}
//           >
//             TURBO MODE
//           </button>
//         </div>

//         <div className="control-buttons">
//           <div className="control-row">
//             <button 
//               className={`control-btn ${activeMovement === 'forward' ? 'active' : ''}`}
//               onTouchStart={() => handleMovementStart('forward')}
//               onMouseDown={() => handleMovementStart('forward')}
//               onTouchEnd={handleMovementEnd}
//               style={{'display':'flex', alignItems:'centre', justifyContent:'center'}}
//               onMouseUp={handleMovementEnd}
//               onMouseLeave={handleMovementEnd}
//               disabled={!powerOn}
//             >
//               ▲
//             </button>
//           </div>
//           <div className="control-row">
//             <button 
//               className={`control-btn ${activeMovement === 'left' ? 'active' : ''}`}
//               onTouchStart={() => handleMovementStart('left')}
//               onMouseDown={() => handleMovementStart('left')}
//               style={{'display':'flex', alignItems:'centre', justifyContent:'center'}}
//               onTouchEnd={handleMovementEnd}
//               onMouseUp={handleMovementEnd}
//               onMouseLeave={handleMovementEnd}
//               disabled={!powerOn}
//             >
//               ◀️
//             </button>
//             <button 
//               className={`control-btn ${activeMovement === 'backward' ? 'active' : ''}`}
//               onTouchStart={() => handleMovementStart('backward')}
//               onMouseDown={() => handleMovementStart('backward')}
//               onTouchEnd={handleMovementEnd}
//               style={{'display':'flex', alignItems:'centre', justifyContent:'center'}}
//               onMouseUp={handleMovementEnd}
//               onMouseLeave={handleMovementEnd}
//               disabled={!powerOn}
//             >
//               ▼
//             </button>
//             <button 
//               className={`control-btn ${activeMovement === 'right' ? 'active' : ''}`}
//               onTouchStart={() => handleMovementStart('right')}
//               onMouseDown={() => handleMovementStart('right')}
//               style={{'display':'flex', alignItems:'centre', justifyContent:'center'}}
//               onTouchEnd={handleMovementEnd}
//               onMouseUp={handleMovementEnd}
//               onMouseLeave={handleMovementEnd}
//               disabled={!powerOn}
//             >
//               ▶️
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="bottom-bar">
//         {/* <button 
//           className={`power-btn ${powerOn ? 'on' : 'off'}`}
//           onClick={() => setPowerOn(!powerOn)}
//         >
//           POWER {powerOn ? 'ON' : 'OFF'}
//         </button> */}
//       </div>
//     </div>
//   );
// };

// export default RCController;

import React, { useEffect, useRef, useState } from 'react';
import nipplejs from 'nipplejs';
import './App.css';

const RCController = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [laser, setLaser] = useState(false);
  const [turbo, updateTurbo] = useState(false);
const turboRef = useRef(turbo);  const [powerOn, setPowerOn] = useState(true);
  const ws = useRef(null);
  const joystickRef = useRef(null);
  const [spd, updateSpd] = useState(0);
  const lastDirection = useRef(null);
useEffect(() => {
  turboRef.current = turbo;
}, [turbo]);
  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.55.210:8080');
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessages(prev => [...prev, event.data]);
    };
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.current?.close();
    };
  }, []);
const toggleTurbo = () => {

  turboRef.current = !turbo;
  updateTurbo(turboRef.current);
};
  // Joystick setup
  useEffect(() => {const handleContextmenu = e => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }},[])
  useEffect(() => {
    
    if (!joystickRef.current) return;

    const joystick = nipplejs.create({
      zone: joystickRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'blue',
      size: 150
    });

    joystick.on('move', (evt, data) => {
      if (!data || !data.angle || !data.distance) return;

      const angle = data.angle.degree; // 0 - 360
      const distance = Math.min(data.distance, 100); // Cap at 100 for speed scaling
      const direction = getDirection(angle);
      const speed = (Math.round((distance/75)*80))// Scale 0-100
      console.log(speed)
      updateSpd(speed);
        sendJoystickCommand(direction, speed);
        lastDirection.current = direction;
    });
    
    joystick.on('end', () => {
      sendJoystickCommand('stop', 0);
      lastDirection.current = null;
    });

    return () => {
      joystick.destroy();
    };
  }, [isConnected]);
// console.log(turbo)
  const sendJoystickCommand = (direction, speed) => {
    if (!isConnected || !ws.current) return;

    let dirKey;
    switch (direction) {
      case 'forward': dirKey = 'w'; break;
      case 'backward': dirKey = 's'; break;
      case 'left': dirKey = 'a'; break;
      case 'right': dirKey = 'd'; break;
      case 'forward-right': dirKey = 'm'; break;
      case 'forward-left': dirKey = 'n'; break;
      case 'backward-right': dirKey = 'o'; break;
      case 'backward-left': dirKey = 'p'; break;
      default: dirKey = 'q';
    }
    // console.log(turbo);
    console.log("Sending:", {
  direction: dirKey,
  speed: speed,
  turbo: turbo
});
    ws.current.send(JSON.stringify({
      direction: dirKey,
      speed: speed,
      turbo : turboRef.current
    }));
  };

  const getDirection = (anglee) => {
    // let angle = (anglee - 90 + 360) % 360;
const angle = (450 - anglee) % 360;
    console.log(angle)
    if (angle >= 337.5 || angle < 22.5) return 'forward';
    if (angle >= 22.5 && angle < 67.5) return 'forward-right';
    if (angle >= 67.5 && angle < 112.5) return 'right';
    if (angle >= 112.5 && angle < 157.5) return 'backward-right';
    if (angle >= 157.5 && angle < 202.5) return 'backward';
    if (angle >= 202.5 && angle < 247.5) return 'backward-left';
    if (angle >= 247.5 && angle < 292.5) return 'left';
    if (angle >= 292.5 && angle < 337.5) return 'forward-left';
  };

  return (
    <div className="controller-container">
      <div className="top-bar">
        <div className="power-status">
          <div className={`status-light ${powerOn ? 'on' : 'off'}`}></div>
          <span>{powerOn ? 'CONNECTED' : 'OFFLINE'}</span>
        </div>
        <div className="camera-feed">
          {powerOn ? 'LIVE FEED' : 'NO SIGNAL'}
        </div>
        <div className="laser-toggle">
          <button
            className={`laser-btn ${laser ? 'active' : ''}`}
            onClick={() => setLaser(!laser)}
            disabled={!powerOn}
          >
            LASER {laser ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="turbo-section">
          <button
            className={`turbo-btn ${turbo ? 'active' : ''}`}
  onClick={() => {toggleTurbo();}}
  disabled={!powerOn}
          >
            TURBO MODE
          </button>
        </div>

        <div className="joystick-area" ref={joystickRef} style={{ width: '200px', height: '200px', margin: 'auto' }}></div>
      </div>
    </div>
  );
};

export default RCController;
