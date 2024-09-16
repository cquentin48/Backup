from django.urls import path


from .consumers import BackupImportConsumer

websocket_urlpatterns = [
    path("backup/import",BackupImportConsumer.as_asgi())
]
