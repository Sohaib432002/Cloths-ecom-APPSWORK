from django.conf import settings
from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError


def validate_image_upload(file):
    """Reject oversized, wrong-type, or corrupt product images."""
    size = getattr(file, "size", 0) or 0
    max_bytes = getattr(settings, "MAX_UPLOAD_SIZE", 5 * 1024 * 1024)
    if size > max_bytes:
        raise ValidationError("Image must be 5MB or smaller.")

    content_type = (getattr(file, "content_type", "") or "").lower()
    allowed = getattr(
        settings,
        "ALLOWED_IMAGE_CONTENT_TYPES",
        ("image/jpeg", "image/png", "image/webp", "image/gif"),
    )
    if content_type and content_type not in allowed:
        raise ValidationError("Unsupported image type. Use JPEG, PNG, WebP, or GIF.")

    try:
        position = file.tell()
    except (AttributeError, OSError):
        position = 0

    try:
        file.seek(0)
        image = Image.open(file)
        image.verify()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValidationError("File is not a valid image.") from exc
    finally:
        try:
            file.seek(position)
        except (AttributeError, OSError):
            pass
