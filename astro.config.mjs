import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://coldhanded.github.io/",
  vite: {
    plugins: [tailwindcss()]
  }
});
