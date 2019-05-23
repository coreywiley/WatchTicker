"""
Django settings for tutorspark project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '123456789' #PUT A KEY HERE FOR NEW PROJECTS

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
THUMBNAIL_DEBUG = False

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'libraries': {
                'home_extras': 'home.templatetags.home_extras'
            },
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                "home.context_processors.static"
            ],
        },
    },
]

ALLOWED_HOSTS = ['*']


# Application definition
INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_extensions',
    'home',
    'user',
    'modelWebsite',
    'rest_framework'
)

MIDDLEWARE = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}


ROOT_URLCONF = 'home.urls'

WSGI_APPLICATION = 'home.wsgi.application'

AUTH_USER_MODEL = 'user.User'
LOGIN_URL = '/user/login'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases
'''
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'tempdatabase',
    }
}
'''
'''
# Postgres
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 0,
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'watch_ticker',
        'USER': 'tick_tock',
        'PASSWORD': '8-5f&nQ@^wF8$uYA',
        'HOST': '127.0.0.1',
        'PORT': '5432'
    },
}

DATABASE_URL = '127.0.0.1:5432'
#7hm<[VXHb>B=P9#^

0 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "Bob's Watches"

0 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "Boneta Wholesale"

5 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "Crown And Caliber"

0 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "House Of Time"

5 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "Watch Box"

0 0,8,16 * * * cd /root/ComponentMadness/ComponentMadness; python3.6 manage.py scraperHandler "We Love Watches"
'''
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 0,
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'defaultdb',
        'USER': 'doadmin',
        'PASSWORD': 'gk9wv8qydqjfw4nt',
        'HOST': 'db-postgresql-nyc1-24557-do-user-228594-0.db.ondigitalocean.com',
        'PORT': '25060'
    },
}

DATABASE_URL = 'db-postgresql-nyc1-24557-do-user-228594-0.db.ondigitalocean.com:25060'
#PGPASSWORD=gk9wv8qydqjfw4nt pg_restore -U doadmin -h db-postgresql-nyc1-24557-do-user-228594-0.db.ondigitalocean.com -p 25060 -d defaultdb <local-pg-dump-path>

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True



LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'datefmt': "%Y-%m-%d %H:%M:%S",
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d :: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'stream': sys.stdout,
            'formatter': 'verbose'
        },
    },
    'loggers': {
        'django.requests': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'DEBUG',
        },
    },
}


SENDGRID_API_KEY = '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'