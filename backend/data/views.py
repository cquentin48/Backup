from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

@api_view(['GET'])
@renderer_classes([JSONRenderer])
def index(request):
    """
    Index base page with urls in a JSON format
    """
    return Response({
        'urls':{
            'graphql':f"{request.get_host()}/api/v1/graphql/"
        }
    })
