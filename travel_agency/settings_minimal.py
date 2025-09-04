"""
Railway production settings for travel_agency project.
Comprehensive configuration with all production features.
"""

import os
import logging
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-minimal-test-key')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Production allowed hosts
ALLOWED_HOSTS = [
    'threadtravels.com',
    'www.threadtravels.com',
    '.railway.app',
    '.up.railway.app',
    'web-production-a324.up.railway.app',
    'localhost',
    '127.0.0.1',
    os.getenv('BACKEND_URL', '').replace('https://', '').replace('http://', ''),
    '*',  # Allow all for Railway flexibility
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api',
    'django_filters',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'api.middleware.MobileCompatibilityMiddleware',  # Mobile support
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'travel_agency.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'travel_agency.wsgi.application'

# Database - Railway PostgreSQL with fallback
import dj_database_url

DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Parse DATABASE_URL if provided
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
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
                'CONN_MAX_AGE': 600,  # Connection pooling
                'OPTIONS': {
                    'sslmode': 'require',
                },
            }
        }
    else:
        # Fallback to SQLite for development
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Ensure staticfiles directory exists
try:
    os.makedirs(STATIC_ROOT, exist_ok=True)
except Exception:
    pass

# Staticfiles configuration for Railway with Whitenoise
STATICFILES_DIRS = []
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Whitenoise configuration for static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files configuration
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
MEDIA_ROOT = os.getenv('MEDIA_ROOT', os.path.join(BASE_DIR, 'media'))

# Ensure media directory exists and has correct permissions
def ensure_media_permissions():
    """
    Ensure media directory exists and is writable.
    Skip chmod/chown on mounted volumes (e.g., Railway) where it's not permitted.
    """
    logger = logging.getLogger(__name__)

    # Ensure the directory exists
    try:
        os.makedirs(MEDIA_ROOT, exist_ok=True)
    except Exception as e:
        logger.error(f"Could not create MEDIA_ROOT '{MEDIA_ROOT}': {e}")
        return

    # If MEDIA_ROOT is a mount point (like a Railway volume), do not attempt chmod/chown
    is_mount = False
    try:
        is_mount = os.path.ismount(MEDIA_ROOT)
    except Exception:
        pass

    if is_mount:
        # Best-effort writeability check
        try:
            test_file = os.path.join(MEDIA_ROOT, ".rw_test")
            with open(test_file, "w") as f:
                f.write("ok")
            os.remove(test_file)
        except Exception as write_err:
            logger.error(f"MEDIA_ROOT not writable: {MEDIA_ROOT} ({write_err})")
        return

    # For non-mounted directories, only chmod if we own the directory
    try:
        if hasattr(os, "getuid"):
            stat_info = os.stat(MEDIA_ROOT)
            if stat_info.st_uid == os.getuid():
                os.chmod(MEDIA_ROOT, 0o755)
    except PermissionError:
        # Non-fatal on restricted environments
        logger.debug("Permission denied changing MEDIA_ROOT mode; continuing")
    except Exception as e:
        logger.debug(f"Skipping MEDIA_ROOT chmod due to: {e}")

# Call this when Django starts
ensure_media_permissions()

# Ensure MEDIA_ROOT is absolute and exists when using local storage
if not os.getenv('USE_CLOUD_MEDIA', 'false').lower() == 'true':
    if not os.path.isabs(MEDIA_ROOT):
        MEDIA_ROOT = os.path.join(BASE_DIR, MEDIA_ROOT)
    try:
        os.makedirs(MEDIA_ROOT, exist_ok=True)
    except Exception:
        pass

# Optional cloud storage for persistent media (recommended for Railway/Vercel)
USE_S3 = os.getenv('USE_S3', 'false').lower() == 'true'
USE_CLOUDINARY = os.getenv('USE_CLOUDINARY', 'false').lower() == 'true'

if USE_S3:
    INSTALLED_APPS += ['storages']
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME', 'us-east-1')
    AWS_S3_FILE_OVERWRITE = False
    AWS_DEFAULT_ACL = None
    AWS_S3_VERIFY = True
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = os.getenv('MEDIA_URL', f'https://{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com/')
elif USE_CLOUDINARY:
    INSTALLED_APPS += ['cloudinary', 'cloudinary_storage']
    CLOUDINARY_STORAGE = {
        'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
        'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
        'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
    }
    DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
    MEDIA_URL = os.getenv('MEDIA_URL', MEDIA_URL)

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings for production
# Use specific origins instead of allowing all for better security
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://threadtravels.com",
    "https://www.threadtravels.com",
    "https://threadtravels.vercel.app",
    "https://threadtravels-frontend.vercel.app",
    "https://web-production-a324.up.railway.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    os.getenv('FRONTEND_URL', 'https://threadtravels.vercel.app'),
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_HEADERS = True
CORS_ALLOW_ALL_METHODS = True
CORS_EXPOSE_HEADERS = [
    'Content-Type', 
    'X-CSRFToken', 
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
]

# Allow specific headers that might be causing issues
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
    'access-control-allow-origin',
    'access-control-allow-headers',
    'access-control-allow-methods',
]

# CSRF exemption for API endpoints
CSRF_TRUSTED_ORIGINS = [
    "https://threadtravels.com",
    "https://www.threadtravels.com", 
    "https://threadtravels.vercel.app",
    "https://threadtravels-frontend.vercel.app",
    "https://web-production-a324.up.railway.app",
]

# REST Framework configuration for production
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    },
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
}

# JWT configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
}

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Session configuration
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'None'  # Allow cross-site for Vercel + Railway
SESSION_COOKIE_AGE = 86400  # 24 hours

# CSRF configuration
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'None'  # Allow cross-site for Vercel + Railway

# Logging configuration for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': False,
        },
        'api': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Cache configuration (using local memory for Railway)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,
        'OPTIONS': {
            'MAX_ENTRIES': 1000,
        }
    }
}

# Email configuration (for production)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@threadtravels.com')

# Additional production settings that might help
DATA_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
FILE_UPLOAD_MAX_MEMORY_SIZE = 10485760  # 10MB
DATA_UPLOAD_MAX_NUMBER_FIELDS = 10240
FILE_UPLOAD_MAX_NUMBER_FILES = 100

# Disable debug toolbar in production
DEBUG_TOOLBAR = False

# Gunicorn and Railway deployment settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True