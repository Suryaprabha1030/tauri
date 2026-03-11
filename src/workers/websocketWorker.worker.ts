import config from "@/lib/config";

const MAX_RETRIES = 15;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 30000;
let websocket: WebSocket | null = null;
let reconnectAttempts = 0;
let url = `${config.websocketBaseUrl}`;
let pingInterval: any;
let isConnected = false;
let lastPingTime: number | null = null;
let pongTimeout: any;
const channelToSubscription = new Map<string, any>();

// Function to initialize WebSocket
const createWebSocket = (token: any) => {
  if (!url || !token) return;
  // Close existing WebSocket connection if it exists
  if (websocket) {
    websocket.onclose = null; // Prevent triggering reconnect logic
    websocket.close();
  }
  clearInterval(pingInterval);
  clearTimeout(pongTimeout);
  isConnected = false;

  const wsUrl = `${url}?token=${token}`;
  websocket = new WebSocket(wsUrl);

  websocket.onopen = () => {
    isConnected = true;
    reconnectAttempts = 0;
    postMessage({ type: "connected" });
    lastPingTime = Date.now();
    pingInterval = setInterval(() => {
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({ type: "ping" }));
        lastPingTime = Date.now();

        // Set a timeout to check for pong response
        pongTimeout = setTimeout(() => {
          if (Date.now() - lastPingTime! > 35000) {
            attemptReconnect(token);
          }
        }, 35000);
      }
    }, 30000);

    // Resubscribe to previous subscriptions
    channelToSubscription.forEach((_, identifier) => {
      websocket?.send(
        JSON.stringify({ action: "subscribe", identifiers: identifier })
      );
    });
  };

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "pong") {
      clearTimeout(pongTimeout);
      lastPingTime = Date.now();
      return;
    }

    if (data.type === "order_updates") {
      postMessage({
        type: "show-toast",
        payload: {
          title: `${data.data["status"]}`,
          message: `${data.data["transaction_type"]} ${data.data["symbol"]} of Qty: ${data.data["quantity"]} is ${data.data["status"]}`,
          details: `# ${data.data["order_id"]}`,
          client_code: `${data.data["client_code"]}`,
        },
        id: `${data.data["symbol"]}`,
      });
      return;
    }

    postMessage({ type: "data", payload: data });
  };

  websocket.onerror = () => postMessage({ type: "error" });

  websocket.onclose = () => {
    isConnected = false;
    postMessage({ type: "disconnected" });
    attemptReconnect(token);
  };
};

// Exponential backoff reconnection
const attemptReconnect = (token: any) => {
  if (reconnectAttempts < MAX_RETRIES) {
    const delay = Math.min(INITIAL_DELAY * 2 ** reconnectAttempts, MAX_DELAY);
    setTimeout(() => createWebSocket(token), delay);
    reconnectAttempts++;
  }
};

// Handle messages from main thread
self.onmessage = (event) => {
  const { type, payload } = event.data;
  switch (type) {
    case "connect":
      url = payload.url;
      let jwt = payload.jwt;
      createWebSocket(jwt);
      break;

    case "subscribe":
      const { identifier, resolution, lastDailyBar, callbackId } = payload;

      const handler = {
        id: callbackId,
        callback: (bar: any) =>
          postMessage({ type: "barUpdate", payload: { identifier, bar } }),
      };

      let subscriptionItem = channelToSubscription.get(identifier);
      if (!subscriptionItem) {
        subscriptionItem = { resolution, lastDailyBar, handlers: [handler] };
        channelToSubscription.set(identifier, subscriptionItem);
        const identifiers = Array.isArray(identifier)
          ? identifier
          : [identifier];
        websocket?.send(
          JSON.stringify({ action: "subscribe", identifiers: identifiers })
        );
      } else {
        subscriptionItem.handlers.push(handler);
      }
      break;

    case "unsubscribe":
      const { callbackId: unsubCallbackId } = payload;
      channelToSubscription.forEach((subscriptionItem, identifier) => {
        const index = subscriptionItem.handlers.findIndex(
          (h: any) => h.id === unsubCallbackId
        );
        if (index !== -1) {
          subscriptionItem.handlers.splice(index, 1);
          if (subscriptionItem.handlers.length === 0) {
            channelToSubscription.delete(identifier);
            websocket?.send(
              JSON.stringify({
                action: "unsubscribe",
                identifiers: [identifier],
              })
            );
          }
        }
      });
      break;

    case "disconnect":
      websocket?.close();
      break;
  }
};
