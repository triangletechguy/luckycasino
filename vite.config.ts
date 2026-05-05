import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = env.VITE_BACKEND_ORIGIN || "https://funint.site";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: backendOrigin,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on("error", (error, request, response) => {
              const message =
                "code" in error && typeof error.code === "string"
                  ? error.code
                  : error.message;

              console.warn(
                `[vite proxy] ${request.method} ${request.url} failed: ${message}`,
              );

              if (!response || response.headersSent) {
                return;
              }

              response.writeHead(502, {
                "Content-Type": "application/json",
              });
              response.end(
                JSON.stringify({
                  status: false,
                  message: `Backend unavailable: ${message}`,
                }),
              );
            });
          },
        },
      },
    },
  };
});
