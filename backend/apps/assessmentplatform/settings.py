import os
from datetime import timedelta
from django.utils.translation import gettext_lazy as _

__version__ = "1.4.0-SNAPSHOT"

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

DEBUG = os.environ.get('DEBUG')  == 'True'

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

CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL'),

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
EMAIL_PORT = os.environ.get('EMAIL_HOST_PORT')
DEFAULT_FROM_EMAIL =  os.environ.get('DEFAULT_FROM_EMAIL')
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS')  == 'True'
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
    'import_export',
    #'djoser',
    'account',
    'baseinfo',
    'assessment',
    'assessmentplatform',
    'drf_yasg',
    'storages',
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
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
    'PAGE_SIZE':200,
    'EXCEPTION_HANDLER': 'assessmentplatform.exceptionhandlers.custom_exception_handler',
}

DSL_PARSER_URL_SERVICE = "http://dsl:8080/extract/"
ASSESSMENT_SERVER_PORT = os.environ.get('ASSESSMENT_SERVER_PORT')
ASSESSMENT_URL = f"http://assessment:{ASSESSMENT_SERVER_PORT}/"


DEFAULT_FILE_STORAGE = 'assessmentplatform.custom_storage.MediaStorage'
STATICFILES_STORAGE = 'assessmentplatform.custom_storage.StaticStorage'
AWS_S3_SIGNATURE_VERSION = "s3v4"

AWS_ACCESS_KEY_ID = os.environ.get('MINIO_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('MINIO_SECRET_ACCESS_KEY')
AWS_S3_ENDPOINT_URL = os.environ.get('MINIO_API')
AWS_S3_USE_SSL = os.environ.get('MINIO_USE_SSL')  == 'True'
MINIO_MEDIA_BUCKET_NAME = os.environ.get('MINIO_MEDIA_BUCKET')
MINIO_STATIC_BUCKET_NAME = os.environ.get('MINIO_STATIC_BUCKET')
MINIO_QUERYSTRING_EXPIRE_MEDIA = os.environ.get('MINIO_QUERYSTRING_EXPIRE_MEDIA')
MINIO_URL= os.environ.get('MINIO_URL')


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
    "baseinfo.AssessmentSubject" , "baseinfo.QualityAttribute", "baseinfo.Question", "baseinfo.AssessmentKitTag")),
    ("Content", ("pages.Page", "blog.BlogPost",
       "generic.ThreadedComment", (_("Media Library"), "media-library"),)),
    ("Site", ("sites.Site", "redirects.Redirect", "conf.Setting")),
)

# SIMPLE_JWT = {
#     'AUTH_HEADER_TYPES': ('JWT',),
#     'ACCESS_TOKEN_LIFETIME': timedelta(minutes=500),
# }
#
# DJOSER = {
#     'ACTIVATION_URL': 'activate/{uid}/{token}',
#     'SEND_ACTIVATION_EMAIL': True,
#     'SERIALIZERS': {
#         'user': 'account.serializers.userserializers.UserSerializer',
#         'user_create': 'account.serializers.userserializers.UserCreateSerializer',
#         'current_user': 'account.serializers.userserializers.UserCustomSerializer',
#     },
#     'EMAIL': {
#             'activation': 'account.views.userviews.CustomActivationEmail'
#     },
# }

IMPORT_EXPORT_USE_TRANSACTIONS = True
ACCOUNTS_VERIFICATION_REQUIRED = True

# CLEINT_ID = 'myapp'
# OIDC_AUTH = {
#     # Specify OpenID Connect endpoint. Configuration will be
#     # automatically done based on the discovery document found
#     # at <endpoint>/.well-known/openid-configuration
#     'OIDC_ENDPOINT': 'http://localhost:8080',
#     'USERINFO_ENDPOINT': 'http://localhost:8080/realms/myrealm/protocol/openid-connect/userinfo',
#
#     # The Claims Options can now be defined by a static string.
#     # ref: https://docs.authlib.org/en/latest/jose/jwt.html#jwt-payload-claims-validation
#     # The old OIDC_AUDIENCES option is removed in favor of this new option.
#     # `aud` is only required, when you set it as an essential claim.
#     'OIDC_CLAIMS_OPTIONS': {
#         'aud': {
#             'values': ['myapp'],
#             'essential': True,
#         }
#     },
#
#     # (Optional) Function that resolves id_token into user.
#     # This function receives a request and an id_token dict and expects to
#     # return a User object. The default implementation tries to find the user
#     # based on username (natural key) taken from the 'sub'-claim of the
#     # id_token.
#     'OIDC_RESOLVE_USER_FUNCTION': 'baseinfo.authentication.get_user_by_email',
#
#     # (Optional) Number of seconds in the past valid tokens can be
#     # issued (default 600)
#     'OIDC_LEEWAY': 600,
#
#     # (Optional) Time before signing keys will be refreshed (default 24 hrs)
#     'OIDC_JWKS_EXPIRATION_TIME': 24 * 60 * 60,
#
#     # (Optional) Time before bearer token validity is verified again (default 10 minutes)
#     'OIDC_BEARER_TOKEN_EXPIRATION_TIME': 10 * 60,
#
#     # (Optional) Token prefix in JWT authorization header (default 'JWT')
#     'JWT_AUTH_HEADER_PREFIX': 'JWT',
#
#     # (Optional) Token prefix in Bearer authorization header (default 'Bearer')
#     'BEARER_AUTH_HEADER_PREFIX': 'Bearer',
#
#     # (Optional) Which Django cache to use
#     'OIDC_CACHE_NAME': 'default',
#
#     # (Optional) A cache key prefix when storing and retrieving cached values
#     'OIDC_CACHE_PREFIX': 'oidc_auth.',
# }

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

