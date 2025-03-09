/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emergency-red': '#dc2626', // For urgent actions and alerts
        'emergency-blue': '#2563eb', // For primary actions
        'emergency-green': '#16a34a', // For success and safe states
        'emergency-dark': '#1f2937', // For dark backgrounds
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
}
