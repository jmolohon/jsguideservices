// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://jsguideservices.com",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
});
