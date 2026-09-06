"""Choose Cloudinary or local disk for media uploads."""


def is_cloudinary_configured(
    *,
    cloudinary_url: str = "",
    cloud_name: str = "",
    api_key: str = "",
    api_secret: str = "",
) -> bool:
    if (cloudinary_url or "").strip():
        return True
    return bool(
        (cloud_name or "").strip()
        and (api_key or "").strip()
        and (api_secret or "").strip()
    )


def build_storages(*, use_cloudinary: bool) -> dict:
    media_backend = (
        "cloudinary_storage.storage.MediaCloudinaryStorage"
        if use_cloudinary
        else "django.core.files.storage.FileSystemStorage"
    )
    return {
        "default": {"BACKEND": media_backend},
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
        },
    }
