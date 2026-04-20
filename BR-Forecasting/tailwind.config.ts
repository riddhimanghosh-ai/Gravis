import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E91E8C",
        "primary-dark": "#B0156A",
        accent: "#FF69B4",
        brown: "#4A2C2A",
        "brown-light": "#7B4F3A",
        cream: "#FFF5E4",
        surface: "#FFF0F5",
        text: "#2D1B1B",
      },
      boxShadow: {
        glass: "0 20px 40px rgba(74, 44, 42, 0.12)",
      },
      backgroundImage: {
        sprinkle:
          "radial-gradient(circle at 10% 20%, rgba(233,30,140,0.12) 0, transparent 18%), radial-gradient(circle at 80% 0%, rgba(255,105,180,0.14) 0, transparent 22%), linear-gradient(180deg, rgba(255,245,228,1) 0%, rgba(255,240,245,1) 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
