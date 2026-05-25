import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { connectRealtime } from "./hooks/echo.ts";
import "./utils/wsDebug.ts";
import "./utils/wsTest.ts";
import "./utils/startupInfo.ts";
import { closeCurrentView } from "./utils/closeCurrentView.ts";
import {
  clearLaunchUser,
  saveLaunchUser,
} from "./utils/user.ts";

type NativeWindow = Window & {
  Android?: {
    exitApp?: () => void;
  };
  webkit?: {
    messageHandlers?: {
      exitApp?: {
        postMessage: (message: null) => void;
      };
    };
  };
};

type LaunchParams = {
  userId: number;
  token: string;
  username?: string;
  avater?: string;
  balance?: number;
};

const USER_ID_PARAM_KEYS = [
  "id",
  "userid",
  "user_id",
  "userId",
  "uid",
  "player_id",
] as const;
const TOKEN_PARAM_KEYS = [
  "token",
  "auth_token",
  "authToken",
  "access_token",
  "accessToken",
  "jwt",
] as const;
const USERNAME_PARAM_KEYS = ["username", "user_name", "name"] as const;
const AVATER_PARAM_KEYS = ["avater", "avatar", "user_avatar", "profile"] as const;
const BALANCE_PARAM_KEYS = ["balance", "amount", "wallet_balance"] as const;

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found.");
}

const root = createRoot(rootElement);

function isNativeView(): boolean {
  const nativeWindow = window as NativeWindow;

  return Boolean(
    nativeWindow.Android?.exitApp ||
      nativeWindow.webkit?.messageHandlers?.exitApp,
  );
}

function shouldShowDebug(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_SHOW_AUTH_DEBUG === "true";
}

function shouldCloseOnDeniedAccess(): boolean {
  if (isNativeView()) return true;

  return import.meta.env.VITE_CLOSE_ON_AUTH_ERROR === "true";
}

function renderError(title: string, details: string): void {
  root.render(
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#111827",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.5,
      }}
    >
      <h2 style={{ marginBottom: "12px", fontSize: "22px" }}>{title}</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          background: "#1f2937",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto",
          fontSize: "14px",
        }}
      >
        {details}
      </pre>
    </div>,
  );
}

function denyGameAccess(title: string, details: string): void {
  console.error(title);
  console.error(details);

  clearLaunchUser();

  if (shouldShowDebug() || !shouldCloseOnDeniedAccess()) {
    renderError(title, details);
    return;
  }

  closeCurrentView();
}

function addParamsFromString(params: URLSearchParams, value: string): void {
  if (!value.trim()) return;

  const normalized = value
    .trim()
    .replace(/^[?#]/, "")
    .replace(/\?/g, "&")
    .replace(/^&/, "");

  if (!normalized.includes("=")) return;

  const sourceParams = new URLSearchParams(normalized);

  sourceParams.forEach((paramValue, paramKey) => {
    if (!params.has(paramKey)) {
      params.set(paramKey, paramValue);
    }
  });
}

function getAllUrlParams(): URLSearchParams {
  const params = new URLSearchParams();

  addParamsFromString(params, window.location.search);

  const hashQuestionIndex = window.location.hash.indexOf("?");

  if (hashQuestionIndex >= 0) {
    addParamsFromString(params, window.location.hash.slice(hashQuestionIndex + 1));
  }

  const hrefQuestionIndex = window.location.href.indexOf("?");

  if (hrefQuestionIndex >= 0) {
    addParamsFromString(
      params,
      window.location.href.slice(hrefQuestionIndex + 1).split("#")[0],
    );
  }

  return params;
}

function getFirstParam(
  params: URLSearchParams,
  aliases: readonly string[],
): string | null {
  const aliasSet = new Set(aliases.map((alias) => alias.toLowerCase()));

  for (const [key, value] of params.entries()) {
    if (aliasSet.has(key.toLowerCase()) && value.trim() !== "") {
      return value.trim();
    }
  }

  return null;
}

function decodePathSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function getLaunchParamsFromPath(): {
  userIdParam: string | null;
  token: string | null;
} {
  const segments = window.location.pathname
    .split("/")
    .map((segment) => decodePathSegment(segment.trim()))
    .filter(Boolean);

  if (segments.length < 2) {
    return { userIdParam: null, token: null };
  }

  for (let index = 0; index < segments.length - 1; index += 1) {
    const userIdParam = segments[index];
    const token = segments[index + 1];

    if (/^\d+$/.test(userIdParam) && token.trim() !== "") {
      return { userIdParam, token: token.trim() };
    }
  }

  return { userIdParam: null, token: null };
}

function parseLaunchParams(): LaunchParams | null {
  const params = getAllUrlParams();

  const allowTestFallback =
    import.meta.env.DEV &&
    (import.meta.env.VITE_ALLOW_TEST_LOGIN === "true" ||
      import.meta.env.VITE_ALLOW_DEV_LOGIN === "true");

  let userIdParam = getFirstParam(params, USER_ID_PARAM_KEYS);
  let token = getFirstParam(params, TOKEN_PARAM_KEYS);

  let username = getFirstParam(params, USERNAME_PARAM_KEYS) ?? undefined;
  let avater = getFirstParam(params, AVATER_PARAM_KEYS) ?? undefined;
  let balanceParam = getFirstParam(params, BALANCE_PARAM_KEYS);

  if (!userIdParam || !token) {
    const pathLaunchParams = getLaunchParamsFromPath();

    userIdParam = userIdParam || pathLaunchParams.userIdParam;
    token = token || pathLaunchParams.token;
  }

  if ((!userIdParam || !token) && allowTestFallback) {
    userIdParam = import.meta.env.VITE_TEST_USERID || userIdParam;
    token = import.meta.env.VITE_TEST_TOKEN || token;
    username = username || import.meta.env.VITE_TEST_USERNAME || undefined;
    avater =
      avater ||
      import.meta.env.VITE_TEST_AVATER ||
      import.meta.env.VITE_TEST_AVATAR ||
      undefined;
    balanceParam = balanceParam || import.meta.env.VITE_TEST_BALANCE || null;
  }

  const userId = Number(userIdParam);
  const balance = balanceParam !== null ? Number(balanceParam) : undefined;

  if (
    userIdParam === null ||
    token === null ||
    !Number.isInteger(userId) ||
    userId <= 0 ||
    token.trim() === ""
  ) {
    return null;
  }

  return {
    userId,
    token,
    username,
    avater,
    balance: Number.isFinite(balance) ? balance : undefined,
  };
}

function bootstrap(): void {
  const launchParams = parseLaunchParams();

  if (!launchParams) {
    denyGameAccess(
      "Invalid game URL",
      [
        "Game access denied.",
        "",
        "Reason:",
        "Missing or invalid userid/token.",
        "",
        "Supported URL formats:",
        "?userid=2&token=187871878",
        "?id=2&token=187871878",
        "/2/187871878",
        "",
        `Current URL: ${window.location.href}`,
      ].join("\n"),
    );
    return;
  }

  saveLaunchUser({
    userId: launchParams.userId,
    token: launchParams.token,
    username: launchParams.username,
    avater: launchParams.avater,
    balance: launchParams.balance,
  });

  connectRealtime();

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
