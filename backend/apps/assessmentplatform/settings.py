import os
import sentry_sdk
from django.utils.translation import gettext_lazy as _
from pathlib import Path


sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    traces_sample_rate=1.0,
    environment=os.environ.get('SENTRY_ENVIRONMENT'),
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)

__version__ = "1.23.3"

SECRET_KEY = os.environ.get('SECRET_KEY')

TOKEN_KEY = '-Urn2uB97sQwaWG4ni65wJYEqyxLEDDsfYg82XIcToM='

USE_MODELTRANSLATION = False

ALLOWED_HOSTS = []
ALLOWED_HOSTS.extend(
    filter(
        None,
        os.environ.get('ALLOWED_HOSTS', '').split(','),
    )
)

TIME_ZONE = "UTC"

USE_TZ = False

LANGUAGE_CODE = "en"

LANGUAGES = (("en", _("English")),)

DEBUG = os.environ.get('DEBUG') == 'True'

SESSION_EXPIRE_AT_BROWSER_CLOSE = True

SITE_ID = 1

USE_I18N = False

FILE_UPLOAD_PERMISSIONS = 0o644

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

DATABASES = {
    "default": {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'HOST': os.environ.get('DB_HOST'),
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASS'),
        'TEST': {
            'NAME': 'test_db'
        },
    }
}

if os.environ.get('GITHUB_WORKFLOW'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'github_actions',
            'USER': 'postgres',
            'PASSWORD': 'postgres',
            'HOST': '127.0.0.1',
            'PORT': '5432',
        }
    }

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = os.environ.get('EMAIL_HOST_PORT')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS') == 'True'
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL') == 'True'

DOMAIN = (os.environ.get('DOMAIN'))
SITE_NAME = ('Flickit')
EXPIRATION_DAYS = 7

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
            ],
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
        },
    },
]

INSTALLED_APPS = [
    "health_check",
    "django.contrib.admin",
    "django.contrib.auth",
    "mozilla_django_oidc",
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
    'account',
    'baseinfo',
    'assessment',
    'assessmentplatform',
    'drf_yasg',
]

MIDDLEWARE = (
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3333",
    "http://127.0.0.1:3333",
    "https://flickit.org"
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ['https://flickit.org']

PACKAGE_NAME_FILEBROWSER = "filebrowser_safe"
PACKAGE_NAME_GRAPPELLI = "grappelli_safe"

OPTIONAL_APPS = (
    "debug_toolbar",
    "django_extensions",
    "compressor",
    PACKAGE_NAME_FILEBROWSER,
    PACKAGE_NAME_GRAPPELLI,
)

REST_FRAMEWORK = {
    'COERCE_DECIMAL_TO_STRING': False,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'mozilla_django_oidc.contrib.drf.OIDCAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'PAGE_SIZE': 200,
    'EXCEPTION_HANDLER': 'assessmentplatform.exceptionhandlers.custom_exception_handler',
}

ASSESSMENT_SERVER_PORT = os.environ.get('ASSESSMENT_SERVER_PORT')
ASSESSMENT_URL = f"http://assessment:{ASSESSMENT_SERVER_PORT}/"

STATIC_URL = '/static/'
MEDIA_URL = '/media/'


BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = BASE_DIR / 'media'

STATIC_ROOT = BASE_DIR / 'static'

OIDC_OP_JWKS_ENDPOINT = os.environ.get('OIDC_OP_JWKS_ENDPOINT',
                                       default='http://localhost:8080/realms/flickit/protocol/openid-connect/certs')
OIDC_RP_CLIENT_ID = os.environ.get('OIDC_RP_CLIENT_ID')
OIDC_RP_CLIENT_SECRET = os.environ.get('OIDC_RP_CLIENT_SECRET')
OIDC_RP_SIGN_ALGO = os.environ.get('OIDC_RP_SIGN_ALGO', 'RS256')
OIDC_VERIFY_SSL = os.environ.get('OIDC_VERIFY_SSL') == 'True'
OIDC_OP_AUTHORIZATION_ENDPOINT = os.environ.get('OIDC_OP_AUTHORIZATION_ENDPOINT',
                                                default='http://localhost:8080/realms/flickit/protocol/openid-connect/auth')
OIDC_OP_TOKEN_ENDPOINT = os.environ.get('OIDC_OP_TOKEN_ENDPOINT',
                                        default='http://localhost:8080/realms/flickit/protocol/openid-connect/token')
OIDC_OP_USER_ENDPOINT = os.environ.get('OIDC_OP_USER_ENDPOINT',
                                       default='http://localhost:8080/realms/flickit/protocol/openid-connect/userinfo')
OIDC_DRF_AUTH_BACKEND = "baseinfo.oidcbackend.MyOIDCAB"

PRODUCTION_STATE = os.environ.get('PRODUCTION_STATE') == 'True'

f = os.path.join(PROJECT_APP_PATH, "local_settings.py")
if os.path.exists(f):
    import imp
    import sys

    module_name = "%s.local_settings" % PROJECT_APP
    module = imp.new_module(module_name)
    module.__file__ = f
    sys.modules[module_name] = module
    exec(open(f, "rb").read())

AUTH_USER_MODEL = 'account.User'

ACCOUNTS_PROFILE_FORM_EXCLUDE_FIELDS = (
    "username",
    "first_name",
    "last_name",
)

ADMIN_MENU_ORDER = (
    ("Users", ('account.User', "auth.Group",)),
    ("BaseInfo", ("baseinfo.AssessmentKit", "baseinfo.Questionnaire",
                  "baseinfo.AssessmentSubject", "baseinfo.QualityAttribute", "baseinfo.Question",
                  "baseinfo.AssessmentKitTag")),
    ("Content", ("pages.Page", "blog.BlogPost",
                 "generic.ThreadedComment", (_("Media Library"), "media-library"),)),
    ("Site", ("sites.Site", "redirects.Redirect", "conf.Setting")),
)

IMPORT_EXPORT_USE_TRANSACTIONS = True
ACCOUNTS_VERIFICATION_REQUIRED = True

LOGIN_REDIRECT_URL = '/baseinfo/'

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Bearer': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}
