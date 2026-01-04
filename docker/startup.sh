#!/bin/bash
set -e
echo "🚀 Starting Railway deployment..."

# Handle media directory permissions (Railway volume mounting)
echo "📁 Setting up media directory..."
mkdir -p /app/media

# Try to set permissions, but don't fail if volume is mounted
chmod 755 /app/media 2>/dev/null || {
    echo "⚠️  Could not set media permissions (volume mounted)"
    echo "📂 Trying alternative: chmod a+X /app"
    chmod a+X /app 2>/dev/null || echo "⚠️  Parent directory permissions failed"
    echo "🔧 Setting directory permissions recursively..."
    /bin/sh -c "find /app -type d -exec chmod a+X {} \;" 2>/dev/null || echo "⚠️  Directory permissions failed"
}

# Run migrations
echo "📦 Running database migrations..."
python manage.py migrate --verbosity=1

# Collect static files
echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput --clear --verbosity=1

# Populate gallery media if source files are available (idempotent - only runs if gallery is empty)
echo "📸 Checking gallery media..."
if [ -d "/app/gallery_source" ] && [ "$(ls -A /app/gallery_source 2>/dev/null)" ]; then
    echo "🎨 Populating gallery media from source files..."
    python manage.py populate_gallery_media || echo "⚠️  Gallery population failed or skipped (this is OK if gallery already has items)"
else
    echo "ℹ️  Gallery source files not found, skipping gallery population"
fi

# Start gunicorn
echo "🌐 Starting Gunicorn server..."
exec gunicorn travel_agency.wsgi:application \
  --bind "0.0.0.0:${PORT:-8000}" \
  --workers 3 \
  --worker-class gevent \
  --worker-connections 1000 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --access-logfile - \
  --error-logfile - \
  --log-level info \
  --timeout 30 \
  --keep-alive 10
