/**
 * Thread Travels Design System
 * Consistent design tokens, component variants, and utilities
 */

// Design Tokens
export const designTokens = {
  // Spacing scale (8px base)
  spacing: {
    none: '0',
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },

  // Typography scale
  typography: {
    // Headings
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl font-bold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold tracking-tight',
    h4: 'text-xl md:text-2xl font-semibold',
    h5: 'text-lg md:text-xl font-semibold',
    h6: 'text-base md:text-lg font-semibold',

    // Body text
    'body-xl': 'text-xl leading-relaxed',
    'body-lg': 'text-lg leading-relaxed',
    body: 'text-base leading-relaxed',
    'body-sm': 'text-sm leading-relaxed',

    // Display text
    display: 'text-5xl md:text-6xl lg:text-7xl font-black tracking-tight',
    'display-sm': 'text-4xl md:text-5xl font-black tracking-tight',

    // Utility text
    caption: 'text-sm text-neutral-600',
    overline: 'text-xs font-semibold uppercase tracking-wide text-neutral-500',
    label: 'text-sm font-medium text-neutral-700',
  },

  // Color system
  colors: {
    // Primary brand colors
    primary: {
      light: 'bg-brand-100 text-brand-700',
      default: 'bg-brand-500 text-white',
      dark: 'bg-brand-700 text-white',
    },

    // Secondary colors
    secondary: {
      light: 'bg-sunset-100 text-sunset-700',
      default: 'bg-sunset-500 text-white',
      dark: 'bg-sunset-700 text-white',
    },

    // Accent colors
    accent: {
      light: 'bg-paradise-100 text-paradise-700',
      default: 'bg-paradise-500 text-white',
      dark: 'bg-paradise-700 text-white',
    },

    // Neutral colors
    neutral: {
      light: 'bg-neutral-100 text-neutral-700',
      default: 'bg-neutral-200 text-neutral-800',
      dark: 'bg-neutral-800 text-neutral-100',
    },

    // Semantic colors
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    error: 'bg-error-500 text-white',
    info: 'bg-info-500 text-white',
  },

  // Border radius
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    default: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-3xl',
    full: 'rounded-full',
  },

  // Shadows
  shadows: {
    none: 'shadow-none',
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    default: 'shadow-md',
    md: 'shadow-lg',
    lg: 'shadow-xl',
    xl: 'shadow-2xl',
    glass: 'shadow-glass',
    glow: 'shadow-glow',
  },
} as const;

// Component Variants
export const componentVariants = {
  // Button variants
  button: {
    // Sizes
    sizes: {
      xs: 'px-3 py-1.5 text-xs',
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    },

    // Variants
    variants: {
      primary: `
        bg-gradient-to-r from-brand-500 to-brand-600 
        text-white font-semibold
        hover:from-brand-600 hover:to-brand-700
        focus:ring-4 focus:ring-brand-200
        active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `,
      secondary: `
        bg-gradient-to-r from-sunset-500 to-sunset-600 
        text-white font-semibold
        hover:from-sunset-600 hover:to-sunset-700
        focus:ring-4 focus:ring-sunset-200
        active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `,
      accent: `
        bg-gradient-to-r from-paradise-500 to-paradise-600 
        text-white font-semibold
        hover:from-paradise-600 hover:to-paradise-700
        focus:ring-4 focus:ring-paradise-200
        active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `,
      green: `
        bg-gradient-to-r from-green-500 to-green-600 
        text-white font-semibold
        hover:from-green-600 hover:to-green-700
        focus:ring-4 focus:ring-green-200
        active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `,
      outline: `
        border-2 border-neutral-300 bg-transparent 
        text-neutral-700 font-semibold
        hover:bg-neutral-50 hover:border-neutral-400
        focus:ring-4 focus:ring-neutral-200
        active:scale-95
        transition-all duration-200
      `,
      ghost: `
        bg-transparent text-neutral-600 font-medium
        hover:bg-neutral-100 hover:text-neutral-800
        focus:ring-4 focus:ring-neutral-200
        active:scale-95
        transition-all duration-200
      `,
      danger: `
        bg-gradient-to-r from-error-500 to-error-600 
        text-white font-semibold
        hover:from-error-600 hover:to-error-700
        focus:ring-4 focus:ring-error-200
        active:scale-95
        transition-all duration-200
        shadow-lg hover:shadow-xl
      `,
    },
  },

  // Card variants
  card: {
    variants: {
      default: `
        bg-white rounded-xl border border-neutral-200
        shadow-md hover:shadow-lg
        transition-all duration-300
      `,
      elevated: `
        bg-white rounded-xl border border-neutral-200
        shadow-lg hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
      `,
      glass: `
        bg-white/80 backdrop-blur-md rounded-xl 
        border border-white/20 shadow-glass
        hover:bg-white/90
        transition-all duration-300
      `,
      bordered: `
        bg-white rounded-xl border-2 border-neutral-200
        hover:border-brand-300 hover:shadow-md
        transition-all duration-300
      `,
    },
  },

  // Input variants
  input: {
    variants: {
      default: `
        w-full px-4 py-3 rounded-lg border border-neutral-300
        bg-white text-neutral-900 placeholder-neutral-500
        focus:ring-4 focus:ring-brand-200 focus:border-brand-500
        transition-all duration-200
      `,
      error: `
        w-full px-4 py-3 rounded-lg border border-error-300
        bg-white text-neutral-900 placeholder-neutral-500
        focus:ring-4 focus:ring-error-200 focus:border-error-500
        transition-all duration-200
      `,
      success: `
        w-full px-4 py-3 rounded-lg border border-success-300
        bg-white text-neutral-900 placeholder-neutral-500
        focus:ring-4 focus:ring-success-200 focus:border-success-500
        transition-all duration-200
      `,
    },
  },

  // Badge variants
  badge: {
    sizes: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    },
    variants: {
      primary: 'bg-brand-100 text-brand-700 border border-brand-200',
      secondary: 'bg-sunset-100 text-sunset-700 border border-sunset-200',
      accent: 'bg-paradise-100 text-paradise-700 border border-paradise-200',
      neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
      success: 'bg-success-100 text-success-700 border border-success-200',
      warning: 'bg-warning-100 text-warning-700 border border-warning-200',
      error: 'bg-error-100 text-error-700 border border-error-200',
    },
  },
} as const;

// Layout patterns
export const layoutPatterns = {
  // Container patterns
  container: {
    sm: 'max-w-2xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-4 sm:px-6',
    lg: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    xl: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  },

  // Grid patterns
  grid: {
    responsive: `
      grid grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      gap-4 sm:gap-6 lg:gap-8
    `,
    cards: `
      grid grid-cols-1 
      md:grid-cols-2 
      xl:grid-cols-3 
      gap-6 lg:gap-8
    `,
    features: `
      grid grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-8 lg:gap-12
    `,
  },

  // Section patterns
  section: {
    default: 'py-16 lg:py-24',
    sm: 'py-12 lg:py-16',
    lg: 'py-20 lg:py-32',
    hero: 'py-24 lg:py-32 xl:py-40',
  },

  // Flex patterns
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center',
    wrap: 'flex flex-wrap',
  },
} as const;

// Animation patterns
export const animationPatterns = {
  // Entrance animations
  entrance: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    scaleIn: 'animate-scale-in',
  },

  // Hover animations
  hover: {
    scale: 'hover:scale-105 transition-transform duration-200',
    lift: 'hover:-translate-y-1 transition-transform duration-200',
    glow: 'hover:shadow-glow transition-shadow duration-200',
    rotate: 'hover:rotate-6 transition-transform duration-200',
  },

  // Focus animations
  focus: {
    ring: 'focus:ring-4 focus:ring-brand-200 focus:outline-none',
    scale: 'focus:scale-105 transition-transform duration-200',
    glow: 'focus:shadow-glow transition-shadow duration-200',
  },

  // Loading animations
  loading: {
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    float: 'animate-float',
  },
} as const;

// Utility functions for combining styles
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper functions for component styling
export const getButtonClasses = (
  variant: keyof typeof componentVariants.button.variants = 'primary',
  size: keyof typeof componentVariants.button.sizes = 'md'
): string => {
  return cn(
    componentVariants.button.variants[variant],
    componentVariants.button.sizes[size],
    designTokens.radius.lg,
    'inline-flex items-center justify-center gap-2',
    'font-medium',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform active:scale-95',
    'transition-all duration-200'
  );
};

export const getCardClasses = (
  variant: keyof typeof componentVariants.card.variants = 'default'
): string => {
  return componentVariants.card.variants[variant];
};

export const getInputClasses = (
  variant: keyof typeof componentVariants.input.variants = 'default'
): string => {
  return componentVariants.input.variants[variant];
};

export const getBadgeClasses = (
  variant: keyof typeof componentVariants.badge.variants = 'neutral',
  size: keyof typeof componentVariants.badge.sizes = 'md'
): string => {
  return cn(
    componentVariants.badge.variants[variant],
    componentVariants.badge.sizes[size],
    designTokens.radius.md,
    'inline-flex items-center font-medium'
  );
};

// Export everything as default for convenience
export default {
  tokens: designTokens,
  variants: componentVariants,
  layouts: layoutPatterns,
  animations: animationPatterns,
  cn,
  getButtonClasses,
  getCardClasses,
  getInputClasses,
  getBadgeClasses,
}; 