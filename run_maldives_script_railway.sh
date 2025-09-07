#!/bin/bash
# Railway script to run the Maldives packages creation script

echo "🚂 Running Maldives Packages Script on Railway..."
echo "🔧 Environment: ${RAILWAY_ENVIRONMENT:-'Not set'}"
echo "🔧 Database: ${DATABASE_URL:-'Not set'}"

# Set Django settings for Railway production
export DJANGO_SETTINGS_MODULE="travel_agency.settings_minimal"

# Run the script
echo "🌺 Starting Maldives package creation..."
python add_maldives_packages_railway.py

echo "✅ Script execution completed!"
