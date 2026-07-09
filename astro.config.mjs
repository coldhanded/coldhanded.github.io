import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://coldhands.net",
  vite: {
    plugins: [tailwindcss()]
  }
});
