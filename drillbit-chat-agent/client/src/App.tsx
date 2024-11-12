import React, { createContext, useEffect, useState } from "react";
import DrillbitChat from "./DrillbitChat";
import { Login } from "./components/Login";
import { useTwitterAuth } from "./utils/TwitterAuth";
import { websocketEmitter } from './utils/WebsocketEventEmitter';

interface AppContextType {
  wsConnectionStatus: boolean;
  setWSConnectionStatus: (status: boolean) => void;
  twitterAuth: any;
}

export const AppContext = createContext<AppContextType>({
  wsConnectionStatus: false,
  setWSConnectionStatus: () => {},
  twitterAuth: {},
});

const getWebSocketUrl = () => {
  try {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    const host = location.host; // this includes hostname:port
    return `${protocol}://${host}/ws`;
  } catch (error) {
    console.error('Error creating WebSocket URL:', error);
    // Fallback to a default if something goes wrong
    return 'ws://localhost:8080/ws';
  }
};

const wsUrl = getWebSocketUrl();

const App: React.FC = () => {
  const [wsConnectionStatus, setWSConnectionStatus] = useState(false);
  const twitterAuth = useTwitterAuth();
  const { user } = twitterAuth || {};

  useEffect(() => {

    // Connect the WebSocket when the component mounts
    websocketEmitter.connect(wsUrl);

    // Listen for WebSocket open event
    websocketEmitter.on('open', () => {
      setWSConnectionStatus(true);
    });

    // Handle WebSocket close event
    websocketEmitter.on('close', () => {
      setWSConnectionStatus(false);
    });

    // Cleanup on unmount
    return () => {
      websocketEmitter.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{ twitterAuth, wsConnectionStatus, setWSConnectionStatus }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Coiny&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
        body {
          font-family: 'DM Sans', sans-serif;
          background-color: #f0f8ff;
          background-image: url('/beach-background.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .custom-tab {
          color: #6b7280; /* gray-500 */
          transition: all 0.3s ease;
        }
        .custom-tab[data-state="active"] {
          color: #f241cc; /* The bright pink color from the title */
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: bold;
          text-decoration: underline;
        }
        .custom-tab:hover {
          color: #f241cc;
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="App">{user ? <DrillbitChat /> : <Login />}</div>
    </AppContext.Provider>
  );
};

export default App;
