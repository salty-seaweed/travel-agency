#!/usr/bin/env python
"""
Transportation Data Export Script for Travel Agency

This script exports all transportation-related data from your Django database
to JSON fixtures that can be imported into your production environment.
"""

import os
import sys
import django
import json
from datetime import datetime

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_agency.settings')
django.setup()

from django.core import serializers
from api.models import (
    TransferType, AtollTransfer, ResortTransfer, 
    TransferFAQ, TransferContactMethod, TransferBookingStep,
    TransferBenefit, TransferPricingFactor, TransferContent,
    FerrySchedule
)

def export_transportation_data():
    """
    Export all transportation-related data to JSON fixtures
    """
    print("🚛 Exporting Transportation Data...")
    print("=" * 50)
    
    # Create exports directory if it doesn't exist
    exports_dir = 'data_exports'
    if not os.path.exists(exports_dir):
        os.makedirs(exports_dir)
    
    # Get current timestamp for filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    # Define models to export
    transportation_models = [
        ('transfer_types', TransferType),
        ('atoll_transfers', AtollTransfer),
        ('resort_transfers', ResortTransfer),
        ('transfer_faqs', TransferFAQ),
        ('transfer_contact_methods', TransferContactMethod),
        ('transfer_booking_steps', TransferBookingStep),
        ('transfer_benefits', TransferBenefit),
        ('transfer_pricing_factors', TransferPricingFactor),
        ('transfer_content', TransferContent),
        ('ferry_schedules', FerrySchedule),
    ]
    
    exported_files = []
    total_records = 0
    
    # Export each model
    for model_name, model_class in transportation_models:
        try:
            # Get all records
            records = model_class.objects.all()
            record_count = records.count()
            
            if record_count > 0:
                # Export to JSON
                filename = f'{exports_dir}/{model_name}_{timestamp}.json'
                
                with open(filename, 'w', encoding='utf-8') as f:
                    serializers.serialize('json', records, indent=2, stream=f)
                
                exported_files.append({
                    'file': filename,
                    'model': model_name,
                    'records': record_count
                })
                total_records += record_count
                
                print(f"✅ {model_name}: {record_count} records exported")
            else:
                print(f"⚠️  {model_name}: No records found")
                
        except Exception as e:
            print(f"❌ Error exporting {model_name}: {str(e)}")
    
    # Create a combined export file
    combined_filename = f'{exports_dir}/all_transportation_data_{timestamp}.json'
    combined_data = []
    
    for model_name, model_class in transportation_models:
        records = model_class.objects.all()
        if records.exists():
            # Convert to list and add to combined data
            for obj in serializers.deserialize('json', serializers.serialize('json', records)):
                combined_data.append(obj.object.__dict__)
    
    # Export combined file as a more readable format
    if combined_data:
        with open(combined_filename, 'w', encoding='utf-8') as f:
            json.dump({
                'export_info': {
                    'timestamp': timestamp,
                    'total_records': total_records,
                    'models_exported': len(exported_files)
                },
                'data': combined_data
            }, f, indent=2, default=str)
        
        print(f"\n📦 Combined export created: {combined_filename}")
    
    # Create import commands script
    import_script_filename = f'{exports_dir}/import_transportation_data_{timestamp}.py'
    
    import_script_content = f'''#!/usr/bin/env python
"""
Transportation Data Import Script
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

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
            print(f"Running: {{command}}")
            call_command(command)
            print(f"✅ {{command}} completed successfully")
        except Exception as e:
            print(f"❌ Error running {{command}}: {{str(e)}}")
    
    print("\\n🎉 Transportation data import completed!")

if __name__ == '__main__':
    import_transportation_data()
'''
    
    with open(import_script_filename, 'w', encoding='utf-8') as f:
        f.write(import_script_content)
    
    # Create SQL backup script
    sql_backup_script = f'{exports_dir}/backup_transportation_data_{timestamp}.sql'
    
    sql_script_content = f'''-- Transportation Data Backup
-- Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
-- 
-- This SQL script creates a backup of all transportation-related tables
-- Run this on your production database to backup transportation data

-- Backup TransferType table
CREATE TABLE IF NOT EXISTS backup_transfer_types_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transfertype;

-- Backup AtollTransfer table
CREATE TABLE IF NOT EXISTS backup_atoll_transfers_{timestamp.replace('_', '')} AS 
SELECT * FROM api_atolltransfer;

-- Backup ResortTransfer table
CREATE TABLE IF NOT EXISTS backup_resort_transfers_{timestamp.replace('_', '')} AS 
SELECT * FROM api_resorttransfer;

-- Backup FerrySchedule table
CREATE TABLE IF NOT EXISTS backup_ferry_schedules_{timestamp.replace('_', '')} AS 
SELECT * FROM api_ferryschedule;

-- Backup all other transportation tables
CREATE TABLE IF NOT EXISTS backup_transfer_faqs_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transferfaq;

CREATE TABLE IF NOT EXISTS backup_transfer_contact_methods_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transfercontactmethod;

CREATE TABLE IF NOT EXISTS backup_transfer_booking_steps_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transferbookingstep;

CREATE TABLE IF NOT EXISTS backup_transfer_benefits_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transferbenefit;

CREATE TABLE IF NOT EXISTS backup_transfer_pricing_factors_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transferpricingfactor;

CREATE TABLE IF NOT EXISTS backup_transfer_content_{timestamp.replace('_', '')} AS 
SELECT * FROM api_transfercontent;

-- Show backup tables created
SELECT 'Backup completed for transportation data on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}' AS status;
'''
    
    with open(sql_backup_script, 'w', encoding='utf-8') as f:
        f.write(sql_script_content)
    
    # Create restore script for Django fixtures
    restore_script_filename = f'{exports_dir}/restore_transportation_data_{timestamp}.sh'
    
    restore_script_content = f'''#!/bin/bash
# Transportation Data Restore Script
# Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

echo "🚛 Restoring Transportation Data..."

# Set Django settings for production
export DJANGO_SETTINGS_MODULE=travel_agency.settings_production

# Load each fixture file
'''
    
    for exported_file in exported_files:
        restore_script_content += f'''
echo "Loading {exported_file['model']}..."
python manage.py loaddata {exported_file['file']}
'''
    
    restore_script_content += f'''
echo "✅ Transportation data restore completed!"
echo "Total records restored: {total_records}"
'''
    
    with open(restore_script_filename, 'w', encoding='utf-8') as f:
        f.write(restore_script_content)
    
    # Make restore script executable (on Unix systems)
    try:
        os.chmod(restore_script_filename, 0o755)
    except:
        pass  # Windows doesn't support chmod
    
    # Print summary
    print("\n" + "=" * 50)
    print("📊 EXPORT SUMMARY")
    print("=" * 50)
    print(f"📅 Export Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Export Directory: {exports_dir}/")
    print(f"📊 Total Records: {total_records}")
    print(f"📦 Models Exported: {len(exported_files)}")
    
    print("\n📄 Files Created:")
    for exported_file in exported_files:
        print(f"  • {exported_file['file']} ({exported_file['records']} records)")
    
    print(f"  • {combined_filename} (combined export)")
    print(f"  • {import_script_filename} (import script)")
    print(f"  • {sql_backup_script} (SQL backup)")
    print(f"  • {restore_script_filename} (restore script)")
    
    print("\n🚀 DEPLOYMENT INSTRUCTIONS:")
    print("=" * 50)
    print("1. Copy all exported files to your production server")
    print("2. Run the import script in your production environment:")
    print(f"   python {import_script_filename}")
    print("3. Or use Django fixtures:")
    print(f"   bash {restore_script_filename}")
    print("4. Verify data integrity after import")
    
    print("\n💾 BACKUP INSTRUCTIONS:")
    print("=" * 50)
    print("1. Before importing, backup your production data:")
    print(f"   psql -U username -d database < {sql_backup_script}")
    print("2. Test import on staging environment first")
    print("3. Monitor application after production deployment")
    
    return {
        'export_directory': exports_dir,
        'total_records': total_records,
        'exported_files': exported_files,
        'timestamp': timestamp
    }

if __name__ == '__main__':
    try:
        result = export_transportation_data()
        print(f"\n🎉 Export completed successfully!")
        print(f"📁 Check the '{result['export_directory']}' directory for all exported files.")
        
    except Exception as e:
        print(f"\n❌ Export failed: {str(e)}")
        sys.exit(1)
