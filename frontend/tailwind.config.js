/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drivora: {
          950: '#090D16', // Sharp Black Accent
          900: '#0F172A', // Jet Black / Dark Slate
          850: '#1E293B',
          800: '#334155',
          700: '#475569',
          600: '#64748B',
          500: '#2563EB', // Royal Electric Blue
          400: '#38BDF8', // Cyan Highlight
          300: '#60A5FA',
          200: '#BFDBFE',
          100: '#DBEAFE',
          50: '#EFF6FF',
        },
        luxury: {
          black: '#090D16',
          dark: '#0F172A',
          blue: '#1D4ED8',
          royal: '#2563EB',
          sky: '#0284C7',
          gray: '#F8FAFC',
          border: '#E2E8F0',
          borderHover: '#93C5FD',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 20px 40px -8px rgba(37, 99, 235, 0.14), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        'glow-blue': '0 4px 20px rgba(37, 99, 235, 0.35)',
        'glow-sm': '0 2px 10px rgba(37, 99, 235, 0.25)',
        'float': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
      },
      backgroundImage: {
        'subtle-grid': 'radial-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(circle at 50% 0%, var(--tw-gradient-stops))',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
