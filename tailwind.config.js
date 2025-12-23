/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'n8n-bg': '#1a1a2e',
        'n8n-surface': '#16213e',
        'n8n-card': '#0f3460',
        'n8n-accent': '#e94560',
        'n8n-green': '#00ff9d',
        'n8n-blue': '#00d4ff',
        'n8n-purple': '#9d4edd',
        'n8n-orange': '#ff6b35',
        'n8n-yellow': '#ffc300',
      },
    },
  },
  plugins: [],
}
