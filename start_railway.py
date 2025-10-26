#!/usr/bin/env python
import os
import sys
import subprocess

print("🚀 Railway Startup Script")
print(f"🔧 Python version: {sys.version}")
print(f"🔧 Working directory: {os.getcwd()}")
print(f"🔧 PORT: {os.getenv('PORT', 'NOT SET')}")
print(f"🔧 DJANGO_SETTINGS_MODULE: {os.getenv('DJANGO_SETTINGS_MODULE', 'NOT SET')}")

# Set the settings module explicitly
os.environ['DJANGO_SETTINGS_MODULE'] = 'travel_agency.settings_minimal'
print(f"✅ Set DJANGO_SETTINGS_MODULE to: {os.environ['DJANGO_SETTINGS_MODULE']}")

# Get the port
port = os.getenv('PORT', '8080')
print(f"✅ Will bind to port: {port}")

# Build the gunicorn command
gunicorn_cmd = [
    'gunicorn',
    'travel_agency.wsgi:application',
    '--bind', f'0.0.0.0:{port}',
    '--log-level', 'info',
    '--timeout', '30',
    '--workers', '1'
]

print(f"🚀 Starting Gunicorn with command: {' '.join(gunicorn_cmd)}")

try:
    # Start gunicorn
    subprocess.run(gunicorn_cmd, check=True)
except Exception as e:
    print(f"❌ Gunicorn failed to start: {e}")
    sys.exit(1)
