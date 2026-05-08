import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
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

const shouldEnableRealtime =
  import.meta.env.VITE_REVERB_ENABLED !== "false";

type EchoLike = Pick<Echo<"reverb">, "channel">;

const noopChannel = {
  listen: (event: string, callback: CallableFunction) => {
    void event;
    void callback;
    return noopChannel;
  },
  stopListening: (event: string, callback?: CallableFunction) => {
    void event;
    void callback;
    return noopChannel;
  },
  subscribed: (callback: CallableFunction) => {
    void callback;
    return noopChannel;
  },
  error: (callback: CallableFunction) => {
    void callback;
    return noopChannel;
  },
};

const noopEcho: EchoLike = {
  channel: (name: string) => {
    void name;
    return noopChannel;
  },
};

export const echo: EchoLike = shouldEnableRealtime
  ? new Echo({
      broadcaster: "reverb",
      key: REVERB_KEY,
      wsHost: REALTIME_HOST,
      httpHost: REALTIME_HOST,
      wsPort: REALTIME_PORT,
      httpPort: REALTIME_PORT,
      wssPort: REALTIME_PORT,
      httpsPort: REALTIME_PORT,
      forceTLS: USE_TLS,
      enabledTransports: USE_TLS ? ["wss"] : ["ws"],
      disableStats: true,
      cluster: "",
      namespace: false,
    })
  : noopEcho;
