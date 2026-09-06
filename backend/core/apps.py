from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"
    verbose_name = "Core"

    def ready(self):
        from django.contrib import admin

        from . import checks  # noqa: F401

        admin.site.site_header = "SHOP.CO Admin"
        admin.site.site_title = "SHOP.CO"
        admin.site.index_title = "Store administration"
