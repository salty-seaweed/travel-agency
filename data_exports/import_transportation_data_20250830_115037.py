#!/usr/bin/env python
"""
Transportation Data Import Script
Generated on: 2025-08-30 11:50:37

This script imports transportation data into your production database.
Run this after setting up your production database.
"""

import os
import django
from django.core.management import call_command

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings_production')
django.setup()

def import_transportation_data():
    """Import all transportation data"""
    print("🚛 Importing Transportation Data...")
    
    # Run management commands to populate data
    management_commands = [
        'populate_transportation_data',
        'populate_ferry_schedules',
    ]
    
    for command in management_commands:
        try:
            print(f"Running: {command}")
            call_command(command)
            print(f"✅ {command} completed successfully")
        except Exception as e:
            print(f"❌ Error running {command}: {str(e)}")
    
    print("\n🎉 Transportation data import completed!")

if __name__ == '__main__':
    import_transportation_data()
