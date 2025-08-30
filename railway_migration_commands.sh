#!/bin/bash
# Railway Database Migration Commands
# Run these in Railway's console or via railway CLI

echo "🚂 Starting Railway Database Migration..."

# 1. Apply Django migrations (create tables)
echo "📋 Creating database tables..."
python manage.py migrate

# 2. Create superuser (admin)
echo "👤 Creating admin user..."
python manage.py createsuperuser --noinput --username admin --email admin@yourdomain.com || echo "Admin user already exists"

# 3. Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

# 4. Populate transportation data
echo "🚛 Loading transportation data..."
python manage.py populate_transportation_data

# 5. Populate ferry schedules
echo "⛴️ Loading ferry schedules..."
python manage.py populate_ferry_schedules

# 6. Populate other data
echo "🏝️ Loading destinations..."
python manage.py populate_destinations

echo "🎯 Loading experiences..."
python manage.py populate_experiences

echo "🌐 Loading languages..."
python manage.py populate_languages

echo "🏠 Loading homepage data..."
python manage.py populate_homepage_data

# 7. Update destination counts
echo "📊 Updating destination counts..."
python manage.py update_destination_counts

# 8. Verify data integrity
echo "✅ Verifying migration..."
python manage.py shell -c "
from api.models import TransferType, FerrySchedule, AtollTransfer
print(f'✅ Transfer Types: {TransferType.objects.count()}')
print(f'✅ Ferry Schedules: {FerrySchedule.objects.count()}')
print(f'✅ Atoll Transfers: {AtollTransfer.objects.count()}')
print('🎉 Migration completed successfully!')
"

echo "🚀 Railway migration complete! Your travel agency is live!"
