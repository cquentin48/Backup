"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

from .routing import websocket_urlpatterns
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from elasticsearch import Elasticsearch
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

django_asgi_app = get_asgi_application()

# pylint: disable=wrong-import-position
# Append the sentences inside the database
es = Elasticsearch("http://embeddings:9200")
es.indices.create(
    index="sentence_embeddings",
    body={
        "mappings": {
            "properties": {
                "sentence": {"type": "text"},
                "tags": {
                    "properties": {
                        "source": {"type":"keyword"},
                        "action": {"type":"keyword"},
                        "tags": {"type":"text"}, #Only for specific cases such as Doc or specific queries/mutations
                    }
                },
                "embedding": {
                    "type": "dense_vector",
                    "dims": 1024,
                    "index": True,
                    "similarity": "cosine"
                }
            }
        }
    },
    ignore=400
)

# TODO: load the sentence files (unique values only) -> compute the embedding, then compute the similarity with the ner model. If the sentence is not set, it is added!

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    )
})
