# Thread Global Travels - Outbound Frontend

This is the React frontend application for the outbound travel platform at `local.threadtravels.com`.

## Architecture Overview

- **Domain**: `local.threadtravels.com`
- **Backend**: Shared with main Thread Travels & Tours Django backend
- **Purpose**: Serve locals who want to travel abroad to international destinations

## Setup

1. Install dependencies:
   ```bash
   cd frontend-outbound
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Key Differences from Main Site

- **Branding**: "Thread Global Travels - Your World Awaits"
- **Target Audience**: Maldivian locals traveling abroad
- **Destinations**: International locations (not Maldives)
- **UI Focus**: Outbound travel features, visa info, international packages

## Shared Backend Services

This frontend connects to the same Django backend as the main site, utilizing:
- User authentication
- Package management (filtered for outbound)
- Booking system
- Payment processing
- Admin panel

## Deployment

- Served from `local.threadtravels.com` subdomain
- Built files deployed to Django static files or CDN
- Shares backend infrastructure with main site
