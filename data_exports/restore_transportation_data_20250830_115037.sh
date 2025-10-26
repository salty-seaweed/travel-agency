#!/bin/bash
# Transportation Data Restore Script
# Generated on: 2025-08-30 11:50:37

echo "🚛 Restoring Transportation Data..."

# Set Django settings for production
export DJANGO_SETTINGS_MODULE=travel_agency.settings_production

# Load each fixture file

echo "Loading transfer_types..."
python manage.py loaddata data_exports/transfer_types_20250830_115037.json

echo "Loading atoll_transfers..."
python manage.py loaddata data_exports/atoll_transfers_20250830_115037.json

echo "Loading resort_transfers..."
python manage.py loaddata data_exports/resort_transfers_20250830_115037.json

echo "Loading transfer_faqs..."
python manage.py loaddata data_exports/transfer_faqs_20250830_115037.json

echo "Loading transfer_contact_methods..."
python manage.py loaddata data_exports/transfer_contact_methods_20250830_115037.json

echo "Loading transfer_booking_steps..."
python manage.py loaddata data_exports/transfer_booking_steps_20250830_115037.json

echo "Loading transfer_benefits..."
python manage.py loaddata data_exports/transfer_benefits_20250830_115037.json

echo "Loading transfer_pricing_factors..."
python manage.py loaddata data_exports/transfer_pricing_factors_20250830_115037.json

echo "Loading transfer_content..."
python manage.py loaddata data_exports/transfer_content_20250830_115037.json

echo "Loading ferry_schedules..."
python manage.py loaddata data_exports/ferry_schedules_20250830_115037.json

echo "✅ Transportation data restore completed!"
echo "Total records restored: 86"
