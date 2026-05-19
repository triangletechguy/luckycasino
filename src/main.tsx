import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.tsx";
import { checkIntroIntegration, type IntroResponse } from "./api/auth.ts";
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

let root: ReturnType<typeof createRoot> | null = null;

function getRoot(): ReturnType<typeof createRoot> {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element #root not found.");
  }

  if (!root) {
    root = createRoot(rootElement);
  }

  return root;
}

function isNativeView(): boolean {
  const nativeWindow = window as NativeWindow;

  return Boolean(
    nativeWindow.Android?.exitApp ||
      nativeWindow.webkit?.messageHandlers?.exitApp,
  );
}

function shouldShowAuthDebug(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_SHOW_AUTH_DEBUG === "true";
}

function maskToken(token: string | null): string {
  if (!token) return "null";
  if (token.length <= 6) return "***";
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

function addParamsFromString(params: URLSearchParams, value: string): void {
  if (!value) return;

  const normalizedValue = value
    .replace(/^[?#]/, "")
    .replace(/\?/g, "&")
    .trim();

  if (!normalizedValue) return;

  const sourceParams = new URLSearchParams(normalizedValue);

  sourceParams.forEach((paramValue, paramKey) => {
    if (!params.has(paramKey)) {
      params.set(paramKey, paramValue);
    }
  });
}

function getGameUrlParams(): URLSearchParams {
  const params = new URLSearchParams();

  addParamsFromString(params, window.location.search);

  const hash = window.location.hash;
  const hashQuestionIndex = hash.indexOf("?");

  if (hashQuestionIndex >= 0) {
    addParamsFromString(params, hash.slice(hashQuestionIndex + 1));
  }

  const hrefQuestionIndex = window.location.href.indexOf("?");

  if (hrefQuestionIndex >= 0) {
    const hrefQuery = window.location.href
      .slice(hrefQuestionIndex + 1)
      .split("#")[0];

    addParamsFromString(params, hrefQuery);
  }

  return params;
}

function getFirstParam(
  params: URLSearchParams,
  possibleKeys: string[],
): string | null {
  for (const key of possibleKeys) {
    const value = params.get(key);

    if (value !== null && value.trim() !== "") {
      return value;
    }
  }

  return null;
}

function renderAuthDebugError(title: string, details: string): void {
  getRoot().render(
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

  localStorage.removeItem("user_id");

  if (shouldShowAuthDebug() && !isNativeView()) {
    renderAuthDebugError(title, details);
    return;
  }

  closeCurrentView();
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

async function bootstrap(): Promise<void> {
  localStorage.removeItem("user_id");

  const params = getGameUrlParams();

  const userIdParam = getFirstParam(params, [
    "userid",
    "user_id",
    "userId",
    "uid",
  ]);

  const tokenParam = getFirstParam(params, [
    "token",
    "auth_token",
    "authToken",
    "access_token",
  ]);

  const userId = Number(userIdParam);

  if (
    userIdParam === null ||
    tokenParam === null ||
    tokenParam.trim() === "" ||
    !Number.isInteger(userId) ||
    userId <= 0
  ) {
    const message = [
      "Game access denied.",
      "",
      "Reason:",
      "Missing or invalid userid/token.",
      "",
      "Required URL format:",
      "?userid=2&token=123456",
      "",
      "Also accepted:",
      "?user_id=2&token=123456",
      "#/game?userid=2&token=123456",
      "",
      `Current URL: ${window.location.href}`,
      "",
      `Received userid: ${String(userIdParam)}`,
      `Received token: ${maskToken(tokenParam)}`,
    ].join("\n");

    denyGameAccess("Invalid game URL", message);
    return;
  }

  try {
    const res = await checkIntroIntegration(userId, tokenParam);
    const responseUserId = Number(res.user_id);

    if (
      !isSuccessStatus(res.status) ||
      !Number.isInteger(responseUserId) ||
      responseUserId <= 0
    ) {
      const message = [
        "Game access denied.",
        "",
        "Reason:",
        "Intro API rejected this userid/token.",
        "",
        `userid: ${userId}`,
        `token: ${maskToken(tokenParam)}`,
        "",
        "Intro API response:",
        JSON.stringify(res, null, 2),
      ].join("\n");

      denyGameAccess("Intro check rejected", message);
      return;
    }

    localStorage.setItem("user_id", responseUserId.toString());

    getRoot().render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error) {
    const message = [
      "Game access denied.",
      "",
      "Reason:",
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

    denyGameAccess("Intro API failed", message);
  }
}

void bootstrap();