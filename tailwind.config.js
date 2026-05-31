/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        bg: '#060608',
        'text-primary': '#d4d4d8',
        'text-dim': '#52525b',
        'text-muted': '#3f3f46',
        border: '#1c1c20',
        'border-active': '#3e3e48',
      },
    },
  },
  plugins: [],
}
