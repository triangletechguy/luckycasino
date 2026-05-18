import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = normalizeOrigin(
    env.VITE_BACKEND_ORIGIN || "https://funint.site",
  );

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: `${backendOrigin}/api`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});