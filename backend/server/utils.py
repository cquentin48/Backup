from opensearchpy import OpenSearch
from .settings import ELASTICSEARCH_URL

ELASTICSEARCH_CLIENT = None
def init_es_client():
    """
    Initialize the client to manage elastic search inputs
    """
    global ELASTICSEARCH_CLIENT
    ELASTICSEARCH_CLIENT = OpenSearch(
        "http://embeddings:9200",
        use_ssl=False,
        verify_certs=False
    )
    print(ELASTICSEARCH_CLIENT.ping())


def get_es_client():
    return ELASTICSEARCH_CLIENT