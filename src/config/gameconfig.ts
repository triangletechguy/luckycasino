export const GAME_ID = 1;

export type RuntimeGameConfig = {
  backendOrigin?: string;
  apiBaseUrl?: string;
  assetBaseUrl?: string;
  soundEffectFile?: string;
  backgroundMusicFile?: string;
  reverbHost?: string;
  reverbPort?: number | string;
  reverbScheme?: "http" | "https";
  reverbAppKey?: string;
  reverbEnabled?: boolean | string;
};

declare global {
  interface Window {
    __SUPER777_CONFIG__?: RuntimeGameConfig;
  }
}

const runtimeConfig: RuntimeGameConfig =
  typeof window !== "undefined" ? window.__SUPER777_CONFIG__ ?? {} : {};

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function toBoolean(value: boolean | string | undefined, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    return value.toLowerCase() !== "false" && value !== "0";
  }

  return fallback;
}

const DEFAULT_BACKEND_ORIGIN = "https://funint.site";

export const BACKEND_ORIGIN = normalizeOrigin(
  runtimeConfig.backendOrigin ||
    import.meta.env.VITE_BACKEND_ORIGIN ||
    DEFAULT_BACKEND_ORIGIN,
);

export const APP_ORIGIN =
  typeof window !== "undefined" && window.location.origin
    ? window.location.origin
    : BACKEND_ORIGIN;

/**
 * For Vercel, use:
 * VITE_API_BASE_URL=/api
 *
 * Then vercel.json will forward /api/... to:
 * https://funint.site/api/...
 */
export const API_BASE_URL = normalizeBaseUrl(
  runtimeConfig.apiBaseUrl ||
    import.meta.env.VITE_API_BASE_URL ||
    "/api",
);

export const INTRO_API_URL = `${API_BASE_URL}/intro`;
export const GAME_DETAILS_API_URL = `${API_BASE_URL}/game-details/${GAME_ID}`;
export const REMAINING_API_URL = `${API_BASE_URL}/remaining_today`;
export const RANKING_API_URL = `${API_BASE_URL}/ranking`;
export const RECHARGE_URL_API_URL = `${API_BASE_URL}/company/wallet/1`;
export const PRIZE_DISTRIBUTIONS_API_URL = `${API_BASE_URL}/prize-distributions/${GAME_ID}`;
export const BET_PLACE_API_URL = `${API_BASE_URL}/bet-place`;
export const WIN_TODAY_API_URL = `${API_BASE_URL}/win-super777`;
export const PLAYER_API_URL = `${API_BASE_URL}/player`;
export const MUSIC_SETTING_API_URL = `${API_BASE_URL}/music-setting`;
export const ACTIVE_PLAYERS_API_URL = `${API_BASE_URL}/active-players`;
export const HISTORY_API_URL = `${API_BASE_URL}/game-records`;
export const JACKPOT_API_URL = `${API_BASE_URL}/life-time-bet-placed`;

export const ASSET_BASE_URL = normalizeBaseUrl(
  runtimeConfig.assetBaseUrl ||
    import.meta.env.VITE_ASSET_BASE_URL ||
    `${BACKEND_ORIGIN}/core/storage/app/public`,
);

export const REVERB_KEY =
  runtimeConfig.reverbAppKey ||
  import.meta.env.VITE_REVERB_APP_KEY ||
  "k6dbocgucm0at6gwak3y";

export const REALTIME_HOST =
  runtimeConfig.reverbHost ||
  import.meta.env.VITE_REVERB_HOST ||
  new URL(BACKEND_ORIGIN).hostname;

export const REALTIME_SCHEME =
  runtimeConfig.reverbScheme ||
  import.meta.env.VITE_REVERB_SCHEME ||
  (import.meta.env.PROD ? "https" : "http");

export const USE_TLS = REALTIME_SCHEME === "https";

export const REALTIME_PORT = Number(
  runtimeConfig.reverbPort ||
    import.meta.env.VITE_REVERB_PORT ||
    (USE_TLS ? 443 : 8080),
);

export const REALTIME_ENABLED = toBoolean(
  runtimeConfig.reverbEnabled ?? import.meta.env.VITE_REVERB_ENABLED,
  true,
);

export const REALTIME_CHANNEL =
  import.meta.env.VITE_REVERB_CHANNEL || "game-channel";

export const REALTIME_EVENT =
  import.meta.env.VITE_REVERB_EVENT || "game.updated";

export const ACTIVE_CHANNEL = "user-activity";
export const ACTIVE_EVENT = "user-activity.updated";

export function getAssetUrl(path: string): string {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const storagePrefix = "core/storage/app/public/";
  const storagePathIndex = normalizedPath.indexOf(storagePrefix);

  if (storagePathIndex >= 0) {
    return `${BACKEND_ORIGIN}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${ASSET_BASE_URL}/${normalizedPath}`;
}

export const MUSIC_BASE_URL = `${ASSET_BASE_URL}/super777`;
export const SOUND_BASE_URL = `${ASSET_BASE_URL}/super777`;

export function getMusicUrl(path: string): string {
  if (!path) {
    return "";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const storagePrefix = "core/storage/app/public/super777/";
  const storagePathIndex = normalizedPath.indexOf(storagePrefix);

  if (storagePathIndex >= 0) {
    return `${BACKEND_ORIGIN}/${normalizedPath.slice(storagePathIndex)}`;
  }

  return `${MUSIC_BASE_URL}/${normalizedPath}`;
}

export function getMusicUrlWithFallback(path: string): string {
  const normalizedPath = path.trim();

  if (!normalizedPath) {
    return "";
  }

  // Backend currently serves "supper7.mp3". Keep a safe fallback
  // for older references using "super7.mp3".
  if (/super7\.mp3$/i.test(normalizedPath)) {
    const fallbackPath = normalizedPath.replace(/super7\.mp3$/i, "supper7.mp3");
    return getMusicUrl(fallbackPath);
  }

  return getMusicUrl(normalizedPath);
}

export const GAME_MUSIC = {
  sound:
    runtimeConfig.soundEffectFile ||
    import.meta.env.VITE_SOUND_EFFECT_FILE ||
    "supper7.mp3",
  music:
    runtimeConfig.backgroundMusicFile ||
    import.meta.env.VITE_BACKGROUND_MUSIC_FILE ||
    "",
};

export const GAME_ASSETS = {
  autoBtn: "super777/auto-button.svg",
  minusBtn: "super777/bet-minus-button.svg",
  plusBtn: "super777/bet-plus-button.svg",
  spinBtn: "super777/spin-button.svg",

  bigWin: "super777/Big-win.svg",
  bigWinDis: "super777/big-win-display.svg",
  megaWin: "super777/mega-win.svg",
  megaWinDis: "super777/mega-win-display.svg",
  superWin: "super777/super-win.svg",
  superWinDis: "super777/super-win-display.svg",

  bg: "super777/bg.svg",
  diamond: "super777/diamond.svg",
  gameBoard: "super777/game-board.svg",
  jackpot: "super777/jackpot.svg",
  loadingLogo: "super777/loading-logo.svg",
  cup: "super777/trofy.svg",
  rotated: "super777/Rotated-Instances.svg",
  coin: "super777/gold.png",
  first: "super777/1st-position.svg",
  second: "super777/2nd-possition.svg",
  thirdP: "super777/3rd-position.svg",
  shine: "super777/shine-role.svg",
} as const;
