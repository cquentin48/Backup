from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from graphene_django.views import GraphQLView
from .views import index

app_name = "data"

urlpatterns = [
    path('', index, name="index"),
    path("graphql/", csrf_exempt(GraphQLView.as_view(graphiql=True)), name="GraphQL")
]
