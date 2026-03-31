import React from 'react';
import { usePackageDetailVariant } from '../../contexts/PackageDetailVariantContext';

const ICON_COLOR_CLASSES: Record<string, string> = {
  'emerald.500': 'text-emerald-600',
  'sky.500': 'text-sky-600',
  'teal.500': 'text-teal-600',
};

interface PackageSectionProps {
  title: string;
  icon?: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
}

function sectionSurfaceClass(cardStyle: string, layoutId: string): string {
  if (layoutId === 'editorial') {
    return 'rounded-3xl border border-editorial-espresso/[0.09] bg-white/85 p-7 shadow-editorial backdrop-blur-sm md:p-9';
  }
  switch (cardStyle) {
    case 'minimal':
      return 'rounded-2xl border-0 bg-transparent p-6 shadow-none';
    case 'soft':
      return 'rounded-2xl border border-editorial-espresso/[0.08] bg-editorial-sand/35 p-6 shadow-sm';
    case 'bordered':
      return 'rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-soft';
    default:
      return 'rounded-2xl border-0 bg-transparent p-6';
  }
}

export function PackageSection({
  title,
  icon: IconComponent,
  iconColor = 'sky.500',
  children,
}: PackageSectionProps) {
  const theme = usePackageDetailVariant();
  const surface = sectionSurfaceClass(theme.section.cardStyle, theme.id);
  const iconClass = ICON_COLOR_CLASSES[iconColor] ?? 'text-editorial-forest';
  const isEditorial = theme.id === 'editorial';

  return (
    <section
      className={`package-section-reveal ${surface} animate-fade-in`}
      style={{ fontFamily: theme.fonts.body }}
    >
      <h2
        className={`flex items-center gap-3 text-2xl font-semibold leading-tight text-editorial-espresso md:text-3xl ${
          isEditorial ? 'mb-7 border-b border-editorial-espresso/10 pb-5' : 'mb-6'
        }`}
        style={{ fontFamily: theme.fonts.heading }}
      >
        {IconComponent && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              isEditorial ? 'bg-editorial-sand/80 ring-1 ring-editorial-espresso/10' : ''
            }`}
          >
            <IconComponent className={`h-6 w-6 ${iconClass}`} aria-hidden />
          </span>
        )}
        <span className="min-w-0">{title}</span>
      </h2>
      {children}
    </section>
  );
}
