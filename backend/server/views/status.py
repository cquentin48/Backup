from django.db import connection
from django.db.utils import OperationalError

from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from ..utils import get_es_client

@api_view(['GET'])
@renderer_classes([JSONRenderer])
def get_databases_status(request):
    es = get_es_client()
    es_status = es.ping()
    pg_status = False
    try:
        connection.ensure_connection()
        pg_status = True
    except OperationalError:
        pass
    finally:
        return Response({
            'elastic_search_status': "ONLINE" if es_status else 'OFFLINE',
            'postgres_status': "ONLINE" if pg_status else 'OFFLINE'
        })