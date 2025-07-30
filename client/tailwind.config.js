/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00f0ff',
        dark: '#0e0b15',
        alert: '#ff004d',
      },
      fontFamily: {
        cyber: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 15px #00f0ff',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0e0b15, #1a121f, #000)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        flicker: 'flicker 1.5s infinite',
      }

    }

  },
  plugins: [],
}
