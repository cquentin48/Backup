import graphene
from graphene_django import DjangoObjectType

from .models import Device, ChosenVersion, Package, PythonVenv

class DeviceType(DjangoObjectType):
    """Object Model Type class use for querying objects
    stored

    """
    class Meta:
        """
        Meta data class for queries & mutations on devices
        """
        model=Device
        fields='__all__'

class PackageType(DjangoObjectType):
    """Object Model Type class use for querying objects
    stored

    """
    class Meta:
        """
        Meta data class for queries & mutations on devices
        """
        model=Package
        fields='__all__'

class Query(graphene.ObjectType):
    """Query class used in the graphql

    Args:
        graphene (_type_): _description_

    Returns:
        _type_: _description_
    """
    all_devices = graphene.List(DeviceType)
    all_packages = graphene.List(PackageType)
    all_packages_by_type = graphene.List(
        PackageType,
        package_type=graphene.String(required=True),
        device_id=graphene.String(required=False)
    )
    objects_by_name = graphene.Field(DeviceType,
        name=graphene.String(required=True))

    def resolve_all_devices(root,_): # pylint: disable=no-self-argument
        """ Resolve every object created

        Returns:
            Device: Every object created
        """
        return Device.objects.all()

    def resolve_all_packages(root,_): # pylint: disable=no-self-argument
        """ Resolve every object created

        Returns:
            Device: Every object created
        """
        return Package.objects.all()
    
    def resolve_all_packages_by_type_and_device(root,_, package_type, device_id:str):
        """ Fetch every packages with the type specified in query
    
        :type package_type: str
        :param package_type: Type of the package sent
        
        :type device_id: str
        :param device_id: Identifier of the device
    
        :rtype:
            List[Package]
        """
        device = Device.objects.get(id=device_id)
        versions = ChosenVersion.objects.filter(device=device)
        
        return list(set([version.package for version in versions if version.type == package_type]))

    def resolve_objects_by_name(root,_,name): # pylint: disable=no-self-argument
        """Fetch every object based on the name set

        Args:
            name (_type_): name of the object queried

        Returns:
            List[Device]: Every object with the current name entered
        """
        try:
            return Device.objects.get(name=name)
        except Device.DoesNotExist:
            return None


schema = graphene.Schema(query=Query)
