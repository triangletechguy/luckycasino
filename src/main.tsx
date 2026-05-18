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

function renderBootstrapError(title: string, details: string): void {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error(title, details);
    return;
  }

  createRoot(rootElement).render(
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

async function bootstrap() {
  localStorage.removeItem("user_id");

  const search = window.location.search.replace(/\?/g, "&").replace(/^&/, "?");
  const params = new URLSearchParams(search);

  const userIdParam = params.get("userid");
  const tokenParam = params.get("token");
  const userId = Number(userIdParam);

  if (
    userIdParam === null ||
    tokenParam === null ||
    tokenParam.trim() === "" ||
    !Number.isFinite(userId) ||
    userId <= 0
  ) {
    const message = [
      "Missing or invalid URL params.",
      "",
      "Required URL format:",
      "?userid=2&token=123456",
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

    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Root element #root not found.");
    }

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
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