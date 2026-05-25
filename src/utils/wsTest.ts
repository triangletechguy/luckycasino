/**
 * WebSocket Server Connectivity Test
 */

export async function testWebSocketServer(
  host: string,
  port: number,
  timeout: number = 5000
): Promise<{
  reachable: boolean;
  latency?: number;
  error?: string;
}> {
  const startTime = Date.now();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        reachable: false,
        error: `Connection timeout (${timeout}ms)`,
      });
    }, timeout);

    try {
      const ws = new WebSocket(
        `ws://${host}:${port}/__test__`
      );

      ws.onopen = () => {
        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        ws.close();
        resolve({
          reachable: true,
          latency,
        });
      };

      ws.onerror = (event) => {
        clearTimeout(timeoutId);
        resolve({
          reachable: false,
          error: `WebSocket error: ${event.type}`,
        });
      };
    } catch (error) {
      clearTimeout(timeoutId);
      resolve({
        reachable: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}

export async function testCurrentServer(): Promise<void> {
  const status = window.__SUPER777_WS_STATUS__;

  if (!status?.url || status.url === "disabled") {
    console.log("WebSocket is disabled or not configured");
    return;
  }

  const url = new URL(status.url);
  const host = url.hostname;
  const port = parseInt(url.port || "8080", 10);

  console.log(`Testing WebSocket connection to ${host}:${port}...`);
  const result = await testWebSocketServer(host, port);

  if (result.reachable) {
    console.log(
      `✅ Server is reachable! Latency: ${result.latency}ms`
    );
  } else {
    console.error(
      `❌ Server is NOT reachable: ${result.error}`
    );
  }
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).testCurrentServer = testCurrentServer;
  (window as any).testWebSocketServer = testWebSocketServer;
}
