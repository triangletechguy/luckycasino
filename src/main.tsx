import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.tsx";
import {
  checkIntroIntegration,
  type IntroResponse,
} from "./api/auth.ts";
import { closeCurrentView } from "./utils/closeCurrentView.ts";

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

type ParamSource = {
  label: string;
  value: string;
};

const USER_ID_PARAM_KEYS = ["userid", "user_id", "userId", "uid"] as const;
const TOKEN_PARAM_KEYS = [
  "token",
  "auth_token",
  "authToken",
  "access_token",
] as const;

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

function maskToken(token: string | null): string {
  if (!token) {
    return "null";
  }

  if (token.length <= 6) {
    return "***";
  }

  return `${token.slice(0, 3)}***${token.slice(-3)}`;
}

function isSuccessStatus(status: IntroResponse["status"]): boolean {
  return (
    status === true ||
    status === 1 ||
    status === "1" ||
    String(status).toLowerCase() === "true"
  );
}

function tryDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseParamsFromCandidate(candidate: string): URLSearchParams | null {
  const trimmed = candidate.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (url.search) {
      return new URLSearchParams(url.search);
    }

    const hashQueryIndex = url.hash.indexOf("?");

    if (hashQueryIndex >= 0) {
      return new URLSearchParams(url.hash.slice(hashQueryIndex + 1));
    }
  } catch {
    // Continue with query-like parsing below.
  }

  const normalizedQuery = trimmed
    .replace(/^[?#]/, "")
    .replace(/\?/g, "&")
    .replace(/^&/, "");

  if (!normalizedQuery || !normalizedQuery.includes("=")) {
    return null;
  }

  return new URLSearchParams(normalizedQuery);
}

function enqueueParamSource(
  queue: ParamSource[],
  seen: Set<string>,
  label: string,
  value: string,
): void {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return;
  }

  const key = `${label}:${trimmedValue}`;

  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  queue.push({ label, value: trimmedValue });
}

function getParamByAliases(
  params: URLSearchParams,
  aliases: readonly string[],
): string | null {
  const aliasSet = new Set(aliases.map((alias) => alias.toLowerCase()));

  for (const [key, value] of params.entries()) {
    if (aliasSet.has(key.toLowerCase()) && value.trim() !== "") {
      return value;
    }
  }

  return null;
}

function getGameLaunchParams(): {
  userIdParam: string | null;
  tokenParam: string | null;
  source: string;
} {
  const queue: ParamSource[] = [];
  const seen = new Set<string>();

  enqueueParamSource(
    queue,
    seen,
    "window.location.search",
    window.location.search,
  );
  enqueueParamSource(
    queue,
    seen,
    "window.location.hash",
    window.location.hash,
  );
  enqueueParamSource(
    queue,
    seen,
    "window.location.href",
    window.location.href,
  );

  let lastUserId: string | null = null;
  let lastToken: string | null = null;
  let lastSource = "unknown";

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      break;
    }

    const params = parseParamsFromCandidate(current.value);

    if (!params) {
      continue;
    }

    const userIdParam = getParamByAliases(params, USER_ID_PARAM_KEYS);
    const tokenParam = getParamByAliases(params, TOKEN_PARAM_KEYS);

    if (userIdParam !== null) {
      lastUserId = userIdParam;
      lastSource = current.label;
    }

    if (tokenParam !== null) {
      lastToken = tokenParam;
      lastSource = current.label;
    }

    if (userIdParam !== null && tokenParam !== null) {
      return {
        userIdParam,
        tokenParam,
        source: current.label,
      };
    }

    for (const value of params.values()) {
      enqueueParamSource(queue, seen, `${current.label} -> nested`, value);

      const decodedValue = tryDecodeURIComponent(value);

      if (decodedValue !== value) {
        enqueueParamSource(
          queue,
          seen,
          `${current.label} -> decoded`,
          decodedValue,
        );
      }
    }
  }

  return {
    userIdParam: lastUserId,
    tokenParam: lastToken,
    source: lastSource,
  };
}

function renderBootstrapError(title: string, details: string): void {
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

function formatError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const lines = [
      `Axios error: ${error.message}`,
      `Request URL: ${error.config?.url ?? "unknown"}`,
      `Request method: ${error.config?.method ?? "unknown"}`,
    ];

    if (error.response) {
      lines.push(`Response status: ${error.response.status}`);
      lines.push("Response data:");
      lines.push(JSON.stringify(error.response.data, null, 2));
    } else {
      lines.push("No response received from server.");
      lines.push(
        "Possible reason: CORS issue, network issue, wrong API URL, or backend server is not reachable.",
      );
    }

    return lines.join("\n");
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function renderApp(): void {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

function getDevFallbackUserId(): number {
  const existingUserId = Number(localStorage.getItem("user_id"));

  if (Number.isFinite(existingUserId) && existingUserId > 0) {
    return existingUserId;
  }

  const configuredUserId = Number(import.meta.env.VITE_DEV_USER_ID);

  if (Number.isFinite(configuredUserId) && configuredUserId > 0) {
    return configuredUserId;
  }

  return 1;
}

function getStoredUserId(): number | null {
  const storedUserId = Number(localStorage.getItem("user_id"));

  if (Number.isFinite(storedUserId) && storedUserId > 0) {
    return storedUserId;
  }

  return null;
}

function isTruthyEnvValue(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function isFalsyEnvValue(value: unknown): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "0" || normalized === "false" || normalized === "no";
}

function isVercelDeploymentHost(): boolean {
  return window.location.hostname.endsWith(".vercel.app");
}

function shouldAllowProductionFallback(): boolean {
  if (!import.meta.env.PROD) {
    return false;
  }

  const fallbackFlag = import.meta.env.VITE_ALLOW_PROD_FALLBACK;

  if (isTruthyEnvValue(fallbackFlag)) {
    return true;
  }

  if (isFalsyEnvValue(fallbackFlag)) {
    return false;
  }

  // Helpful default for Vercel preview URLs opened directly in browser.
  return isVercelDeploymentHost();
}

function getProductionFallbackUserId(): number | null {
  const configuredProdFallbackUserId = Number(
    import.meta.env.VITE_PROD_FALLBACK_USER_ID,
  );

  if (
    Number.isFinite(configuredProdFallbackUserId) &&
    configuredProdFallbackUserId > 0
  ) {
    return configuredProdFallbackUserId;
  }

  const configuredDevFallbackUserId = Number(import.meta.env.VITE_DEV_USER_ID);

  if (
    Number.isFinite(configuredDevFallbackUserId) &&
    configuredDevFallbackUserId > 0
  ) {
    return configuredDevFallbackUserId;
  }

  if (isVercelDeploymentHost()) {
    return 1;
  }

  return null;
}

function tryBootstrapWithoutLaunchParams(source: string): boolean {
  const storedUserId = getStoredUserId();

  if (storedUserId !== null) {
    localStorage.setItem("user_id", storedUserId.toString());

    console.warn(
      `Missing launch params. Using existing localStorage user_id=${storedUserId}. Source: ${source}`,
    );

    renderApp();
    return true;
  }

  const allowProdFallback = shouldAllowProductionFallback();
  const configuredProdFallbackUserId = getProductionFallbackUserId();

  if (
    allowProdFallback &&
    configuredProdFallbackUserId !== null
  ) {
    localStorage.setItem(
      "user_id",
      configuredProdFallbackUserId.toString(),
    );

    console.warn(
      `Missing launch params in production. Using VITE_PROD_FALLBACK_USER_ID=${configuredProdFallbackUserId}. Source: ${source}`,
    );

    renderApp();
    return true;
  }

  return false;
}

async function bootstrap(): Promise<void> {
  const { userIdParam, tokenParam, source } = getGameLaunchParams();
  const userId = Number(userIdParam);

  if (
    userIdParam === null ||
    tokenParam === null ||
    tokenParam.trim() === "" ||
    !Number.isFinite(userId) ||
    userId <= 0
  ) {
    if (import.meta.env.DEV) {
      const fallbackUserId = getDevFallbackUserId();
      localStorage.setItem("user_id", fallbackUserId.toString());

      console.warn(
        "Missing userid/token in development mode. Skipping intro integration check.",
      );

      renderApp();
      return;
    }

    if (tryBootstrapWithoutLaunchParams(source)) {
      return;
    }

    const message = [
      "Missing or invalid URL params.",
      "",
      "Required URL format:",
      "?userid=2&token=123456",
      "",
      "Also accepted:",
      "?user_id=2&token=123456",
      "#/game?userid=2&token=123456",
      "",
      `Current URL: ${window.location.href}`,
      `Detected source: ${source}`,
      "Hint: set VITE_ALLOW_PROD_FALLBACK=true and VITE_PROD_FALLBACK_USER_ID=1 on Vercel if needed.",
      "",
      `Received userid: ${String(userIdParam)}`,
      `Received token: ${maskToken(tokenParam)}`,
    ].join("\n");

    console.error(message);

    if (isNativeView()) {
      closeCurrentView();
      return;
    }

    renderBootstrapError("Invalid game URL", message);
    return;
  }

  try {
    localStorage.removeItem("user_id");

    const res = await checkIntroIntegration(userId, tokenParam);
    const responseUserId = Number(res.user_id);

    if (
      !isSuccessStatus(res.status) ||
      !Number.isFinite(responseUserId) ||
      responseUserId <= 0
    ) {
      const message = [
        "Intro API rejected this user/token.",
        "",
        `userid: ${userId}`,
        `token: ${maskToken(tokenParam)}`,
        "",
        "Intro API response:",
        JSON.stringify(res, null, 2),
      ].join("\n");

      console.error(message);

      if (isNativeView()) {
        closeCurrentView();
        return;
      }

      renderBootstrapError("Intro check rejected", message);
      return;
    }

    localStorage.setItem("user_id", responseUserId.toString());
    renderApp();
  } catch (error) {
    const message = [
      "Intro API request failed.",
      "",
      "Possible reasons:",
      "1. Backend CORS does not allow this domain.",
      "2. API proxy is missing or wrong.",
      "3. Backend server is down.",
      "4. userid/token is invalid.",
      "5. /intro API returned an error.",
      "",
      `userid: ${userId}`,
      `token: ${maskToken(tokenParam)}`,
      "",
      formatError(error),
    ].join("\n");

    console.error("Intro check failed", error);

    if (isNativeView()) {
      closeCurrentView();
      return;
    }

    renderBootstrapError("Intro API failed", message);
  }
}

void bootstrap();
