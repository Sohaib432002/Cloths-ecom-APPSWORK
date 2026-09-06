from io import BytesIO

from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import reverse
from PIL import Image

from config.storage import build_storages, is_cloudinary_configured
from core.validators import validate_image_upload


class CloudinaryStorageConfigTests(SimpleTestCase):
    def test_url_enables_cloudinary(self):
        self.assertTrue(
            is_cloudinary_configured(cloudinary_url="cloudinary://key:secret@demo")
        )

    def test_triple_credentials_enable_cloudinary(self):
        self.assertTrue(
            is_cloudinary_configured(
                cloud_name="demo", api_key="key", api_secret="secret"
            )
        )

    def test_partial_credentials_use_local_disk(self):
        self.assertFalse(
            is_cloudinary_configured(cloud_name="demo", api_key="key", api_secret="")
        )

    def test_storages_switch_backend(self):
        local = build_storages(use_cloudinary=False)
        cloud = build_storages(use_cloudinary=True)
        self.assertEqual(
            local["default"]["BACKEND"],
            "django.core.files.storage.FileSystemStorage",
        )
        self.assertEqual(
            cloud["default"]["BACKEND"],
            "cloudinary_storage.storage.MediaCloudinaryStorage",
        )


class HealthEndpointTests(TestCase):
    def test_health_reports_local_storage(self):
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["service"], "SHOP.CO Django API")
        self.assertEqual(payload["database"], "ok")
        self.assertEqual(payload["storage"], "local")

    def test_health_includes_cors_for_storefront(self):
        response = self.client.get(
            "/api/health/",
            HTTP_ORIGIN="http://localhost:3000",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.headers.get("Access-Control-Allow-Origin"),
            "http://localhost:3000",
        )

    @override_settings(USE_CLOUDINARY=True)
    def test_health_reports_cloudinary_when_configured(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.json()["storage"], "cloudinary")


def _png_bytes(size=(8, 8), color="red"):
    buffer = BytesIO()
    Image.new("RGB", size, color=color).save(buffer, format="PNG")
    return buffer.getvalue()


class ImageUploadValidatorTests(SimpleTestCase):
    def test_accepts_valid_png(self):
        upload = SimpleUploadedFile("shirt.png", _png_bytes(), content_type="image/png")
        validate_image_upload(upload)

    def test_rejects_non_image_bytes(self):
        upload = SimpleUploadedFile("notes.txt", b"not-an-image", content_type="image/png")
        with self.assertRaises(ValidationError):
            validate_image_upload(upload)

    @override_settings(MAX_UPLOAD_SIZE=10)
    def test_rejects_oversized_file(self):
        upload = SimpleUploadedFile("huge.png", _png_bytes(), content_type="image/png")
        with self.assertRaises(ValidationError):
            validate_image_upload(upload)

    def test_rejects_disallowed_content_type(self):
        upload = SimpleUploadedFile("file.gif", _png_bytes(), content_type="application/pdf")
        with self.assertRaises(ValidationError):
            validate_image_upload(upload)
