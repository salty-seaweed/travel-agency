"""
WSGI config for travel_agency project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os
import sys

print("[WSGI] Starting WSGI application...")
print(f"[WSGI] DJANGO_SETTINGS_MODULE = {os.environ.get('DJANGO_SETTINGS_MODULE', 'NOT SET')}")
print(f"[WSGI] RAILWAY_ENVIRONMENT_NAME = {os.environ.get('RAILWAY_ENVIRONMENT_NAME', 'NOT SET')}")
print(f"[WSGI] PORT = {os.environ.get('PORT', 'NOT SET')}")

from django.core.wsgi import get_wsgi_application

# Use settings_minimal for Railway production, regular settings for development
if os.environ.get('RAILWAY_ENVIRONMENT_NAME') or os.environ.get('PORT'):
    settings_module = 'travel_agency.settings_minimal'
    print(f"[WSGI] Railway detected, using {settings_module}")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
else:
    settings_module = 'travel_agency.settings'
    print(f"[WSGI] Development environment, using {settings_module}")
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)

print("[WSGI] About to create WSGI application...")
try:
    application = get_wsgi_application()
    print("[WSGI] Application created successfully")
except Exception as e:
    print(f"[WSGI] Error creating application: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
