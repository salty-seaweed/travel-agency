#!/usr/bin/env python
"""
Production Data Migration Script for Travel Agency

This script handles the complete migration of all travel agency data
from development to production environment, including transportation data.
"""

import os
import sys
import django
import json
from datetime import datetime
from pathlib import Path

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings_production')
django.setup()

from django.core.management import call_command
from django.db import transaction
from django.contrib.auth.models import User

def run_production_migration():
    """
    Complete production data migration process
    """
    print("🚀 Starting Production Data Migration...")
    print("=" * 60)
    
    migration_steps = [
        {
            'name': 'Database Migration',
            'command': 'migrate',
            'description': 'Apply all database migrations'
        },
        {
            'name': 'Static Files Collection',
            'command': 'collectstatic',
            'description': 'Collect static files for production',
            'args': ['--noinput']
        },
        {
            'name': 'Languages Population',
            'command': 'populate_languages',
            'description': 'Setup language support (English, Russian, Chinese)'
        },
        {
            'name': 'Transportation Data',
            'command': 'populate_transportation_data',
            'description': 'Load all transportation types, atolls, and transfer data'
        },
        {
            'name': 'Ferry Schedules',
            'command': 'populate_ferry_schedules',
            'description': 'Load ferry timetables and scheduling data'
        },
        {
            'name': 'Sample Destinations',
            'command': 'populate_destinations',
            'description': 'Load Maldives destinations and islands'
        },
        {
            'name': 'Travel Experiences',
            'command': 'populate_experiences',
            'description': 'Load travel experiences and activities'
        },
        {
            'name': 'Package Destinations',
            'command': 'populate_package_destinations',
            'description': 'Setup travel packages and destinations'
        },
        {
            'name': 'Homepage Content',
            'command': 'populate_homepage_data',
            'description': 'Load homepage content and sections'
        },
        {
            'name': 'Destination Statistics',
            'command': 'update_destination_counts',
            'description': 'Update destination package counts'
        }
    ]
    
    completed_steps = []
    failed_steps = []
    
    print(f"📋 Migration Plan ({len(migration_steps)} steps):")
    for i, step in enumerate(migration_steps, 1):
        print(f"  {i}. {step['name']}: {step['description']}")
    
    print("\n" + "=" * 60)
    print("🏃 Executing Migration Steps...")
    print("=" * 60)
    
    for i, step in enumerate(migration_steps, 1):
        step_name = step['name']
        command = step['command']
        args = step.get('args', [])
        
        print(f"\n[{i}/{len(migration_steps)}] {step_name}")
        print(f"Running: python manage.py {command} {' '.join(args)}")
        
        try:
            with transaction.atomic():
                if args:
                    call_command(command, *args)
                else:
                    call_command(command)
            
            print(f"✅ {step_name} completed successfully")
            completed_steps.append(step_name)
            
        except Exception as e:
            print(f"❌ {step_name} failed: {str(e)}")
            failed_steps.append({
                'name': step_name,
                'error': str(e)
            })
            
            # Ask if we should continue or stop
            continue_migration = input("\nDo you want to continue with remaining steps? (y/n): ")
            if continue_migration.lower() != 'y':
                break
    
    # Create admin user if it doesn't exist
    print(f"\n[ADMIN] Creating Admin User...")
    try:
        admin_username = os.getenv('ADMIN_USERNAME', 'admin')
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@yourdomain.com')
        admin_password = os.getenv('ADMIN_PASSWORD', 'changeme123!')
        
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password
            )
            print(f"✅ Admin user '{admin_username}' created successfully")
            print(f"📧 Email: {admin_email}")
            print(f"🔑 Password: {admin_password}")
            print("⚠️  IMPORTANT: Change the admin password after first login!")
        else:
            print(f"ℹ️  Admin user '{admin_username}' already exists")
            
    except Exception as e:
        print(f"❌ Admin user creation failed: {str(e)}")
        failed_steps.append({
            'name': 'Admin User Creation',
            'error': str(e)
        })
    
    # Migration Summary
    print("\n" + "=" * 60)
    print("📊 MIGRATION SUMMARY")
    print("=" * 60)
    print(f"📅 Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"✅ Successful Steps: {len(completed_steps)}")
    print(f"❌ Failed Steps: {len(failed_steps)}")
    print(f"📊 Success Rate: {len(completed_steps)/(len(migration_steps)+1)*100:.1f}%")
    
    if completed_steps:
        print(f"\n✅ Completed Steps:")
        for step in completed_steps:
            print(f"  • {step}")
    
    if failed_steps:
        print(f"\n❌ Failed Steps:")
        for step in failed_steps:
            print(f"  • {step['name']}: {step['error']}")
    
    # Post-migration verification
    print("\n" + "=" * 60)
    print("🔍 POST-MIGRATION VERIFICATION")
    print("=" * 60)
    
    verification_checks = [
        ('Transportation Data', 'api.models', 'TransferType'),
        ('Ferry Schedules', 'api.models', 'FerrySchedule'),
        ('Languages', 'api.models', 'Language'),
        ('Admin Users', 'django.contrib.auth.models', 'User'),
    ]
    
    for check_name, module_name, model_name in verification_checks:
        try:
            module = __import__(module_name, fromlist=[model_name])
            model = getattr(module, model_name)
            count = model.objects.count()
            
            if count > 0:
                print(f"✅ {check_name}: {count} records")
            else:
                print(f"⚠️  {check_name}: No records found")
                
        except Exception as e:
            print(f"❌ {check_name}: Verification failed - {str(e)}")
    
    # Generate post-migration instructions
    print("\n" + "=" * 60)
    print("📝 NEXT STEPS")
    print("=" * 60)
    
    next_steps = [
        "1. Test the admin panel: https://yourdomain.com/admin/",
        "2. Verify transportation data is loaded correctly",
        "3. Test the frontend application functionality",
        "4. Set up SSL certificates if not already configured",
        "5. Configure monitoring and backup systems",
        "6. Update DNS records to point to production server",
        "7. Set up CDN (Cloudflare) for better performance",
        "8. Test booking and contact forms",
        "9. Verify Google Maps integration works",
        "10. Monitor application logs for any errors"
    ]
    
    for step in next_steps:
        print(f"  {step}")
    
    # Save migration log
    log_filename = f"migration_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    migration_log = {
        'timestamp': datetime.now().isoformat(),
        'completed_steps': completed_steps,
        'failed_steps': failed_steps,
        'success_rate': len(completed_steps)/(len(migration_steps)+1)*100,
        'total_steps': len(migration_steps) + 1,  # +1 for admin user creation
        'environment': os.getenv('DJANGO_SETTINGS_MODULE', 'unknown')
    }
    
    try:
        with open(log_filename, 'w') as f:
            json.dump(migration_log, f, indent=2)
        print(f"\n📄 Migration log saved: {log_filename}")
    except Exception as e:
        print(f"\n⚠️  Could not save migration log: {str(e)}")
    
    # Return summary
    return {
        'success': len(failed_steps) == 0,
        'completed_steps': len(completed_steps),
        'failed_steps': len(failed_steps),
        'log_file': log_filename
    }

def verify_environment():
    """
    Verify the production environment is ready for migration
    """
    print("🔍 Verifying Production Environment...")
    
    checks = []
    
    # Check Django settings
    try:
        from django.conf import settings
        checks.append(('Django Settings', settings.DEBUG == False, 'DEBUG should be False in production'))
        checks.append(('Secret Key', bool(settings.SECRET_KEY), 'SECRET_KEY must be set'))
        checks.append(('Database', 'postgresql' in settings.DATABASES['default']['ENGINE'], 'Should use PostgreSQL'))
        checks.append(('Allowed Hosts', len(settings.ALLOWED_HOSTS) > 0, 'ALLOWED_HOSTS must be configured'))
    except Exception as e:
        checks.append(('Django Settings', False, f'Settings error: {str(e)}'))
    
    # Check environment variables
    required_env_vars = [
        'SECRET_KEY', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'
    ]
    
    for var in required_env_vars:
        value = os.getenv(var)
        checks.append((f'ENV: {var}', bool(value), f'{var} environment variable must be set'))
    
    # Print verification results
    all_passed = True
    for check_name, passed, message in checks:
        status = "✅" if passed else "❌"
        print(f"  {status} {check_name}: {message}")
        if not passed:
            all_passed = False
    
    if not all_passed:
        print("\n❌ Environment verification failed!")
        print("Please fix the above issues before running migration.")
        return False
    
    print("\n✅ Environment verification passed!")
    return True

if __name__ == '__main__':
    print("🏗️  TRAVEL AGENCY - PRODUCTION MIGRATION")
    print("=" * 60)
    
    # Verify environment first
    if not verify_environment():
        sys.exit(1)
    
    # Confirm migration
    print("\n⚠️  This will modify your production database!")
    confirm = input("Are you sure you want to proceed? (yes/no): ")
    
    if confirm.lower() != 'yes':
        print("Migration cancelled.")
        sys.exit(0)
    
    try:
        result = run_production_migration()
        
        if result['success']:
            print(f"\n🎉 Migration completed successfully!")
            print(f"✅ {result['completed_steps']} steps completed")
        else:
            print(f"\n⚠️  Migration completed with {result['failed_steps']} failures")
            print(f"✅ {result['completed_steps']} steps completed")
            print(f"❌ {result['failed_steps']} steps failed")
            
    except Exception as e:
        print(f"\n💥 Migration failed with critical error: {str(e)}")
        sys.exit(1)
