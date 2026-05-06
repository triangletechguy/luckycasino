export const GAME_ID = 1;

function getRuntimeOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://funint.site";
}

const RUNTIME_ORIGIN = getRuntimeOrigin();
export const APP_ORIGIN = RUNTIME_ORIGIN;
export const BACKEND_ORIGIN =
  import.meta.env.VITE_BACKEND_ORIGIN || "https://funint.site";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "/api" : `${BACKEND_ORIGIN}/api`);

  export const INTRO_API_URL= `${API_BASE_URL.replace(/\/$/, "")}/intro`;
export const GAME_DETAILS_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/game-details/${GAME_ID}`;
export const REMAINING_API_URL= `${API_BASE_URL.replace(/\/$/, "")}/remaining_today`
export const RANKING_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/ranking`;
export const RECHARGE_URL_API_URL= `${API_BASE_URL.replace(/\/$/, "")}/company/wallet/1`;
export const PRIZE_DISTRIBUTIONS_API_URL= `${API_BASE_URL.replace(/\/$/, "")}/prize-distributions/${GAME_ID}`;
export const BET_PLACE_API_URL=`${API_BASE_URL.replace(/\/$/, "")}/bet-place`;
export const WIN_TODAY_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/win-super777`;
export const PLAYER_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/player`;
export const MUSIC_SETTING_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/music-setting`;
export const ACTIVE_PLAYERS_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/active-players`;
export const HISTORY_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/game-records`;
export const JACKPOT_API_URL = `${API_BASE_URL.replace(/\/$/, "")}/life-time-bet-placed`;


export const REVERB_KEY =
  import.meta.env.VITE_REVERB_APP_KEY || "k6dbocgucm0at6gwak3y";
export const REALTIME_HOST =
  import.meta.env.VITE_REVERB_HOST || new URL(BACKEND_ORIGIN).hostname;
export const REALTIME_CHANNEL =
  import.meta.env.VITE_REVERB_CHANNEL || "game-channel";
export const REALTIME_EVENT = import.meta.env.VITE_REVERB_EVENT || "game.updated";
export const REALTIME_SCHEME =
  import.meta.env.VITE_REVERB_SCHEME ||
  (new URL(BACKEND_ORIGIN).protocol === "https:" ? "https" : "http");
export const USE_TLS = REALTIME_SCHEME === "https";
export const REALTIME_PORT = Number(
  import.meta.env.VITE_REVERB_PORT || 8080,
);
export const FALLBACK_REFRESH_MS = 5_000;

export const ASSET_BASE_URL = `${BACKEND_ORIGIN}/core/storage/app/public/`;

export const ACTIVE_CHANNEL ="user-activity";
export const ACTIVE_EVENT ="user-activity.updated"

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

  return `${ASSET_BASE_URL}${normalizedPath}`;
}

export const MUSIC_BASE_URL = `${BACKEND_ORIGIN}/core/storage/app/public/super777/`;
export const SOUND_BASE_URL = `${BACKEND_ORIGIN}/core/storage/app/public/super777/`;

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

  return `${MUSIC_BASE_URL}${normalizedPath}`;
}

export const GAME_MUSIC ={
  sound: "supper7.mp3",
  music: "super7.mp3",
}

export const GAME_ASSETS = {
 autoBtn: "super777/auto-button.svg",
 minusBtn: "super777/bet-minus-button.svg",
plusBtn: "super777/bet-plus-button.svg",
spinBtn:"super777/spin-button.svg",

bigWin: "super777/Big-win.svg",
bigWinDis: "super777/big-win-display.svg",
megaWin:"super777/mega-win.svg",
megaWinDis:"super777/mega-win-display.svg",
superWin:"super777/super-win.svg",
superWinDis:"super777/super-win-display.svg",

bg: "super777/bg.svg",
diamond:"super777/diamond.svg",
gameBoard:"super777/game-board.svg",
jackpot:"super777/jackpot.svg",
loadingLogo:"super777/loading-logo.svg",
cup:"super777/trofy.svg",
rotated:"super777/Rotated-Instances.svg",
coin:"super777/gold.png",
first:"super777/1st-position.svg",
second:"super777/2nd-possition.svg",
thirdP:"super777/3rd-position.svg",
    } as const;
