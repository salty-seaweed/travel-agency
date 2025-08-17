#!/usr/bin/env python3
"""
Script to help set up PostgreSQL database for the travel agency project
"""
import subprocess
import sys
import os
from pathlib import Path

def run_command(command, shell=True):
    """Run a command and return the result"""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=shell, capture_output=True, text=True)
    return result

def check_postgres_installed():
    """Check if PostgreSQL is installed"""
    result = run_command("psql --version")
    if result.returncode == 0:
        print("✅ PostgreSQL is installed")
        print(f"Version: {result.stdout.strip()}")
        return True
    else:
        print("❌ PostgreSQL is not installed or not in PATH")
        return False

def create_database():
    """Create the database if it doesn't exist"""
    db_name = "travel_agency_db"
    
    # Check if database exists
    check_cmd = f"psql -U postgres -lqt | cut -d \| -f 1 | grep -qw {db_name}"
    result = run_command(check_cmd)
    
    if result.returncode == 0:
        print(f"✅ Database '{db_name}' already exists")
        return True
    else:
        print(f"📝 Creating database '{db_name}'...")
        create_cmd = f"createdb -U postgres {db_name}"
        result = run_command(create_cmd)
        
        if result.returncode == 0:
            print(f"✅ Database '{db_name}' created successfully")
            return True
        else:
            print(f"❌ Failed to create database: {result.stderr}")
            return False

def setup_django():
    """Set up Django with PostgreSQL"""
    print("\n🐍 Setting up Django with PostgreSQL...")
    
    # Install dependencies
    print("📦 Installing Python dependencies...")
    result = run_command("pip install -r requirements.txt")
    if result.returncode != 0:
        print(f"❌ Failed to install dependencies: {result.stderr}")
        return False
    
    # Run migrations
    print("🔄 Running Django migrations...")
    result = run_command("python manage.py makemigrations")
    if result.returncode != 0:
        print(f"❌ Failed to create migrations: {result.stderr}")
        return False
    
    result = run_command("python manage.py migrate")
    if result.returncode != 0:
        print(f"❌ Failed to run migrations: {result.stderr}")
        return False
    
    # Create superuser
    print("👤 Creating superuser...")
    result = run_command("python manage.py createsuperuser --noinput --username admin --email admin@example.com")
    if result.returncode != 0:
        print("⚠️  Failed to create superuser automatically. You can create one manually later.")
    
    # Populate sample data
    print("📊 Populating sample data...")
    result = run_command("python manage.py populate_sample_data")
    if result.returncode != 0:
        print(f"⚠️  Failed to populate sample data: {result.stderr}")
    
    print("✅ Django setup completed!")
    return True

def main():
    print("🚀 PostgreSQL Setup for Travel Agency")
    print("=" * 50)
    
    # Check if PostgreSQL is installed
    if not check_postgres_installed():
        print("\n📋 To install PostgreSQL:")
        print("1. Download from: https://www.postgresql.org/download/")
        print("2. Install with default settings")
        print("3. Add PostgreSQL bin directory to your PATH")
        print("4. Run this script again")
        return
    
    # Create database
    if not create_database():
        print("\n❌ Database setup failed. Please check your PostgreSQL installation.")
        return
    
    # Setup Django
    if not setup_django():
        print("\n❌ Django setup failed.")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Copy env.example to .env and update database credentials if needed")
    print("2. Run: python start_servers.py")
    print("3. Access the application at: http://localhost:5174")
    print("4. Admin panel at: http://localhost:8001/admin")

if __name__ == "__main__":
    main() 