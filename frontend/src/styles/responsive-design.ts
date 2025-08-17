// Responsive Design System for Travel Agency Website
// Mobile-first approach with progressive enhancement

export const RESPONSIVE_BREAKPOINTS = {
  // Mobile (default) - 320px to 767px
  mobile: {
    min: '320px',
    max: '767px',
    container: '100%',
    padding: '1rem',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
    spacing: {
      xs: '0.5rem',     // 8px
      sm: '1rem',       // 16px
      md: '1.5rem',     // 24px
      lg: '2rem',       // 32px
      xl: '3rem',       // 48px
    },
    grid: {
      columns: 1,
      gap: '1rem',
    },
    navigation: {
      height: '4rem',   // 64px
      fontSize: '0.875rem',
    },
    buttons: {
      height: '2.75rem', // 44px (touch-friendly)
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
    },
    cards: {
      padding: '1rem',
      borderRadius: '0.75rem',
    },
  },

  // Tablet - 768px to 1023px
  tablet: {
    min: '768px',
    max: '1023px',
    container: '90%',
    padding: '1.5rem',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.375rem',   // 22px
      '2xl': '1.75rem', // 28px
      '3xl': '2.25rem', // 36px
    },
    spacing: {
      xs: '0.75rem',    // 12px
      sm: '1.25rem',    // 20px
      md: '2rem',       // 32px
      lg: '3rem',       // 48px
      xl: '4rem',       // 64px
    },
    grid: {
      columns: 2,
      gap: '1.5rem',
    },
    navigation: {
      height: '5rem',   // 80px
      fontSize: '1rem',
    },
    buttons: {
      height: '3rem',   // 48px
      padding: '0.875rem 2rem',
      fontSize: '1rem',
    },
    cards: {
      padding: '1.5rem',
      borderRadius: '1rem',
    },
  },

  // Desktop - 1024px and above
  desktop: {
    min: '1024px',
    max: '100%',
    container: '1200px',
    padding: '2rem',
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.5rem',     // 24px
      '2xl': '2rem',    // 32px
      '3xl': '2.5rem',  // 40px
    },
    spacing: {
      xs: '1rem',       // 16px
      sm: '1.5rem',     // 24px
      md: '2.5rem',     // 40px
      lg: '4rem',       // 64px
      xl: '6rem',       // 96px
    },
    grid: {
      columns: 3,
      gap: '2rem',
    },
    navigation: {
      height: '5rem',   // 80px
      fontSize: '1rem',
    },
    buttons: {
      height: '3rem',   // 48px
      padding: '1rem 2.5rem',
      fontSize: '1rem',
    },
    cards: {
      padding: '2rem',
      borderRadius: '1.25rem',
    },
  },

  // Large Desktop - 1440px and above
  largeDesktop: {
    min: '1440px',
    max: '100%',
    container: '1400px',
    padding: '2.5rem',
    fontSize: {
      xs: '0.875rem',   // 14px
      sm: '1rem',       // 16px
      base: '1.125rem', // 18px
      lg: '1.25rem',    // 20px
      xl: '1.75rem',    // 28px
      '2xl': '2.25rem', // 36px
      '3xl': '3rem',    // 48px
    },
    spacing: {
      xs: '1.25rem',    // 20px
      sm: '2rem',       // 32px
      md: '3rem',       // 48px
      lg: '5rem',       // 80px
      xl: '8rem',       // 128px
    },
    grid: {
      columns: 4,
      gap: '2.5rem',
    },
    navigation: {
      height: '5.5rem', // 88px
      fontSize: '1.125rem',
    },
    buttons: {
      height: '3.25rem', // 52px
      padding: '1.125rem 3rem',
      fontSize: '1.125rem',
    },
    cards: {
      padding: '2.5rem',
      borderRadius: '1.5rem',
    },
  },
};

// Responsive utility functions
export const getResponsiveValue = (
  mobile: any,
  tablet?: any,
  desktop?: any,
  largeDesktop?: any
) => {
  return {
    base: mobile,
    md: tablet || mobile,
    lg: desktop || tablet || mobile,
    xl: largeDesktop || desktop || tablet || mobile,
  };
};

// Touch-friendly minimum sizes
export const TOUCH_TARGETS = {
  minimum: '44px', // Apple's recommended minimum
  comfortable: '48px', // Google's recommended minimum
  large: '56px', // For important actions
};

// Responsive image sizes
export const RESPONSIVE_IMAGES = {
  thumbnail: {
    mobile: '80px',
    tablet: '120px',
    desktop: '160px',
    largeDesktop: '200px',
  },
  card: {
    mobile: '200px',
    tablet: '300px',
    desktop: '400px',
    largeDesktop: '500px',
  },
  hero: {
    mobile: '100vh',
    tablet: '80vh',
    desktop: '70vh',
    largeDesktop: '60vh',
  },
  gallery: {
    mobile: '250px',
    tablet: '350px',
    desktop: '450px',
    largeDesktop: '550px',
  },
};

// Responsive typography scale
export const TYPOGRAPHY_SCALE = {
  display: {
    mobile: '2rem',
    tablet: '2.5rem',
    desktop: '3rem',
    largeDesktop: '3.5rem',
  },
  h1: {
    mobile: '1.75rem',
    tablet: '2.25rem',
    desktop: '2.75rem',
    largeDesktop: '3.25rem',
  },
  h2: {
    mobile: '1.5rem',
    tablet: '1.875rem',
    desktop: '2.25rem',
    largeDesktop: '2.75rem',
  },
  h3: {
    mobile: '1.25rem',
    tablet: '1.5rem',
    desktop: '1.875rem',
    largeDesktop: '2.25rem',
  },
  h4: {
    mobile: '1.125rem',
    tablet: '1.25rem',
    desktop: '1.5rem',
    largeDesktop: '1.875rem',
  },
  body: {
    mobile: '1rem',
    tablet: '1.125rem',
    desktop: '1.25rem',
    largeDesktop: '1.375rem',
  },
  small: {
    mobile: '0.875rem',
    tablet: '1rem',
    desktop: '1.125rem',
    largeDesktop: '1.25rem',
  },
};

// Responsive spacing utilities
export const SPACING_UTILS = {
  // Container padding
  containerPadding: getResponsiveValue('1rem', '1.5rem', '2rem', '2.5rem'),
  
  // Section spacing
  sectionSpacing: getResponsiveValue('3rem', '4rem', '6rem', '8rem'),
  
  // Component spacing
  componentSpacing: getResponsiveValue('1.5rem', '2rem', '2.5rem', '3rem'),
  
  // Grid gaps
  gridGap: getResponsiveValue('1rem', '1.5rem', '2rem', '2.5rem'),
  
  // Card padding
  cardPadding: getResponsiveValue('1rem', '1.5rem', '2rem', '2.5rem'),
};

// Responsive layout utilities
export const LAYOUT_UTILS = {
  // Container max widths
  containerMaxWidth: getResponsiveValue('100%', '90%', '1200px', '1400px'),
  
  // Grid columns
  gridColumns: getResponsiveValue(1, 2, 3, 4),
  
  // Navigation height
  navHeight: getResponsiveValue('4rem', '5rem', '5rem', '5.5rem'),
  
  // Button sizes
  buttonHeight: getResponsiveValue('2.75rem', '3rem', '3rem', '3.25rem'),
  buttonPadding: getResponsiveValue('0.75rem 1.5rem', '0.875rem 2rem', '1rem 2.5rem', '1.125rem 3rem'),
};

// Performance optimization for mobile
export const MOBILE_OPTIMIZATIONS = {
  // Image loading
  lazyLoading: true,
  progressiveLoading: true,
  
  // Animation performance
  reducedMotion: 'prefers-reduced-motion: reduce',
  
  // Touch interactions
  touchAction: 'manipulation',
  
  // Font loading
  fontDisplay: 'swap',
  
  // Critical CSS
  criticalCSS: true,
};

// Accessibility guidelines
export const ACCESSIBILITY_GUIDELINES = {
  // Color contrast ratios
  contrastRatios: {
    normal: 4.5, // WCAG AA
    large: 3.0,  // WCAG AA for large text
    enhanced: 7.0, // WCAG AAA
  },
  
  // Focus indicators
  focusVisible: true,
  focusRing: '2px solid #3b82f6',
  
  // Screen reader support
  ariaLabels: true,
  semanticHTML: true,
  
  // Keyboard navigation
  keyboardNavigation: true,
  tabIndex: 'logical',
};

// Export responsive design system
export const RESPONSIVE_DESIGN_SYSTEM = {
  breakpoints: RESPONSIVE_BREAKPOINTS,
  touchTargets: TOUCH_TARGETS,
  images: RESPONSIVE_IMAGES,
  typography: TYPOGRAPHY_SCALE,
  spacing: SPACING_UTILS,
  layout: LAYOUT_UTILS,
  mobile: MOBILE_OPTIMIZATIONS,
  accessibility: ACCESSIBILITY_GUIDELINES,
  getResponsiveValue,
};

export default RESPONSIVE_DESIGN_SYSTEM; 