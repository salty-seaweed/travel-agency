# Maldives Travel Agency Website - Project Plan

## Objective
A scalable travel agency website for the Maldives, allowing tourists to browse properties (guesthouses, hotels, etc.), view package deals, and book via WhatsApp. The site will be visually appealing, admin-manageable, and ready for future expansion (in-site booking, more property types, etc.).

## Core Features
- Browse properties (guesthouses, hotels; scalable to more types)
- Browse and highlight package deals
- WhatsApp-based booking (for now)
- Reviews and ratings for properties (admin-moderated)
- Search and filter by type, price, amenities, rating, island, etc.
- Featured properties and packages
- Responsive, modern UI (inspired by Bookmundi & Booking.com)
- Interactive map of Maldives with property markers (OpenStreetMap)
- Contact and FAQ pages
- SEO and social sharing

## Admin Features
- Secure login (single admin for now)
- Robust custom admin panel (React-based, not just Django admin)
- CRUD for properties, images, packages, reviews, categories, amenities, locations
- Image management (multiple per property, featured image)
- Map location management (lat/lon per property)
- Review moderation
- Analytics dashboard (see below)

## Technical Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Django, Django REST Framework
- **Map:** OpenStreetMap (react-leaflet)
- **Media:** Local for dev, S3 or similar for production

## Analytics & Dashboard Features (Suggestions)
- Property views (most viewed, trends)
- Booking inquiries (WhatsApp clicks per property)
- Review statistics (average rating, most reviewed)
- Package deal performance (views, inquiries)
- User engagement (time on site, bounce rate - via Google Analytics integration)
- Map heatmap (where most properties are located)
- Admin activity log (who changed what, when)

## Decisions
- **Admin Panel:** Separate login area within the same React app (not a separate app) for simplicity and maintainability.
- **Map:** Use OpenStreetMap (react-leaflet) for property display.
- **Branding:** Temporary color scheme and logo for now; real branding to be added later.
- **Initial Data:** Use placeholders for properties and images; real data to be added later.

## Open Questions
- Should reviews be open to all or only after WhatsApp booking? (For now: open, admin-moderated)
- Any specific amenities or property details to track? (e.g., pool, WiFi, meal plans)

---

*This file is maintained as the single source of truth for project requirements and decisions. Update as needed throughout development.* 