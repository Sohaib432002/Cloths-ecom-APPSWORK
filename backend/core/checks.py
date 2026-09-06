from django.conf import settings
from django.core.checks import Warning, register


@register()
def local_media_in_production(app_configs, **kwargs):
    if (
        settings.DEBUG
        or settings.USE_CLOUDINARY
        or getattr(settings, "RUNNING_TESTS", False)
    ):
        return []
    return [
        Warning(
            "Local disk media storage is active with DJANGO_DEBUG=False. "
            "Files will be lost on ephemeral hosts (Render/Railway/Fly). "
            "Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, "
            "and CLOUDINARY_API_SECRET.",
            id="core.W001",
        )
    ]
