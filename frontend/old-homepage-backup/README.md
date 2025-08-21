# Old Homepage Backup

This folder contains the old homepage files that were replaced by the new experiences homepage.

## Files Moved

### Main Components
- `HomePage.tsx` - The original homepage component
- `HomepageSwitcher.tsx` - The homepage switcher component that allowed switching between old and new homepage

### Homepage Sections
- `homepage/` folder containing all the old homepage sections:
  - `HeroSection.tsx` - Original hero section
  - `FeaturesSection.tsx` - Original features section
  - `PropertiesSection.tsx` - Original properties section
  - `PackagesSection.tsx` - Original packages section
  - `TestimonialsSection.tsx` - Original testimonials section
  - `StatisticsSection.tsx` - Original statistics section
  - `CTASection.tsx` - Original call-to-action section

## What Changed

1. **New Default Homepage**: The new experiences homepage (`/src/components/experiences-homepage/`) is now the default homepage at route `/`
2. **Removed Switcher**: The homepage switcher component has been removed from the layout
3. **Old Route Removed**: The `/experiences` route has been removed since the new homepage is now the default
4. **Files Preserved**: All old homepage files are preserved in this backup folder for potential future reference

## Current Structure

- **Default Homepage**: `/src/components/experiences-homepage/HomePage.tsx`
- **Admin Homepage Management**: `/src/components/admin/homepage/` (still active for content management)
- **Old Homepage**: This backup folder (preserved but not routed)

## If You Need to Restore

To restore the old homepage, you would need to:
1. Move the files back to their original locations
2. Update the routing in `App.tsx`
3. Re-add the HomepageSwitcher to `Layout.tsx`
4. Update any imports that reference the old homepage

## Notes

- The admin homepage management components (`/src/components/admin/homepage/`) are still active and functional
- The new experiences homepage uses the same data hooks (`useHomepageData`, `useHomepageContent`) as the old homepage
- All functionality has been preserved, just with a new design and improved user experience
