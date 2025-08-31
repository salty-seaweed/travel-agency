#!/bin/bash
echo "🚀 Starting Railway deployment..."
echo "🔧 PORT: $PORT"
echo "🔧 DJANGO_SETTINGS_MODULE: $DJANGO_SETTINGS_MODULE"

export DJANGO_SETTINGS_MODULE="travel_agency.settings_minimal"
echo "✅ Set DJANGO_SETTINGS_MODULE to: $DJANGO_SETTINGS_MODULE"

echo "🔧 Running migrations..."
python manage.py migrate

echo "🔧 Collecting static files..."
python manage.py collectstatic --noinput

echo "🚀 Starting Gunicorn..."
exec gunicorn travel_agency.wsgi:application --bind 0.0.0.0:$PORT --workers 1 --timeout 30
