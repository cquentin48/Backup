import graphene
from graphene_django import DjangoObjectType

from .models import ObjectModel

class ObjectModelType(DjangoObjectType):
    """Object Model Type class use for querying objects
    stored

    """
    class Meta: # pylint: disable=missing-class-docstring
        model=ObjectModel
        fields='__all__'

class Query(graphene.ObjectType):
    """Query class used in the graphql

    Args:
        graphene (_type_): _description_

    Returns:
        _type_: _description_
    """
    all_objects = graphene.List(ObjectModelType)
    objects_by_name = graphene.Field(ObjectModelType,
        name=graphene.String(required=True))

    def resolve_all_objects(root,_): # pylint: disable=no-self-argument
        """ Resolve every object created

        Returns:
            ObjectModel: Every object created
        """
        return ObjectModel.objects.all()

    def resolve_objects_by_name(root,_,name): # pylint: disable=no-self-argument
        """Fetch every object based on the name set

        Args:
            name (_type_): name of the object queried

        Returns:
            List[ObjectModel]: Every object with the current name entered
        """
        try:
            return ObjectModel.objects.get(name=name)
        except ObjectModel.DoesNotExist:
            return None


schema = graphene.Schema(query=Query)
