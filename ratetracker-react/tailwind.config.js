/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e62fe',
          hover: '#1450dc',
          light: '#e8f0fe',
          gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%)',
        },
        hero: {
          gradient: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
        },
        success: {
          DEFAULT: '#10b981',
          bg: '#ecfdf5',
          border: '#a7f3d0',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: '#fef2f2',
          border: '#fecaca',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: '#fffbeb',
        },
        text: {
          main: '#0f172a',
          secondary: '#475569',
          muted: '#94a3b8',
          white: '#ffffff',
        },
        bg: {
          page: '#f8fafc',
          card: '#ffffff',
          subtle: '#f1f5f9',
        },
        border: {
          subtle: '#e2e8f0',
          light: '#f1f5f9',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        lg: '0 10px 25px -3px rgba(15, 23, 42, 0.1), 0 4px 10px -4px rgba(15, 23, 42, 0.05)',
        blue: '0 8px 20px -4px rgba(30, 98, 254, 0.35)',
      },
      transitionDuration: {
        DEFAULT: '220ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        'xs': '420px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
}