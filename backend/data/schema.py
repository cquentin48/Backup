from django.core.exceptions import ObjectDoesNotExist
import graphene
from graphene_django import DjangoObjectType

from .models import Device, Package, Save


class DeviceVersionInfo(graphene.ObjectType):
    """
    Sub-graphql query output class for query ``fetch_device_info``
    Only version informations here
    """
    version_id = graphene.String()
    name = graphene.String()
    package_type = graphene.String()

    class Meta:
        name = "device_version"


class DeviceInfo(graphene.ObjectType):
    """
    Graphql query output for query ``fetch_device_info``
    """
    device_id = graphene.String()
    cores = graphene.Int()
    memory = graphene.BigInt()
    name = graphene.String()
    operating_system = graphene.String()
    processor = graphene.String()
    versions = graphene.List(
        DeviceVersionInfo
    )

    class Meta:
        name = "DeviceInfos"


class DeviceInfoType(graphene.ObjectType):
    """
    Query object representing the query asking for the device informations
    """
    device_id = graphene.String(
        description="ID of the device object stored in the database."
    )

    def resolve_device_infos(self, info, device_id) -> dict:
        """ Description
        :type info:
        :param info:

        :type device_id: str
        :param device_id: ID of the device

        :rtype: dict
        """
        try:
            device = Device.objects.get(id=device_id)
            saves = list(Save.objects.filter(related_device=device))
            print(saves)
            
            versions_data = []
            for save in saves:
                for version in list(save.versions.all()):
                    versions_data.append(
                        DeviceVersionInfo(
                            version_id = version.chosen_version,
                            name = version.package.name,
                            package_type = version.package.type
                        ))

            return DeviceInfo(
                device_id=device.id,
                cores=device.cores,
                memory=device.memory,
                name=device.name,
                operating_system=device.operating_system,
                processor=device.processor,
                versions=versions_data
            )

        except ObjectDoesNotExist as e:
            return None


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
    """
    Query class used in the graphql
    """
    all_devices = graphene.List(DeviceType)
    all_packages = graphene.List(PackageType)
    all_packages_by_type_and_device = graphene.List(
        PackageType,
        package_type=graphene.String(required=True),
        device_id=graphene.String(required=False)
    )
    device_infos = graphene.Field(DeviceInfo, device_id=graphene.String(
        description="ID of the device object stored in the database."
    ))

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

    def resolve_device_infos(self, info, device_id) -> dict:
        """ Description

        :type info:
        :param info:

        :type device_id: str
        :param device_id: ID of the device
        """
        return DeviceInfoType.resolve_device_infos(self, info, device_id)


schema = graphene.Schema(query=Query)
