/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ['"Hanken Grotesk"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
      },
      colors: {
        ink: "#05030e",
        brand: { blue: "#5b8cff", violet: "#8a5cff", pink: "#ff5fd2", cyan: "#4cc9ff", lilac: "#a99bff" },
        mute: "#a0a0b8",
      },
      keyframes: {
        hem: { "50%": { backgroundPosition: "100% 0" } },
        cardin: { to: { opacity: "1", transform: "none" } },
        cardhi: {
          "0%,18%,100%": { opacity: "0" },
          "6%,12%": { opacity: "1", boxShadow: "0 0 24px rgba(130,110,255,.6)" },
        },
        rise: { from: { opacity: "0", transform: "translateY(26px)" }, to: { opacity: "1", transform: "none" } },
        hin: { from: { opacity: "0", transform: "translateY(22px)" }, to: { opacity: "1", transform: "none" } },
        blob: { "50%": { transform: "translate(70px,50px) scale(1.15)" } },
        fin: { to: { opacity: "1", transform: "none" } },
      },
      animation: {
        hem: "hem 7s ease-in-out infinite",
        rise: "rise .8s cubic-bezier(.2,.7,.2,1) both",
        hin: "hin .85s cubic-bezier(.2,.7,.2,1) both",
        blob: "blob 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
