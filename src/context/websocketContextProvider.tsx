"use client";
import config from "@/lib/config";
import useWebSocket from "@/lib/websocket";
import { createContext, useContext, useState } from "react";

const WebSocketContext = createContext<any>(null); //context api

export const useWebSocketContext = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionStatus, setConnectionStatus] = useState(true);
  const websocketUrl = `${config.websocketBaseUrl}`;

  const websocketError = useWebSocket(websocketUrl, setConnectionStatus);

  return (
    <WebSocketContext.Provider value={{ connectionStatus }}>
      {children}
    </WebSocketContext.Provider>
  );
};
