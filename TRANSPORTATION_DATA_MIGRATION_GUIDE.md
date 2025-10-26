# 🚛 Transportation Data Migration Guide

## Overview
This guide ensures all your transportation data (ferry schedules, transfer types, resort transfers, etc.) is properly migrated to your production environment when hosting your travel agency website.

## 📊 Data Export Summary
Your transportation database contains **86 records** across 10 different models:

| Data Type | Records | Description |
|-----------|---------|-------------|
| Transfer Types | 4 | Speedboat, Ferry, Seaplane, Domestic Flight |
| Atoll Transfers | 6 | Male, Baa, Ari, Lhaviyani, Vaavu, Meemu |
| Resort Transfers | 30 | Specific resort transfer options |
| Ferry Schedules | 15 | Complete ferry timetables |
| Transfer FAQs | 8 | Common questions and answers |
| Contact Methods | 3 | WhatsApp, Phone, Email |
| Booking Steps | 4 | Step-by-step booking process |
| Benefits | 4 | Service benefits and features |
| Pricing Factors | 5 | What affects transfer pricing |
| Content Sections | 7 | Page content and descriptions |

## 🚀 Migration Methods

### Method 1: Automated Production Migration (Recommended)
```bash
# Copy migration script to production server
scp production_data_migration.py user@your-server:/path/to/app/

# Run on production server
python production_data_migration.py
```

This script:
- ✅ Verifies production environment
- ✅ Runs database migrations
- ✅ Populates all transportation data
- ✅ Creates admin user
- ✅ Verifies data integrity
- ✅ Provides deployment checklist

### Method 2: Manual Django Fixtures
```bash
# Copy exported data to production
scp -r data_exports/ user@your-server:/path/to/app/

# On production server, run management commands
python manage.py populate_transportation_data
python manage.py populate_ferry_schedules
python manage.py populate_languages
python manage.py populate_destinations
python manage.py populate_experiences
```

### Method 3: Django Fixtures Import
```bash
# Using the generated fixture files
python manage.py loaddata data_exports/transfer_types_20250830_115037.json
python manage.py loaddata data_exports/atoll_transfers_20250830_115037.json
python manage.py loaddata data_exports/resort_transfers_20250830_115037.json
# ... continue for all fixture files
```

### Method 4: SQL Database Backup
```bash
# Create backup tables (on production database)
psql -U username -d database < data_exports/backup_transportation_data_20250830_115037.sql
```

## 🔧 Environment Setup

### Production Environment Variables
Make sure these are set in your production environment:
```bash
# Required for data migration
SECRET_KEY=your-production-secret-key
DEBUG=False
DJANGO_SETTINGS_MODULE=travel_agency.settings_production

# Database connection
DB_ENGINE=django.db.backends.postgresql
DB_NAME=travel_agency_prod
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=5432

# Admin user (optional - will be created during migration)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

## 📋 Pre-Migration Checklist

- [ ] **Database Ready**: PostgreSQL database created and accessible
- [ ] **Environment Variables**: All required env vars set
- [ ] **Django Settings**: Production settings configured
- [ ] **Backup**: Current production database backed up
- [ ] **Testing**: Migration tested on staging environment
- [ ] **Dependencies**: All Python packages installed

## 🚀 Railway Deployment (Recommended Platform)

### 1. Setup Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

### 2. Add Environment Variables in Railway Dashboard
```
SECRET_KEY=your-production-secret-key
DEBUG=False
DJANGO_SETTINGS_MODULE=travel_agency.settings_production
DOMAIN_NAME=yourdomain.com
```

### 3. Add PostgreSQL Database
- In Railway dashboard: "New" → "Database" → "PostgreSQL"
- Railway automatically sets `DATABASE_URL`

### 4. Deploy and Migrate
```bash
# Deploy to Railway
git push railway main

# Run migration in Railway console
railway run python production_data_migration.py
```

## 🔍 Post-Migration Verification

### 1. Check Data Integrity
```bash
# Verify transportation data
python manage.py shell

>>> from api.models import TransferType, FerrySchedule, AtollTransfer
>>> print(f"Transfer Types: {TransferType.objects.count()}")
>>> print(f"Ferry Schedules: {FerrySchedule.objects.count()}")
>>> print(f"Atoll Transfers: {AtollTransfer.objects.count()}")
```

### 2. Test Admin Panel
- Visit: `https://yourdomain.com/admin/`
- Login with admin credentials
- Verify transportation data is visible

### 3. Test Frontend Integration
- Visit: `https://yourdomain.com/transportation`
- Check ferry schedules are displayed
- Verify transfer booking forms work

## 🛠️ Troubleshooting

### Common Issues and Solutions

**Issue**: Migration fails with database connection error
```bash
# Solution: Check environment variables
echo $DATABASE_URL
python manage.py dbshell  # Test database connection
```

**Issue**: Transportation data not appearing
```bash
# Solution: Re-run management commands
python manage.py populate_transportation_data
python manage.py populate_ferry_schedules
```

**Issue**: Admin user not created
```bash
# Solution: Create manually
python manage.py createsuperuser
```

**Issue**: Static files not loading
```bash
# Solution: Collect static files
python manage.py collectstatic --noinput
```

## 📊 Data Backup Strategy

### Automated Backups
Add to your production deployment:
```python
# In settings_production.py
DATABASES = {
    'default': {
        # ... your database config
        'OPTIONS': {
            'backup_count': 7,  # Keep 7 days of backups
        }
    }
}
```

### Manual Backup Commands
```bash
# Backup all transportation data
python export_transportation_data.py

# Backup entire database
pg_dump -U username database_name > backup_$(date +%Y%m%d).sql

# Backup specific tables
pg_dump -U username -t api_transfertype -t api_ferryschedule database_name > transport_backup.sql
```

## 🔄 Regular Updates

### Adding New Transportation Data
1. **Development**: Add data via Django admin or management commands
2. **Export**: Run `python export_transportation_data.py`
3. **Production**: Deploy new fixture files
4. **Verify**: Check data appears correctly

### Updating Ferry Schedules
```python
# Create management command for schedule updates
python manage.py update_ferry_schedules --route "Male to Hulhumale" --time "07:00"
```

## 🌐 CDN and Performance

### Static Files Optimization
For high traffic, serve transportation data via CDN:
```python
# In views.py
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # Cache for 15 minutes
def transportation_data(request):
    # Your transportation data view
```

### Database Optimization
```python
# Optimize queries for transportation data
transfer_types = TransferType.objects.select_related().prefetch_related('transfers')
ferry_schedules = FerrySchedule.objects.filter(is_active=True).order_by('departure_time')
```

## 📱 Mobile App Integration

If you have a mobile app, expose transportation data via API:
```python
# In serializers.py
class TransportationDataSerializer(serializers.ModelSerializer):
    # Serialize all transportation data for mobile app
```

## 🔐 Security Considerations

### Data Protection
- ✅ Never expose sensitive pricing data in public APIs
- ✅ Use authentication for booking endpoints
- ✅ Validate all user input for transfer bookings
- ✅ Rate limit transportation search endpoints

### Backup Security
- ✅ Encrypt database backups
- ✅ Store backups in secure, off-site location
- ✅ Test backup restoration regularly

## 📞 Support and Monitoring

### Health Checks
```python
# Add health check for transportation data
def transportation_health_check():
    try:
        transfer_count = TransferType.objects.count()
        ferry_count = FerrySchedule.objects.count()
        return {'status': 'healthy', 'transfers': transfer_count, 'ferries': ferry_count}
    except Exception as e:
        return {'status': 'unhealthy', 'error': str(e)}
```

### Monitoring Alerts
Set up alerts for:
- Transportation data API response times > 2 seconds
- Ferry schedule API failures
- Transfer booking form errors
- Database connection issues

---

## 🎯 Quick Command Reference

```bash
# Export transportation data
python export_transportation_data.py

# Complete production migration
python production_data_migration.py

# Manual data population
python manage.py populate_transportation_data
python manage.py populate_ferry_schedules

# Verify data
python manage.py shell -c "from api.models import *; print(f'Transportation records: {TransferType.objects.count()}')"

# Backup database
pg_dump database_name > backup.sql

# Restore from backup
psql database_name < backup.sql
```

This comprehensive migration strategy ensures your transportation data is safely transferred to production and remains reliable for hundreds of thousands of users! 🚀
