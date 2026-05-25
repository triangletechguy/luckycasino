/**
 * Display startup information about the app configuration
 */

export function displayStartupInfo(): void {
  const status = window.__SUPER777_WS_STATUS__;
  const isDev = import.meta.env.DEV;

  console.log("\n%c=== SUPER777 Game Startup Info ===", "color: #00ff00; font-weight: bold;");

  if (isDev) {
    console.log(
      "%cℹ️ Development Mode",
      "color: #4299e1; font-weight: bold;"
    );
    console.log("   Type 'checkWebSocketStatus()' to check connection");
    console.log("   Type 'testCurrentServer()' to test server reachability");
  }

  console.log("\n%c📡 WebSocket Status:", "color: #ed8936; font-weight: bold;");

  if (status) {
    if (status.fallback) {
      console.log(
        "%c⚠️ Running in FALLBACK mode (no real-time updates)",
        "color: #f6ad55; font-weight: bold;"
      );
      console.log(`   URL: ${status.url}`);
      if (status.error) {
        console.log(`   Error: ${status.error}`);
      }
      console.log(
        "\n%c💡 To enable WebSocket:",
        "color: #68d391; font-weight: bold;"
      );
      console.log("   1. Ensure the server is running at: " + status.url);
      console.log("   2. Check firewall/network settings");
      console.log("   3. Or edit .env.local and set VITE_REVERB_ENABLED=false");
    } else if (status.connected) {
      console.log(
        "%c✅ Connected",
        "color: #68d391; font-weight: bold;"
      );
      console.log(`   URL: ${status.url}`);
    } else {
      console.log(
        "%c❌ Disconnected",
        "color: #fc8181; font-weight: bold;"
      );
      console.log(`   URL: ${status.url}`);
      if (status.error) {
        console.log(`   Error: ${status.error}`);
      }
    }
  }

  console.log("\n%c👤 User Info:", "color: #9f7aea; font-weight: bold;");
  const launchUser = localStorage.getItem("__SUPER777_LAUNCH_USER__");
  if (launchUser) {
    try {
      const user = JSON.parse(launchUser);
      console.log(`   ID: ${user.userId}`);
      console.log(`   Username: ${user.username || "N/A"}`);
    } catch {
      console.log("   (Unable to parse user info)");
    }
  }

  console.log("\n");
}

// Auto-display on app start
if (typeof window !== "undefined" && import.meta.env.DEV) {
  // Wait for startup to complete
  setTimeout(() => {
    displayStartupInfo();
  }, 1000);
}

// Expose globally
if (typeof window !== "undefined") {
  (window as any).displayStartupInfo = displayStartupInfo;
}
