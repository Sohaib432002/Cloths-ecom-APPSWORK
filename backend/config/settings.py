"""Environment-driven Django settings for the SHOP.CO API."""

from pathlib import Path
import sys
import warnings

import dj_database_url
import environ
from django.core.exceptions import ImproperlyConfigured

from config.storage import build_storages, is_cloudinary_configured

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

RUNNING_TESTS = "test" in sys.argv or env.bool("DJANGO_TEST", default=False)

DEBUG = env.bool("DJANGO_DEBUG", default=False)
if RUNNING_TESTS:
    DEBUG = env.bool("DJANGO_DEBUG", default=True)

SECRET_KEY = env("DJANGO_SECRET_KEY", default="") or env("SECRET_KEY", default="")
if not SECRET_KEY:
    if DEBUG or RUNNING_TESTS:
        SECRET_KEY = "django-insecure-local-dev-only-change-me"
    else:
        raise ImproperlyConfigured(
            "DJANGO_SECRET_KEY must be set when DJANGO_DEBUG is False."
        )
if not DEBUG and SECRET_KEY.startswith("django-insecure"):
    raise ImproperlyConfigured(
        "Set a unique DJANGO_SECRET_KEY before running with DJANGO_DEBUG=False."
    )

def _append_unique(values, item):
    item = (item or "").strip()
    if item and item not in values:
        values.append(item)


ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[]) or env.list(
    "DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"]
)
if RUNNING_TESTS:
    for host in ("testserver", "localhost", "127.0.0.1"):
        _append_unique(ALLOWED_HOSTS, host)

render_host = env("RENDER_EXTERNAL_HOSTNAME", default="")
railway_host = env("RAILWAY_PUBLIC_DOMAIN", default="")
fly_app = env("FLY_APP_NAME", default="")
_append_unique(ALLOWED_HOSTS, render_host)
_append_unique(ALLOWED_HOSTS, railway_host)
if fly_app:
    _append_unique(ALLOWED_HOSTS, f"{fly_app}.fly.dev")
if not DEBUG:
    _append_unique(ALLOWED_HOSTS, ".onrender.com")
    _append_unique(ALLOWED_HOSTS, ".up.railway.app")
    _append_unique(ALLOWED_HOSTS, ".fly.dev")

CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=["http://localhost:3000", "http://127.0.0.1:3000"],
)
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False

CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
)
for platform_host in (render_host, railway_host, f"{fly_app}.fly.dev" if fly_app else ""):
    if platform_host:
        _append_unique(CSRF_TRUSTED_ORIGINS, f"https://{platform_host}")

USE_CLOUDINARY = is_cloudinary_configured(
    cloudinary_url=env("CLOUDINARY_URL", default=""),
    cloud_name=env("CLOUDINARY_CLOUD_NAME", default=""),
    api_key=env("CLOUDINARY_API_KEY", default=""),
    api_secret=env("CLOUDINARY_API_SECRET", default=""),
)

if not DEBUG and not USE_CLOUDINARY:
    warnings.warn(
        "Local FileSystemStorage is in use with DJANGO_DEBUG=False. "
        "Media files on ephemeral hosts (Render/Railway/Fly) will be lost. "
        "Configure CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.",
        RuntimeWarning,
        stacklevel=1,
    )

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
]

CLOUDINARY_APPS = ["cloudinary_storage"] if USE_CLOUDINARY else []

INSTALLED_APPS = [
    *DJANGO_APPS,
    *CLOUDINARY_APPS,
    "django.contrib.staticfiles",
    *(["cloudinary"] if USE_CLOUDINARY else []),
    "rest_framework",
    "corsheaders",
    "core.apps.CoreConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

_database_url = env("DATABASE_URL", default="")
_sqlite_url = f"sqlite:///{(BASE_DIR / 'db.sqlite3').as_posix()}"
DATABASES = {
    "default": dj_database_url.parse(
        _database_url or _sqlite_url,
        conn_max_age=env.int("DATABASE_CONN_MAX_AGE", default=600),
        ssl_require=env.bool("DATABASE_SSL_REQUIRE", default=not DEBUG)
        if (_database_url or "").startswith("postgres")
        else False,
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("TIME_ZONE", default=env("DJANGO_TIME_ZONE", default="Asia/Karachi"))
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

STORAGES = build_storages(use_cloudinary=USE_CLOUDINARY)

if USE_CLOUDINARY:
    cloud_name = env("CLOUDINARY_CLOUD_NAME", default="")
    api_key = env("CLOUDINARY_API_KEY", default="")
    api_secret = env("CLOUDINARY_API_SECRET", default="")
    if cloud_name and api_key and api_secret:
        CLOUDINARY_STORAGE = {
            "CLOUD_NAME": cloud_name,
            "API_KEY": api_key,
            "API_SECRET": api_secret,
            "SECURE": True,
        }

WHITENOISE_USE_FINDERS = DEBUG or RUNNING_TESTS
WHITENOISE_AUTOREFRESH = DEBUG or RUNNING_TESTS
WHITENOISE_MANIFEST_STRICT = False

MAX_UPLOAD_SIZE = env.int(
    "DJANGO_MAX_UPLOAD_SIZE", default=env.int("MAX_UPLOAD_SIZE", default=5 * 1024 * 1024)
)
FILE_UPLOAD_MAX_MEMORY_SIZE = MAX_UPLOAD_SIZE
DATA_UPLOAD_MAX_MEMORY_SIZE = MAX_UPLOAD_SIZE + (1024 * 1024)
ALLOWED_IMAGE_CONTENT_TYPES = (
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        *(
            ["rest_framework.renderers.BrowsableAPIRenderer"]
            if DEBUG
            else []
        ),
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/min",
        "user": "240/min",
        "checkout": "10/min",
    },
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 24,
}

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
