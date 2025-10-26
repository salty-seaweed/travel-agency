# Package Detail Components

This directory contains modular components for the package details page, making it more maintainable and following best practices.

## Components Overview

### Core Components

1. **PackageHero** (`PackageHero.tsx`)
   - Hero section with package image, title, and booking card
   - Enhanced visual design with better typography and spacing
   - Responsive layout with mobile optimization

2. **PackageImageGallery** (`PackageImageGallery.tsx`)
   - Interactive image gallery with lightbox functionality
   - Thumbnail navigation and keyboard controls
   - Responsive grid layout

3. **PackageOverview** (`PackageOverview.tsx`)
   - Package description and highlights
   - Quick facts with visual icons
   - Expandable/collapsible content

4. **PackageItinerary** (`PackageItinerary.tsx`)
   - Interactive timeline for daily itinerary
   - Expandable day details with activities and meals
   - Visual timeline with day numbers

5. **PackageSidebar** (`PackageSidebar.tsx`)
   - Sticky sidebar with pricing and booking options
   - Quick facts and tour information
   - Contact information and help options

### Feature Components

6. **PackageActivities** (`PackageActivities.tsx`)
   - Grid layout for activities and experiences
   - Difficulty levels and pricing information
   - Included vs optional activity indicators

7. **PackageDestinations** (`PackageDestinations.tsx`)
   - Destination cards with highlights and activities
   - Duration information for each destination
   - Visual location indicators

8. **PackageInclusions** (`PackageInclusions.tsx`)
   - What's included/excluded breakdown
   - Color-coded categories (included, excluded, optional)
   - Detailed item descriptions

9. **PackageImportantInfo** (`PackageImportantInfo.tsx`)
   - Weather and best time to visit
   - What to bring checklist
   - Booking terms and policies

## Usage

### Basic Usage

```tsx
import {
  PackageHero,
  PackageImageGallery,
  PackageOverview,
  PackageItinerary,
  PackageSidebar,
  PackageActivities,
  PackageDestinations,
  PackageInclusions,
  PackageImportantInfo
} from './package';

// In your main component
<PackageHero 
  package={packageData}
  onBookNow={handleBookNow}
  onWhatsAppInquiry={handleWhatsAppInquiry}
/>
```

### Component Props

Each component accepts specific props:

- **PackageHero**: `package`, `onBookNow`, `onWhatsAppInquiry`
- **PackageImageGallery**: `images`, `packageName`
- **PackageOverview**: `package`
- **PackageItinerary**: `itinerary`
- **PackageSidebar**: `package`, `onBookNow`, `onWhatsAppInquiry`, `whatsappNumber`
- **PackageActivities**: `activities`
- **PackageDestinations**: `destinations`
- **PackageInclusions**: `inclusions`
- **PackageImportantInfo**: `package`

## Benefits of Modular Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be used in other parts of the application
3. **Testing**: Easier to write unit tests for individual components
4. **Performance**: Better code splitting and lazy loading
5. **Team Collaboration**: Multiple developers can work on different components
6. **Code Organization**: Clear separation of concerns

## Styling

All components use Tailwind CSS classes and follow a consistent design system:
- Rounded corners: `rounded-2xl`
- Shadows: `shadow-sm`, `shadow-lg`
- Colors: Blue theme with green accents
- Spacing: Consistent 8-point grid system

## Responsive Design

Components are designed to be fully responsive:
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interactions
- Proper spacing on all screen sizes

## Accessibility

Components include:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Future Enhancements

Potential improvements:
- Virtual tours integration
- 360° image support
- Package comparison features
- Social sharing functionality
- Review integration
- Related packages suggestions
