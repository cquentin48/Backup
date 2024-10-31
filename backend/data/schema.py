import graphene
from graphene_django import DjangoObjectType

from .models import Device, Package, Save


class DeviceType(DjangoObjectType):
    """Object Model Type class use for querying objects
    stored

    """
    class Meta:
        """
        Meta data class for queries & mutations on devices
        """
        model = Device
        fields = '__all__'


class PackageType(DjangoObjectType):
    """Object Model Type class use for querying objects
    stored

    """
    class Meta:
        """
        Meta data class for queries & mutations on devices
        """
        model = Package
        fields = '__all__'


class Query(graphene.ObjectType):
    """Query class used in the graphql

    Args:
        graphene (_type_): _description_

    Returns:
        _type_: _description_
    """
    all_devices = graphene.List(DeviceType)
    all_packages = graphene.List(PackageType)
    all_packages_by_type_and_device = graphene.List(
        PackageType,
        package_type=graphene.String(required=True),
        device_id=graphene.String(required=False)
    )

    def resolve_all_devices(self, _):
        """ Resolve every object created

        Returns:
            Device: Every object created
        """
        return Device.objects.all()

    def resolve_all_packages(self, _):
        """ Resolve every object created

        Returns:
            Device: Every object created
        """
        return Package.objects.all()

    def resolve_all_packages_by_type_and_device(self, _, package_type, device_id: str):
        """ Fetch every packages with the type specified in query

        :type package_type: str
        :param package_type: Type of the package sent

        :type device_id: str
        :param device_id: Identifier of the device

        :rtype:
            List[Package]
        """
        device = Device.objects.get(id=device_id)
        saves = list(Save.objects.filter(related_device=device))

        versions = []
        for save in saves:
            save_versions = save.versions.all()
            for chosen_version in save_versions:
                if chosen_version not in versions:
                    versions.append(chosen_version)

        return [version.package for version in versions if version.package.type == package_type]


schema = graphene.Schema(query=Query)
