from django.urls import re_path
from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView

from .views import index

urlpatterns=[
    re_path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True))),
    re_path('hello-world/', index,name="index")
]
