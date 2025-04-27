from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from .settings import STATIC_URL, STATIC_ROOT
from .views.status import get_databases_status

urlpatterns = [
    path('status/', get_databases_status),
    path('admin/', admin.site.urls),
    path('api/v1/', include('data.urls'))
] + static(STATIC_URL, document_root=STATIC_ROOT)

    path('api/v1/', include('data.urls'))
] + static(STATIC_URL, document_root=STATIC_ROOT)
