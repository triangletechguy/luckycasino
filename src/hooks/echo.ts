import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  REALTIME_ENABLED,
  REALTIME_HOST,
  REALTIME_PORT,
  REVERB_KEY,
  USE_TLS,
} from "../config/gameconfig";

declare global {
  interface Window {
    Pusher: typeof Pusher;
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

export function connectRealtime(): EchoLike {
  if (!REALTIME_ENABLED) {
    console.warn("Realtime disabled by VITE_REVERB_ENABLED=false");
    echoInstance = noopEcho;
    return echoInstance;
  }

  if (echoInstance) {
    return echoInstance;
  }

  const websocketUrl = `${USE_TLS ? "wss" : "ws"}://${REALTIME_HOST}:${REALTIME_PORT}/app/${REVERB_KEY}`;
  console.info(`Connecting Reverb WebSocket: ${websocketUrl}`);

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: REVERB_KEY,

    wsHost: REALTIME_HOST,
    wsPort: REALTIME_PORT,
    wssPort: REALTIME_PORT,

    forceTLS: USE_TLS,
    encrypted: USE_TLS,

    enabledTransports: USE_TLS ? ["wss"] : ["ws"],

    disableStats: true,
    cluster: "",
    namespace: false,
  }) as unknown as EchoLike;

  return echoInstance;
}

export function getRealtime(): EchoLike {
  return echoInstance ?? connectRealtime();
}

export function disconnectRealtime(): void {
  echoInstance?.disconnect?.();
  echoInstance = null;
}

export const echo: EchoLike = {
  channel: (name: string) => connectRealtime().channel(name),
  disconnect: () => disconnectRealtime(),
};