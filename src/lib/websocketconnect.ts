// import WebSocket from "isomorphic-ws";

// let ws: WebSocket | null = null;

// const connect = (onMessage: (data: any) => void): void => {
//   ws = new WebSocket("ws://localhost:3000");

//   ws.onopen = () => {
//     console.log("Connected to WebSocket server");
//   };

//   ws.onmessage = (event: WebSocket.MessageEvent) => {
//     onMessage(event.data);
//   };

//   ws.onclose = () => {
//     console.log("Disconnected from WebSocket server");
//   };

//   ws.onerror = (error: WebSocket.ErrorEvent) => {
//     console.error("WebSocket error:", error.message);
//   };
// };

// export default connect;

// export const sendMessage = (message: string): void => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(message);
//   }
// };
