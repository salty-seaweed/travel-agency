"""
Minimal Railway settings - just to get the app running
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Minimal settings
SECRET_KEY = os.getenv('SECRET_KEY', 'railway-minimal-key-change-me')
DEBUG = True
ALLOWED_HOSTS = ['*']  # Allow all hosts for now

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'travel_agency.urls'

# Database - Railway PostgreSQL with fallback
DATABASE_URL = os.getenv('DATABASE_URL')

# Debug environment variables
print(f"🔍 Raw Environment Variables:")
print(f"   DATABASE_URL: {DATABASE_URL}")
print(f"   PGDATABASE: {os.getenv('PGDATABASE')}")
print(f"   PGHOST: {os.getenv('PGHOST')}")
print(f"   PGUSER: {os.getenv('PGUSER')}")
print(f"   PGPASSWORD: {'***' if os.getenv('PGPASSWORD') else None}")
print(f"   PGPORT: {os.getenv('PGPORT')}")

if DATABASE_URL:
    # Parse DATABASE_URL if provided
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
    print(f"✅ Using DATABASE_URL: {DATABASE_URL[:50]}...")
else:
    # Check if we have Railway environment variables
    railway_host = os.getenv('PGHOST')
    if railway_host and 'railway' in railway_host.lower():
        # Use Railway environment variables
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.getenv('PGDATABASE'),
                'USER': os.getenv('PGUSER'),
                'PASSWORD': os.getenv('PGPASSWORD'),
                'HOST': os.getenv('PGHOST'),
                'PORT': os.getenv('PGPORT', '5432'),
                'OPTIONS': {
                    'sslmode': 'require',
                },
            }
        }
        print(f"✅ Using Railway PostgreSQL: {railway_host}")
    else:
        # Fallback to SQLite for development
        print("⚠️  No Railway database found, using SQLite fallback")
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

# Debug database connection
print(f"🔍 Database Config:")
print(f"   ENGINE: {DATABASES['default']['ENGINE']}")
print(f"   NAME: {DATABASES['default'].get('NAME', 'Not set')}")
print(f"   HOST: {DATABASES['default'].get('HOST', 'Not set')}")
print(f"   PORT: {DATABASES['default'].get('PORT', 'Not set')}")
print(f"   USER: {DATABASES['default'].get('USER', 'Not set')}")
print(f"   PASSWORD: {'***' if DATABASES['default'].get('PASSWORD') else 'Not set'}")
print(f"   DATABASE_URL: {'Set' if DATABASE_URL else 'Not set'}")
print(f"   PGDATABASE: {os.getenv('PGDATABASE', 'Not set')}")
print(f"   PGHOST: {os.getenv('PGHOST', 'Not set')}")

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Whitenoise configuration - disabled for debugging
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# CORS
CORS_ALLOW_ALL_ORIGINS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
