from django.conf import settings
from django.db import connection
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def health(request):
    try:
        connection.ensure_connection()
        database = "ok"
    except Exception:
        database = "error"

    ok = database == "ok"
    return Response(
        {
            "ok": ok,
            "service": "SHOP.CO Django API",
            "debug": settings.DEBUG,
            "storage": "cloudinary" if settings.USE_CLOUDINARY else "local",
            "database": database,
        },
        status=status.HTTP_200_OK if ok else status.HTTP_503_SERVICE_UNAVAILABLE,
    )
