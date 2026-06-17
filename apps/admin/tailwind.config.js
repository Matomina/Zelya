/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        z: {
          bg: '#07070F',
          surface: '#0D0C1E',
          card: '#12112B',
          raised: '#181733',
          violet: '#8B5CF6',
          'violet-light': '#A78BFA',
          text: '#F5F3FF',
          sub: '#C4C2E0',
          muted: '#9795B5',
          faint: '#5A5880',
          border: '#1E1B3A',
          online: '#00F590',
          gold: '#F59E0B',
          danger: '#EF4444',
          success: '#10B981',
        },
      },
    },
  },
  plugins: [],
}
