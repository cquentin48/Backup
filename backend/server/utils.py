from elasticsearch import Elasticsearch
from django.conf import settings

ELASTICSEARCH_CLIENT = None
def init_es_client():
    """
    Initialize the client to manage elastic search inputs
    """
    global ELASTICSEARCH_CLIENT
    ELASTICSEARCH_CLIENT = Elasticsearch(settings.ELASTICSEARCH_URL)
    print(ELASTICSEARCH_CLIENT.ping())


def get_es_client():
    return ELASTICSEARCH_CLIENT