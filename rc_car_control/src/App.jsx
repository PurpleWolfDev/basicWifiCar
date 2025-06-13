
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

      const angle = data.angle.degree; 
      const distance = Math.min(data.distance, 100);
      const direction = getDirection(angle);
      const speed = (Math.round((distance/75)*80))
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
