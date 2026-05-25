import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  REALTIME_ENABLED,
  REALTIME_HOST,
  REALTIME_PORT,
  REVERB_KEY,
  USE_TLS,
} from "../config/gameconfig";

type RealtimeTransport = "ws" | "wss";
type RealtimeState =
  | "disabled"
  | "connecting"
  | "connected"
  | "disconnected"
  | "unavailable"
  | "error";

export type RealtimeStatus = {
  enabled: boolean;
  connected: boolean;
  url: string;
  host: string;
  port: number;
  transport: RealtimeTransport;
  state: RealtimeState;
  error?: string;
  updatedAt: string;
};

declare global {
  interface Window {
    Pusher: typeof Pusher;
    __SUPER777_CONNECT_REALTIME__?: () => EchoLike;
    __SUPER777_ECHO__?: EchoLike;
    __SUPER777_WS_STATUS__?: RealtimeStatus;
  }
}

window.Pusher = Pusher;

type EchoChannelLike = {
  listen: (event: string, callback: CallableFunction) => EchoChannelLike;
  stopListening: (
    event: string,
    callback?: CallableFunction,
  ) => EchoChannelLike;
  subscribed: (callback: CallableFunction) => EchoChannelLike;
  error: (callback: CallableFunction) => EchoChannelLike;
};

export type EchoLike = {
  channel: (name: string) => EchoChannelLike;
  disconnect?: () => void;
};

type PusherConnectionStateChange = {
  previous: string;
  current: string;
};

type PusherConnectionLike = {
  state?: string;
  socket_id?: string;
  bind?: (eventName: string, callback: (data: unknown) => void) => void;
};

type EchoWithConnector = EchoLike & {
  connector?: {
    pusher?: {
      connection?: PusherConnectionLike;
    };
  };
};

const noopChannel: EchoChannelLike = {
  listen: () => noopChannel,
  stopListening: () => noopChannel,
  subscribed: () => noopChannel,
  error: () => noopChannel,
};

const noopEcho: EchoLike = {
  channel: () => noopChannel,
  disconnect: () => undefined,
};

let echoInstance: EchoLike | null = null;
const realtimeTransport: RealtimeTransport = USE_TLS ? "wss" : "ws";
const realtimeUrl = `${realtimeTransport}://${REALTIME_HOST}:${REALTIME_PORT}/app/${REVERB_KEY}`;

let realtimeStatus: RealtimeStatus = {
  enabled: REALTIME_ENABLED,
  connected: false,
  url: REALTIME_ENABLED ? realtimeUrl : "disabled",
  host: REALTIME_HOST,
  port: REALTIME_PORT,
  transport: realtimeTransport,
  state: REALTIME_ENABLED ? "disconnected" : "disabled",
  updatedAt: new Date().toISOString(),
};

if (REALTIME_ENABLED) {
  console.info("SUPER777 websocket endpoint configured:", realtimeUrl);
} else {
  console.info("SUPER777 websocket disabled by config.");
}

function updateRealtimeStatus(partial: Partial<RealtimeStatus>): void {
  realtimeStatus = {
    ...realtimeStatus,
    ...partial,
    updatedAt: new Date().toISOString(),
  };

  window.__SUPER777_WS_STATUS__ = realtimeStatus;
}

function asStateChange(data: unknown): PusherConnectionStateChange | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const candidate = data as Partial<PusherConnectionStateChange>;

  if (
    typeof candidate.previous === "string" &&
    typeof candidate.current === "string"
  ) {
    return {
      previous: candidate.previous,
      current: candidate.current,
    };
  }

  return null;
}

function formatErrorMessage(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    const maybeMessage = (data as { message?: unknown }).message;

    if (typeof maybeMessage === "string" && maybeMessage.trim() !== "") {
      return maybeMessage;
    }

    try {
      return JSON.stringify(data);
    } catch {
      return "Unknown websocket error";
    }
  }

  return "Unknown websocket error";
}

function bindConnectionStateListeners(echo: EchoWithConnector): void {
  const connection = echo.connector?.pusher?.connection;

  if (!connection?.bind) {
    updateRealtimeStatus({
      state: "unavailable",
      connected: false,
      error: "Pusher connection object is unavailable.",
    });
    return;
  }

  connection.bind("state_change", (eventData) => {
    const transition = asStateChange(eventData);

    if (!transition) {
      return;
    }

    const isConnected = transition.current === "connected";

    updateRealtimeStatus({
      connected: isConnected,
      state: isConnected ? "connected" : "disconnected",
      error: isConnected ? undefined : realtimeStatus.error,
    });

    console.info(
      `SUPER777 websocket state: ${transition.previous} -> ${transition.current}`,
    );
  });

  connection.bind("connected", () => {
    updateRealtimeStatus({
      connected: true,
      state: "connected",
      error: undefined,
    });

    console.info("SUPER777 websocket connected", {
      url: realtimeUrl,
      socketId: connection.socket_id ?? "unknown",
    });
  });

  connection.bind("disconnected", () => {
    updateRealtimeStatus({
      connected: false,
      state: "disconnected",
    });

    console.warn("SUPER777 websocket disconnected");
  });

  connection.bind("error", (eventData) => {
    const message = formatErrorMessage(eventData);

    updateRealtimeStatus({
      connected: false,
      state: "error",
      error: message,
    });

    console.error("SUPER777 websocket connection error:", message);
  });

  if (connection.state && connection.state !== "initialized") {
    const isConnected = connection.state === "connected";
    updateRealtimeStatus({
      connected: isConnected,
      state: isConnected ? "connected" : "disconnected",
    });
  }
}

export function connectRealtime(): EchoLike {
  if (!REALTIME_ENABLED) {
    console.warn("SUPER777 realtime disabled. Check VITE_REVERB_ENABLED.");
    updateRealtimeStatus({
      enabled: false,
      connected: false,
      state: "disabled",
      url: "disabled",
      error: undefined,
    });
    echoInstance = noopEcho;
    return echoInstance;
  }

  if (echoInstance) {
    return echoInstance;
  }

  console.info("SUPER777 connecting Reverb WebSocket:", realtimeUrl);
  updateRealtimeStatus({
    enabled: true,
    connected: false,
    url: realtimeUrl,
    host: REALTIME_HOST,
    port: REALTIME_PORT,
    transport: realtimeTransport,
    state: "connecting",
    error: undefined,
  });

  const echo = new Echo({
    broadcaster: "reverb",
    key: REVERB_KEY,

    wsHost: REALTIME_HOST,
    wsPort: REALTIME_PORT,
    wssPort: REALTIME_PORT,

    forceTLS: USE_TLS,
    encrypted: USE_TLS,

    enabledTransports: ["ws", "wss"],

    disableStats: true,
    cluster: "mt1",
    namespace: false,
  }) as unknown as EchoWithConnector;

  echoInstance = echo;
  bindConnectionStateListeners(echo);

  window.__SUPER777_ECHO__ = echoInstance;
  window.__SUPER777_WS_STATUS__ = realtimeStatus;

  return echoInstance;
}

export function getRealtime(): EchoLike {
  return echoInstance ?? connectRealtime();
}

export function disconnectRealtime(): void {
  echoInstance?.disconnect?.();
  echoInstance = null;
  window.__SUPER777_ECHO__ = undefined;
  updateRealtimeStatus({
    connected: false,
    state: REALTIME_ENABLED ? "disconnected" : "disabled",
  });
}

export const echo: EchoLike = {
  channel: (name: string) => connectRealtime().channel(name),
  disconnect: () => disconnectRealtime(),
};

window.__SUPER777_CONNECT_REALTIME__ = connectRealtime;
window.__SUPER777_WS_STATUS__ = realtimeStatus;
