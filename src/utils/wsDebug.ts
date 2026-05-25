/**
 * WebSocket Debug Utility
 * Run in console: checkWebSocketStatus()
 */

export function checkWebSocketStatus(): void {
  const status = window.__SUPER777_WS_STATUS__;
  const echo = window.__SUPER777_ECHO__;

  console.log("=== SUPER777 WebSocket Status ===");
  console.log("Status Object:", status);
  console.log("Echo Instance:", echo);

  if (status) {
    console.log(`Connected: ${status.connected}`);
    console.log(`URL: ${status.url}`);
    if (status.error) {
      console.error(`Error: ${status.error}`);
    }
  }

  // Check if Pusher is available
  console.log("Pusher Available:", typeof window.Pusher !== "undefined");

  // Try to get the underlying connection object
  if (echo && "connection" in echo) {
    const connection = (echo as any).connection;
    console.log("Connection Object:", connection);

    if (connection) {
      console.log("Connection State:", (connection as any).state);
      console.log("Connection Socket:", (connection as any).socket);
    }
  }
}

export function getWebSocketURL(): string {
  return window.__SUPER777_WS_STATUS__?.url || "Not configured";
}

export function isWebSocketConnected(): boolean {
  return window.__SUPER777_WS_STATUS__?.connected ?? false;
}

// Expose globally for console access
if (typeof window !== "undefined") {
  (window as any).checkWebSocketStatus = checkWebSocketStatus;
  (window as any).getWebSocketURL = getWebSocketURL;
  (window as any).isWebSocketConnected = isWebSocketConnected;
}
