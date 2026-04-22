import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csrf: {
      trustedOrigins: [
        "http://localhost",
        "http://127.0.0.1",
        "https://backend",
      ],
    },
  },
  vitePlugin: {
    dynamicCompileOptions: ({ filename }) =>
      filename.includes("node_modules") ? undefined : { runes: true },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
};

export default config;
