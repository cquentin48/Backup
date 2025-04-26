"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""
import logging
import os
import django

from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from opensearchpy.exceptions import RequestError

from .routing import websocket_urlpatterns
from .utils import get_es_client, init_es_client

# Logging object
logging = logging.getLogger("Backup initialisation")

logging.info("Initiating the django server")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

logging.info("Launching the ASGI application")
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    )
})

# Append the sentences inside the database similarity with the ner model. If the sentence is not set, it is added!
init_es_client()
client = get_es_client()
try:
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
    logging.info("Sentence index created for similarity.")
except RequestError as e:
    if "resource_already_exists_exception" in str(e.info):
        logging.debug("Index already created. Skipping the creation")
    else:
        raise e