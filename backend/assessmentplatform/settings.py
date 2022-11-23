import os

from django.utils.translation import gettext_lazy as _
from datetime import timedelta


SECRET_KEY = os.environ.get('SECRET_KEY')

USE_MODELTRANSLATION = False

# DJVERSION_VERSION='0.1.0'
# DJVERSION_UPDATED='11/3/2022'

ALLOWED_HOSTS = []
ALLOWED_HOSTS.extend(
    filter(
        None,
        os.environ.get('ALLOWED_HOSTS', '').split(','),
    )
)

TIME_ZONE = "UTC"

USE_TZ = True

LANGUAGE_CODE = "en"

LANGUAGES = (("en", _("English")),)

DEBUG = bool(int(os.environ.get('DEBUG', 0)))

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

SITE_ID = 1

USE_I18N = False

AUTHENTICATION_BACKENDS = ("mezzanine.core.auth_backends.MezzanineBackend",)

FILE_UPLOAD_PERMISSIONS = 0o644

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': os.environ.get('DB_HOST'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASS'),
    }
}




CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL'),

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST'),
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER'),
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD'),
EMAIL_PORT = 25
DEFAULT_FROM_EMAIL =  os.environ.get('DEFAULT_FROM_EMAIL'),
EMAIL_USE_TLS=True

DOMAIN = (os.environ.get('DOMAIN')) 
SITE_NAME = ('Assessment Platform') 

PROJECT_APP_PATH = os.path.dirname(os.path.abspath(__file__))
PROJECT_APP = os.path.basename(PROJECT_APP_PATH)
PROJECT_ROOT = BASE_DIR = os.path.dirname(PROJECT_APP_PATH)

CACHE_MIDDLEWARE_KEY_PREFIX = PROJECT_APP

ROOT_URLCONF = "%s.urls" % PROJECT_APP

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(PROJECT_ROOT, "templates")],
        "OPTIONS": {
            "context_processors": [
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.debug",
                "django.template.context_processors.i18n",
                "django.template.context_processors.static",
                "django.template.context_processors.media",
                "django.template.context_processors.request",
                "django.template.context_processors.tz",
                "mezzanine.conf.context_processors.settings",
                "mezzanine.pages.context_processors.page",
            ],
            "loaders": [
                "mezzanine.template.loaders.host_themes.Loader",
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
        },
    },
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.redirects",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'django_filters',
    'corsheaders',
    'rest_framework',
    "mezzanine.boot",
    "mezzanine.conf",
    "mezzanine.core",
    "mezzanine.generic",
    "mezzanine.pages",
    "mezzanine.blog",
    "mezzanine.forms",
    "mezzanine.galleries",
    'mezzanine.accounts',
    'import_export',
    'djoser',
    'account',
    'baseinfo',
    'assessment',
    # 'djversion',
]

MIDDLEWARE = (
    "corsheaders.middleware.CorsMiddleware",
    "mezzanine.core.middleware.UpdateCacheMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # Uncomment if using internationalisation or localisation
    # 'django.middleware.locale.LocaleMiddleware',
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "mezzanine.core.request.CurrentRequestMiddleware",
    "mezzanine.core.middleware.RedirectFallbackMiddleware",
    "mezzanine.core.middleware.AdminLoginInterfaceSelectorMiddleware",
    "mezzanine.core.middleware.SitePermissionMiddleware",
    "mezzanine.pages.middleware.PageMiddleware",
    "mezzanine.core.middleware.FetchFromCacheMiddleware",
)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3333",
    "http://127.0.0.1:3333",
    "https://checkup.asta.ir",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ['https://checkup.asta.ir']



PACKAGE_NAME_FILEBROWSER = "filebrowser_safe"
PACKAGE_NAME_GRAPPELLI = "grappelli_safe"

OPTIONAL_APPS = (
    "debug_toolbar",
    "django_extensions",
    "compressor",
    PACKAGE_NAME_FILEBROWSER,
    PACKAGE_NAME_GRAPPELLI,
)



#############
# Customization#
#############

f = os.path.join(PROJECT_APP_PATH, "local_settings.py")
if os.path.exists(f):
    import imp
    import sys

    module_name = "%s.local_settings" % PROJECT_APP
    module = imp.new_module(module_name)
    module.__file__ = f
    sys.modules[module_name] = module
    exec(open(f, "rb").read())

try:
    from mezzanine.utils.conf import set_dynamic_settings
except ImportError:
    pass
else:
    set_dynamic_settings(globals())


AUTH_USER_MODEL = 'account.User'

ADMIN_MENU_ORDER = (
    ("Users", ('account.User', "auth.Group",)),
    ("BaseInfo", ("baseinfo.AssessmentProfile", "baseinfo.MetricCategory",
    "baseinfo.AssessmentSubject" , "baseinfo.QualityAttribute", "baseinfo.Metric")),
    ("Content", ("pages.Page", "blog.BlogPost",
       "generic.ThreadedComment", (_("Media Library"), "media-library"),)),
    ("Site", ("sites.Site", "redirects.Redirect", "conf.Setting")),
)

REST_FRAMEWORK = {
    'COERCE_DECIMAL_TO_STRING': False,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'PAGE_SIZE':200
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=500)
}

DJOSER = {
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user': 'account.serializers.UserSerializer',
        'user_create': 'account.serializers.UserCreateSerializer',
        'current_user': 'account.serializers.UserSerializer',
    },
    'EMAIL': {
            'activation': 'account.views.CustomActivationEmail'
    }
}

IMPORT_EXPORT_USE_TRANSACTIONS = True

ACCOUNTS_VERIFICATION_REQUIRED = True


STATIC_URL = '/admin/static/'
MEDIA_URL = '/admin/media/'

MEDIA_ROOT = '/admin/vol/web/media'
STATIC_ROOT = '/admin/vol/web/static'

