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
};

const noopChannel: EchoChannelLike = {
  listen: () => noopChannel,
  stopListening: () => noopChannel,
  subscribed: () => noopChannel,
  error: () => noopChannel,
};

const noopEcho: EchoLike = {
  channel: () => noopChannel,
};

export const echo: EchoLike = REALTIME_ENABLED
  ? (new Echo({
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
    }) as unknown as EchoLike)
  : noopEcho;