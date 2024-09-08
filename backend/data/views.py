from django.http import HttpResponse

# Create your views here.
def index(request):
    """Sample view with basic "hello world"

    Returns:
        HTTPResponse: page response
    """
    return HttpResponse("Hello world!")
