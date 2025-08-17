import React, { forwardRef } from 'react';
import { getCardClasses, cn } from '../../styles/design-system';

// Base Card component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}, ref) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      ref={ref}
      className={cn(
        getCardClasses(variant),
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('mb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card Title
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  as: Component = 'h3',
  className,
  children,
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn(
      'text-xl font-semibold text-neutral-900 leading-tight',
      className
    )}
    {...props}
  >
    {children}
  </Component>
));

CardTitle.displayName = 'CardTitle';

// Card Subtitle
export interface CardSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-neutral-600 mt-1',
      className
    )}
    {...props}
  >
    {children}
  </p>
));

CardSubtitle.displayName = 'CardSubtitle';

// Card Content
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('mb-4', className)}
    {...props}
  >
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

// Card Description
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  clamp?: number; // Number of lines to clamp
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  className,
  clamp,
  children,
  ...props
}, ref) => {
  const clampClasses = clamp ? {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
    5: 'line-clamp-5',
    6: 'line-clamp-6',
  }[clamp] : '';

  return (
    <p
      ref={ref}
      className={cn(
        'text-neutral-600 leading-relaxed',
        clampClasses,
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

// Card Image
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export const CardImage = forwardRef<HTMLImageElement, CardImageProps>(({
  src,
  alt,
  aspectRatio = 'photo',
  objectFit = 'cover',
  className,
  ...props
}, ref) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    photo: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <div className={cn('overflow-hidden rounded-t-xl', aspectClasses[aspectRatio])}>
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(
          'w-full h-full transition-transform duration-300 hover:scale-105',
          objectFitClasses[objectFit],
          className
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
});

CardImage.displayName = 'CardImage';

// Card Footer
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between pt-4 border-t border-neutral-200',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Card Actions
export interface CardActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
}

export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(({
  direction = 'horizontal',
  spacing = 'md',
  className,
  children,
  ...props
}, ref) => {
  const directionClasses = {
    horizontal: 'flex items-center',
    vertical: 'flex flex-col',
  };

  const spacingClasses = {
    sm: direction === 'horizontal' ? 'gap-2' : 'gap-1',
    md: direction === 'horizontal' ? 'gap-3' : 'gap-2',
    lg: direction === 'horizontal' ? 'gap-4' : 'gap-3',
  };

  return (
    <div
      ref={ref}
      className={cn(
        directionClasses[direction],
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

CardActions.displayName = 'CardActions';

// Card Badge (for status, featured, etc.)
export interface CardBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const CardBadge = forwardRef<HTMLSpanElement, CardBadgeProps>(({
  variant = 'primary',
  position = 'top-right',
  className,
  children,
  ...props
}, ref) => {
  const variantClasses = {
    primary: 'bg-brand-500 text-white',
    secondary: 'bg-sunset-500 text-white',
    accent: 'bg-paradise-500 text-white',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    error: 'bg-error-500 text-white',
  };

  const positionClasses = {
    'top-left': 'absolute top-2 left-2',
    'top-right': 'absolute top-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
    'bottom-right': 'absolute bottom-2 right-2',
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold',
        variantClasses[variant],
        positionClasses[position],
        'shadow-lg z-10',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

CardBadge.displayName = 'CardBadge';

// Compound exports for better organization
const CardWithSubComponents = Card as typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Subtitle: typeof CardSubtitle;
  Content: typeof CardContent;
  Description: typeof CardDescription;
  Image: typeof CardImage;
  Footer: typeof CardFooter;
  Actions: typeof CardActions;
  Badge: typeof CardBadge;
};

CardWithSubComponents.Header = CardHeader;
CardWithSubComponents.Title = CardTitle;
CardWithSubComponents.Subtitle = CardSubtitle;
CardWithSubComponents.Content = CardContent;
CardWithSubComponents.Description = CardDescription;
CardWithSubComponents.Image = CardImage;
CardWithSubComponents.Footer = CardFooter;
CardWithSubComponents.Actions = CardActions;
CardWithSubComponents.Badge = CardBadge;

export default Card; 