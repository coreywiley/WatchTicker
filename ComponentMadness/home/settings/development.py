from .base import *
import sys

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
THUMBNAIL_DEBUG = True

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

}

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

STATIC_URL = '/static/'
MEDIA_URL = '/static/images/'

STATIC_ROOT = "D:\Rogue\ComponentMadness\ComponentMadness\home\static\\"
MEDIA_ROOT = "D:\Rogue\ComponentMadness\ComponentMadness\home\static\\images\\"