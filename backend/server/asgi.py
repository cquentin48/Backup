"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

from .utils import get_es_client, init_es_client
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from .routing import websocket_urlpatterns
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()


django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    )
})

# pylint: disable=wrong-import-position

# Append the sentences inside the database

# TODO: load the sentence files (unique values only) -> compute the embedding, then compute the similarity with the ner model. If the sentence is not set, it is added!
init_es_client()
client = get_es_client()
mapping = {
    "settings": {
        "index": {
            "knn": True
        }
    },
    "mappings": {
        "properties": {
            "embedding": {
                "type": "knn_vector",
                "dimension": 1024
            },
            "sentence": {"type": "text"},
            "source": {"type": "text"},
            "action": {"type": "text"},
            "tags": {"type": "text"},
        }
    }
}
client.indices.create(
    index="sentence_embeddings",
    body=mapping
)
