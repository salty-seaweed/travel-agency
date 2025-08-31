#!/usr/bin/env python
"""
Railway Database Setup Script
Runs all necessary database migrations and data population commands
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Setup Django environment"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings_production')
    django.setup()

def run_command(command_args):
    """Run a Django management command"""
    print(f"\n🔄 Running: {' '.join(command_args)}")
    try:
        execute_from_command_line(['manage.py'] + command_args)
        print(f"✅ Success: {' '.join(command_args)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Starting Railway Database Setup...")
    
    setup_django()
    
    # List of commands to run in order
    commands = [
        # 1. Database migrations
        ['migrate'],
        
        # 2. Create admin user
        ['create_ttm_admin'],
        
        # 3. Populate core data
        ['populate_sample_data'],
        ['populate_languages'],
        ['populate_destinations'],
        ['populate_transportation_data'],
        ['populate_ferry_schedules'],
        ['populate_homepage_data'],
        ['populate_experiences'],
        ['populate_package_destinations'],
        
        # 4. Update counts
        ['update_destination_counts'],
        
        # 5. Collect static files
        ['collectstatic', '--noinput'],
    ]
    
    success_count = 0
    total_commands = len(commands)
    
    for command in commands:
        if run_command(command):
            success_count += 1
        else:
            print(f"⚠️  Command failed: {' '.join(command)}")
    
    print(f"\n📊 Setup Complete: {success_count}/{total_commands} commands successful")
    
    if success_count == total_commands:
        print("🎉 Railway database setup completed successfully!")
        print("\n📝 Admin Login Details:")
        print("   Username: lenovo")
        print("   Password: pitiri")
        print("   Email: admin@threadtravels.com")
    else:
        print("⚠️  Some commands failed. Check the logs above.")
        sys.exit(1)

if __name__ == '__main__':
    main()
