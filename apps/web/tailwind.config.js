/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        z: {
          // Fonds
          bg:      '#07070F',
          surface: '#0D0C1E',
          card:    '#12112B',
          raised:  '#181733',
          // Violet principal
          violet:  '#8B5CF6',
          'violet-light': '#A78BFA',
          'violet-neon':  '#C084FC',
          'violet-deep':  '#6D28D9',
          // Textes
          text:    '#F5F3FF',
          sub:     '#C4C2E0',
          muted:   '#9795B5',
          faint:   '#5A5880',
          // Borders
          border:  '#1E1B3A',
          'border-glow': 'rgba(139,92,246,0.35)',
          // Statuts
          online:  '#00F590',
          gold:    '#F59E0B',
          danger:  '#EF4444',
          success: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 50%, #C084FC 100%)',
        'gradient-card':   'linear-gradient(180deg, rgba(18,17,43,0) 0%, rgba(18,17,43,0.95) 100%)',
        'gradient-hero':   'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(139,92,246,0.25) 0%, transparent 70%)',
        'gradient-glow':   'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(139,92,246,0.35)',
        'glow':     '0 0 25px rgba(139,92,246,0.45)',
        'glow-lg':  '0 0 50px rgba(139,92,246,0.35), 0 0 100px rgba(139,92,246,0.15)',
        'glow-neon':'0 0 15px rgba(192,132,252,0.7), 0 0 40px rgba(192,132,252,0.3)',
        'card':     '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(139,92,246,0.2)',
        'online':   '0 0 8px rgba(0,245,144,0.8)',
        'gold':     '0 0 12px rgba(245,158,11,0.5)',
      },
      animation: {
        'pulse-slow':  'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'fade-in':          'fadeIn 0.4s ease-out',
        'fade-in-scale':    'fadeInScale 0.4s ease-out',
        'slide-up':         'slideUp 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(139,92,246,0.6), 0 0 80px rgba(139,92,246,0.2)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
