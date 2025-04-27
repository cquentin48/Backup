from django.urls import path, re_path

from chatbot.consumers import ChatbotConsumer
from data.consumers import BackupImportConsumer

websocket_urlpatterns = [
    path("backup/import", BackupImportConsumer.as_asgi()),
    path("backup/chatbot", ChatbotConsumer.as_asgi())
]
