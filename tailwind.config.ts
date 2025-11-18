import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        // Stronger top shadow + soft all-around shadow
        aroundTop: `
          0 -6px 12px rgba(0, 0, 0, 0.18),   /* top shadow */
          0 0 14px rgba(0, 0, 0, 0.12)       /* all-around */
        `,
      },
    },
  },
  plugins: [],
};

export default config;
