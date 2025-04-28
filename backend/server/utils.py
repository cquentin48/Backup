from typing import Tuple

from opensearchpy import OpenSearch

ELASTICSEARCH_CLIENT = None


def init_embedding_client():
    """
    Initialize the client to manage elastic search inputs
    """
    global ELASTICSEARCH_CLIENT # pylint: disable=global-statement
    ELASTICSEARCH_CLIENT = OpenSearch(
        "http://embeddings:9200",
        use_ssl=False,
        verify_certs=False
    )
    print(ELASTICSEARCH_CLIENT.ping())


def get_embeddings_client() -> Tuple[None|OpenSearch]:
    """ Returns the embbeding client

    :rtype: Tuple[None|OpenSearch]
    """
    return ELASTICSEARCH_CLIENT
