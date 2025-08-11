module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Enhanced breakpoints for better responsive design
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },

      // Professional brand color palette
      colors: {
        // Primary brand colors (Ocean/Travel theme)
        brand: {
          50: '#f0f9ff',   // Very light blue
          100: '#e0f2fe',  // Light blue
          200: '#bae6fd',  // Lighter blue
          300: '#7dd3fc',  // Light blue
          400: '#38bdf8',  // Medium blue
          500: '#0ea5e9',  // Brand primary
          600: '#0284c7',  // Brand primary dark
          700: '#0369a1',  // Dark blue
          800: '#075985',  // Darker blue
          900: '#0c4a6e',  // Very dark blue
          950: '#082f49',  // Deepest blue
        },

        // Secondary colors (Sunset/Tropical theme)
        sunset: {
          50: '#fff7ed',   // Very light orange
          100: '#ffedd5',  // Light orange
          200: '#fed7aa',  // Lighter orange
          300: '#fdba74',  // Light orange
          400: '#fb923c',  // Medium orange
          500: '#f97316',  // Sunset primary
          600: '#ea580c',  // Sunset primary dark
          700: '#c2410c',  // Dark orange
          800: '#9a3412',  // Darker orange
          900: '#7c2d12',  // Very dark orange
          950: '#431407',  // Deepest orange
        },

        // Accent colors (Paradise/Nature theme)
        paradise: {
          50: '#ecfdf5',   // Very light green
          100: '#d1fae5',  // Light green
          200: '#a7f3d0',  // Lighter green
          300: '#6ee7b7',  // Light green
          400: '#34d399',  // Medium green
          500: '#10b981',  // Paradise primary
          600: '#059669',  // Paradise primary dark
          700: '#047857',  // Dark green
          800: '#065f46',  // Darker green
          900: '#064e3b',  // Very dark green
          950: '#022c22',  // Deepest green
        },

        // Neutral grays (Professional)
        neutral: {
          50: '#fafafa',   // Almost white
          100: '#f5f5f5',  // Very light gray
          200: '#e5e5e5',  // Light gray
          300: '#d4d4d4',  // Lighter gray
          400: '#a3a3a3',  // Medium gray
          500: '#737373',  // Gray
          600: '#525252',  // Dark gray
          700: '#404040',  // Darker gray
          800: '#262626',  // Very dark gray
          900: '#171717',  // Almost black
          950: '#0a0a0a',  // Black
        },

        // Semantic colors
        success: {
          50: '#f0fdf4',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },

      // Professional typography scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],         // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],      // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1' }],       // 72px
        '8xl': ['6rem', { lineHeight: '1.1' }],         // 96px
        '9xl': ['8rem', { lineHeight: '1.1' }],         // 128px
      },

      // Consistent spacing system (8px base)
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '6.5': '1.625rem',  // 26px
        '7.5': '1.875rem',  // 30px
        '8.5': '2.125rem',  // 34px
        '9.5': '2.375rem',  // 38px
        '15': '3.75rem',    // 60px
        '18': '4.5rem',     // 72px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
        '88': '22rem',      // 352px
        '128': '32rem',     // 512px
      },

      // Enhanced shadows for depth
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 50px 100px -20px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glass': '0 8px 32px 0 rgb(31 38 135 / 0.37)',
        'glow': '0 0 20px rgb(59 130 246 / 0.5)',
      },

      // Enhanced border radius
      borderRadius: {
        'none': '0px',
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        'full': '9999px',
      },

      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },

      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-5%)' },
        },
      },

      // Enhanced backdrop filters
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // Typography enhancements
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace'],
      },

      // Custom font weights
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },

      // Enhanced z-index scale
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Add any additional plugins here
  ],
} 