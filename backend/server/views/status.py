from django.db import connection
from django.db.utils import OperationalError

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from ..utils import get_embeddings_client


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_databases_status(request):
    """
    Return embedding and data database status
    """
    es = get_embeddings_client()
    es_status = es.ping()
    try:
        connection.ensure_connection()
        return Response({
            'elastic_search_status': "ONLINE" if es_status else 'OFFLINE',
            'postgres_status': "ONLINE"
        })
    except OperationalError:
        return Response({
            'elastic_search_status': "ONLINE" if es_status else 'OFFLINE',
            'postgres_status': 'OFFLINE'
        })
