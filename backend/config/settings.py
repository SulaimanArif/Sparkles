"""
Django settings for config project.
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-this-in-production-123456789')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# ALLOWED_HOSTS configuration
# Django validates the Host header against this list
ALLOWED_HOSTS_STR = os.environ.get('ALLOWED_HOSTS', '')

# Check if we're running on Render (has RENDER environment variable)
IS_RENDER = os.environ.get('RENDER', '') == 'true'

if ALLOWED_HOSTS_STR:
    ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS_STR.split(',') if host.strip()]
elif not DEBUG or IS_RENDER:
    # Production or Render: Allow all Render domains and common patterns
    # The '.onrender.com' pattern matches any subdomain
    # Also include common proxy patterns
    ALLOWED_HOSTS = [
        '.onrender.com',
        'localhost',
        '127.0.0.1',
    ]
    
    # If on Render and no explicit ALLOWED_HOSTS, be more permissive
    if IS_RENDER and not ALLOWED_HOSTS_STR:
        # Get the service name from Render's environment
        render_service = os.environ.get('RENDER_SERVICE_NAME', '')
        if render_service:
            ALLOWED_HOSTS.append(f'{render_service}.onrender.com')
else:
    # Development defaults
    ALLOWED_HOSTS = ['localhost', '127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'api',
]

# Import allowed_hosts_fix early to override get_host() if on Render
try:
    import config.allowed_hosts_fix  # noqa
except ImportError:
    pass

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'config.csrf_middleware.CSRFExemptAPIMiddleware',  # Exempt API from CSRF
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Removed XFrameOptionsMiddleware to allow iframe embedding
    # We'll set X_FRAME_OPTIONS in settings instead
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR.parent / 'frontend' / 'dist',
        ],
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

WSGI_APPLICATION = 'config.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

# Support PostgreSQL via DATABASE_URL (for Render/Heroku) or default to SQLite
if os.environ.get('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=os.environ.get('DATABASE_URL'),
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# React build directory
REACT_APP_DIR = BASE_DIR.parent / 'frontend'
REACT_BUILD_DIR = REACT_APP_DIR / 'dist'

STATICFILES_DIRS = []

# Add React build directory if it exists
if REACT_BUILD_DIR.exists():
    STATICFILES_DIRS.append(REACT_BUILD_DIR)

# WhiteNoise configuration for serving static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100
}

# CSRF settings - exempt API endpoints since we're using token authentication
CSRF_TRUSTED_ORIGINS = [
    'https://*.onrender.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

# For API endpoints, we use token auth, so CSRF is not needed
# But we still want CSRF for admin panel
CSRF_COOKIE_SECURE = not DEBUG  # Only secure in production
SESSION_COOKIE_SECURE = not DEBUG  # Only secure in production

# Cookie settings for iframe embedding
# In production (HTTPS), use 'None' to allow cross-site cookies for iframes
# This helps with YouTube embeds that might need cookies
SESSION_COOKIE_SAMESITE = 'None' if (not DEBUG and os.environ.get('RENDER') == 'true') else 'Lax'
CSRF_COOKIE_SAMESITE = 'None' if (not DEBUG and os.environ.get('RENDER') == 'true') else 'Lax'

# Security headers - Allow iframe embedding
# X_FRAME_OPTIONS = 'SAMEORIGIN' allows our site to be embedded in same-origin iframes
# It does NOT block us from embedding external content like YouTube
# We removed XFrameOptionsMiddleware to avoid any conflicts

# Additional security settings
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True

# CORS configuration - Not needed when serving from same origin, but keep for development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

CORS_ALLOW_CREDENTIALS = True
