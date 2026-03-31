import { SITE_FONT_BODY, SITE_FONT_HEADING } from './siteFonts';

export type PackageDetailVariant = 'editorial' | 'clean' | 'island' | 'minimal';

export interface PackageDetailVariantTheme {
  id: PackageDetailVariant;
  name: string;
  fonts: {
    heading: string;
    body: string;
  };
  hero: {
    fullBleed: boolean;
    borderRadius: string;
    overlayGradient: string;
  };
  section: {
    cardStyle: 'minimal' | 'bordered' | 'soft' | 'none';
    sectionBg: string;
    sectionBorder: string;
  };
  sidebar: {
    cardBg: string;
    cardBorder: string;
    cardShadow: string;
  };
  colors: {
    accent: string;
    accentHover: string;
    textPrimary: string;
    textSecondary: string;
  };
}

export const packageDetailVariants: Record<PackageDetailVariant, PackageDetailVariantTheme> = {
  editorial: {
    id: 'editorial',
    name: 'Editorial / Magazine',
    fonts: { heading: SITE_FONT_HEADING, body: SITE_FONT_BODY },
    hero: {
      fullBleed: true,
      borderRadius: '0',
      overlayGradient: 'linear(to-b, blackAlpha.300 0%, blackAlpha.800 70%, blackAlpha.900 100%)',
    },
    section: {
      cardStyle: 'minimal',
      sectionBg: 'transparent',
      sectionBorder: 'transparent',
    },
    sidebar: {
      cardBg: 'white',
      cardBorder: '1px solid',
      cardShadow: 'lg',
    },
    colors: {
      accent: 'gray.800',
      accentHover: 'gray.900',
      textPrimary: 'gray.900',
      textSecondary: 'gray.600',
    },
  },
  clean: {
    id: 'clean',
    name: 'Clean Booking',
    fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' },
    hero: {
      fullBleed: false,
      borderRadius: 'xl',
      overlayGradient: 'linear(to-b, blackAlpha.200 0%, blackAlpha.700 80%, blackAlpha.800 100%)',
    },
    section: {
      cardStyle: 'bordered',
      sectionBg: 'white',
      sectionBorder: '1px solid',
    },
    sidebar: {
      cardBg: 'white',
      cardBorder: '1px solid',
      cardShadow: 'sm',
    },
    colors: {
      accent: 'blue.600',
      accentHover: 'blue.700',
      textPrimary: 'gray.800',
      textSecondary: 'gray.600',
    },
  },
  island: {
    id: 'island',
    name: 'Island Paradise',
    fonts: { heading: SITE_FONT_HEADING, body: SITE_FONT_BODY },
    hero: {
      fullBleed: false,
      borderRadius: '2xl',
      overlayGradient: 'linear(to-b, blackAlpha.200 0%, blackAlpha.700 60%, blackAlpha.800 100%)',
    },
    section: {
      cardStyle: 'soft',
      sectionBg: 'sky.50',
      sectionBorder: '1px solid',
    },
    sidebar: {
      cardBg: 'white',
      cardBorder: '1px solid',
      cardShadow: 'md',
    },
    colors: {
      accent: 'teal.500',
      accentHover: 'teal.600',
      textPrimary: 'gray.800',
      textSecondary: 'gray.600',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal / Modern',
    fonts: { heading: SITE_FONT_HEADING, body: SITE_FONT_BODY },
    hero: {
      fullBleed: false,
      borderRadius: 'md',
      overlayGradient: 'linear(to-b, transparent 0%, blackAlpha.600 90%)',
    },
    section: {
      cardStyle: 'none',
      sectionBg: 'transparent',
      sectionBorder: 'transparent',
    },
    sidebar: {
      cardBg: 'white',
      cardBorder: '1px solid',
      cardShadow: 'none',
    },
    colors: {
      accent: 'gray.900',
      accentHover: 'black',
      textPrimary: 'gray.900',
      textSecondary: 'gray.500',
    },
  },
};

export function getActivePackageDetailVariant(): PackageDetailVariant {
  const env = import.meta.env.VITE_PACKAGE_DETAIL_VARIANT as string | undefined;
  if (env && (env === 'editorial' || env === 'clean' || env === 'island' || env === 'minimal')) {
    return env;
  }
  return 'editorial';
}
