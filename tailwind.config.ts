import { type Config } from "tailwindcss";

export default {
  content: ["{routes,islands,components}/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["font-title", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["font-body", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config;
