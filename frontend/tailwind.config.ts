
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lavender: {
          '50': '#f4f2ff',
          '100': '#ebe8ff',
          '200': '#d9d6fe',
          '300': '#c0bafd',
          '400': '#a79bfb',
          '500': '#8c7df8',
          '600': '#7a66f2',
          '700': '#6851e9',
          '800': '#5642d0',
          '900': '#4739a8',
          '950': '#2b236b',
        },
        'dark-bg': '#1a1a2e',
        'dark-surface': '#16213e',
        'dark-primary': '#0f3460',
        'dark-secondary': '#533483',
        'dark-text': '#e94560',
      }
    },
  },
  plugins: [],
};
export default config;
