from django.http.request import HttpRequest

from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response


@api_view(['GET'])
@renderer_classes([JSONRenderer])
def index_page(request: HttpRequest):
    """
    Return embedding and data database status
    """
    return Response({
        'data': f"{request.get_host()}:{request.get_port()}/api/v1/"
    })
