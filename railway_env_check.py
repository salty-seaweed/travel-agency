#!/usr/bin/env python
import os

print("🔍 Railway Environment Check")
print("=" * 50)

# All environment variables
env_vars = dict(os.environ)
railway_vars = {k: v for k, v in env_vars.items() if 'RAILWAY' in k.upper()}
postgres_vars = {k: v for k, v in env_vars.items() if any(db in k.upper() for db in ['PG', 'DATABASE', 'DB'])}

print("🚂 RAILWAY VARIABLES:")
for k, v in sorted(railway_vars.items()):
    print(f"  {k}: {v}")

print("\n🗄️ DATABASE VARIABLES:")
for k, v in sorted(postgres_vars.items()):
    # Hide sensitive data
    if 'PASSWORD' in k.upper() or 'URL' in k.upper():
        print(f"  {k}: {v[:20]}...{v[-10:] if len(v) > 30 else v}")
    else:
        print(f"  {k}: {v}")

print(f"\n🔧 KEY VARIABLES:")
print(f"  PORT: {os.getenv('PORT', 'NOT SET')}")
print(f"  DJANGO_SETTINGS_MODULE: {os.getenv('DJANGO_SETTINGS_MODULE', 'NOT SET')}")
print(f"  SECRET_KEY: {'SET' if os.getenv('SECRET_KEY') else 'NOT SET'}")

print("\n✅ Environment check complete!")
