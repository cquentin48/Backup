from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include,re_path

from rest_framework import permissions

from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from . import settings


schema_view = get_schema_view( # pylint: disable=invalid-name
   openapi.Info(
      title="Backup API",
      default_version='v1',
      description="Backup devices configuration server",
      license=openapi.License(name="BSD License"),
   ),
   public=False,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$',
        schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$',
        schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/v1/data/',include('data.urls'))
]

if settings.DEBUG:
    urlpatterns = urlpatterns + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.STATIC_ROOT)
