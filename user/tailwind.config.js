/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      colors: {
        brandPink: '#C27B66', // Terracotta
        brandPurple: '#2D3A31', // Deep Forest Green
        brandCyan: '#8C9A84', // Sage Green
        brandBg: '#F9F8F4', // Warm Alabaster / Rice Paper
        botanicalBg: '#F9F8F4',
        botanicalFg: '#2D3A31',
        botanicalSage: '#8C9A84',
        botanicalClay: '#DCCFC2',
        botanicalStone: '#E6E2DA',
        botanicalTerracotta: '#C27B66',
        primary: {
          50: '#f4f6f4',
          100: '#e3eae3',
          200: '#cbdacb',
          300: '#a7c0a7',
          400: '#8c9a84', // Sage
          500: '#2d3a31', // Forest Green
          600: '#242f27',
          700: '#1c241e',
          800: '#151c17',
          900: '#0f1310',
          950: '#070a08'
        },
        accent: {
          400: '#d7a192',
          500: '#c27b66', // Terracotta
          600: '#a75e4a'
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px', // Standard Card: 24px
        '4xl': '32px',
        '5xl': '40px'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(99, 102, 241, 0.08)',
        'glass-lg': '0 16px 48px rgba(99, 102, 241, 0.12)',
        'glass-xl': '0 24px 64px rgba(99, 102, 241, 0.16)',
        'primary-glow': '0 4px 15px rgba(99, 102, 241, 0.3)',
        'primary-glow-lg': '0 8px 25px rgba(99, 102, 241, 0.4)'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 6s ease infinite'
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to: { opacity: '1', transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(2deg)' },
          '66%': { transform: 'translateY(-6px) rotate(-1deg)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)' }
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }
    }
  },
  plugins: []
};
