# 🌐 External Database Access Guide

## Overview
This guide helps you set up external access to your Travel Agency database using ngrok, allowing you to access your website and database from other devices.

## Prerequisites

### 1. Install Ngrok
```bash
# Download from https://ngrok.com/
# Or use package manager:
# Windows: choco install ngrok
# macOS: brew install ngrok
# Linux: snap install ngrok
```

### 2. Sign up for Ngrok Account
1. Go to https://ngrok.com/
2. Create a free account
3. Get your authtoken
4. Configure ngrok: `ngrok config add-authtoken YOUR_TOKEN`

## Setup Steps

### Step 1: Configure Django Settings ✅
The settings have been updated to allow ngrok domains:
- `ALLOWED_HOSTS` includes ngrok domains
- `CORS_ALLOWED_ORIGINS` includes ngrok URLs
- `CORS_ALLOW_ALL_ORIGINS = True` for development

### Step 2: Start Django Server
```bash
# Start Django on all interfaces
python manage.py runserver 0.0.0.0:8000
```

### Step 3: Start Ngrok Tunnel
```bash
# Create tunnel to Django server
ngrok http 8000
```

### Step 4: Update Frontend Configuration
When ngrok starts, it will show a URL like:
```
https://abc123.ngrok-free.app
```

Update your frontend API configuration:

**File: `frontend/src/services/api.ts`**
```typescript
// Replace all instances of:
const BASE_URL = 'http://localhost:8000';

// With your ngrok URL:
const BASE_URL = 'https://abc123.ngrok-free.app';
```

### Step 5: Access from External Devices

#### Web Access:
- **Frontend**: `https://abc123.ngrok-free.app:5173`
- **Backend API**: `https://abc123.ngrok-free.app:8000`

#### Database Access:
The database (SQLite) is stored locally, but you can access it through:
- **Django Admin**: `https://abc123.ngrok-free.app:8000/admin/`
- **API Endpoints**: `https://abc123.ngrok-free.app:8000/api/`

## API Endpoints for External Access

### Properties
- `GET https://abc123.ngrok-free.app:8000/api/properties/`
- `GET https://abc123.ngrok-free.app:8000/api/properties/{id}/`

### Packages
- `GET https://abc123.ngrok-free.app:8000/api/packages/`
- `GET https://abc123.ngrok-free.app:8000/api/packages/{id}/`

### Locations
- `GET https://abc123.ngrok-free.app:8000/api/locations/`
- `POST https://abc123.ngrok-free.app:8000/api/locations/` (Admin only)

### Admin Access
- **Login**: `https://abc123.ngrok-free.app:8000/api/admin/login/`
- **Admin Panel**: `https://abc123.ngrok-free.app:8000/admin/`

## Troubleshooting

### Common Issues:

#### 1. CORS Errors
```bash
# Check if CORS is properly configured
# The settings should include ngrok domains
```

#### 2. Connection Refused
```bash
# Make sure Django is running on 0.0.0.0:8000
python manage.py runserver 0.0.0.0:8000
```

#### 3. Ngrok URL Changes
- Free ngrok URLs change each time you restart
- Update your frontend configuration with the new URL

#### 4. Database Access
- SQLite database is local to your machine
- Access through Django admin or API endpoints
- For remote database access, consider PostgreSQL

## Security Considerations

### Development Only:
- `DEBUG = True` should only be used in development
- `CORS_ALLOW_ALL_ORIGINS = True` is for development only
- Remove these settings for production

### Production Setup:
1. Use a proper domain name
2. Set up SSL certificates
3. Configure proper CORS settings
4. Use environment variables for sensitive data

## Quick Commands

### Start Everything:
```bash
# Terminal 1: Start Django
python manage.py runserver 0.0.0.0:8000

# Terminal 2: Start ngrok
ngrok http 8000

# Terminal 3: Start frontend (if needed)
cd frontend && npm run dev
```

### Check Status:
```bash
# Check ngrok tunnels
curl http://localhost:4040/api/tunnels

# Check Django server
curl http://localhost:8000/api/properties/
```

## Database Management

### View Database:
```bash
# Access Django admin
# URL: https://your-ngrok-url:8000/admin/

# Or use Django shell
python manage.py shell
```

### Backup Database:
```bash
# Create backup
python manage.py dumpdata > backup.json

# Restore backup
python manage.py loaddata backup.json
```

## External Device Testing

### Mobile/Tablet:
1. Get the ngrok URL from your computer
2. Open browser on mobile device
3. Navigate to: `https://your-ngrok-url:5173`
4. Test all functionality

### Other Computers:
1. Share the ngrok URL with other devices
2. Access via web browser
3. Test admin panel and API endpoints

## Notes

- **Free ngrok**: URLs change on restart, limited connections
- **Paid ngrok**: Fixed URLs, more connections
- **Database**: SQLite is local, consider cloud database for production
- **Security**: This setup is for development only

## Support

If you encounter issues:
1. Check ngrok status: `http://localhost:4040`
2. Check Django logs for errors
3. Verify CORS settings
4. Test with curl commands 