from .base import *
import sys
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
THUMBNAIL_DEBUG = False

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
    }
}

ADMINS = [('Jeremy','jeremy.thiesen1@gmail.com'), ('David','dmiller89@gmail.com')]
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.webfaction.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'cm_errors'
EMAIL_HOST_PASSWORD = 'vghj12'
DEFAULT_FROM_EMAIL = 'jeremy@jthiesen1.webfactional.com'
SERVER_EMAIL = 'jeremy@jthiesen1.webfactional.com'