from django.core.exceptions import ObjectDoesNotExist

import graphene
from ..models import Device, Snapshot


class SnapshotHeader(graphene.ObjectType):
    """
    Graphql query output sub-class for query ``fetch_device_info``.
    Fetch save key : snapshot ID and snapshot update date
    """
    key = graphene.String(
        description="ID of the snapshot stored in the database."
    )

    date = graphene.String(
        description="Snapshot update date stored in the database"
    )
    operating_system = graphene.String(
        description="Operating system of the device at the time the snapshot was created"
    )

    class Meta:
        """
        Meta subclass for the query subclass SaveHeader
        """
        description = "Device snapshot header data."


class DeviceSoftwareVersion(graphene.ObjectType):
    """
    Sub-graphql query output class for query ``fetch_device_info``
    Only software version informations here.
    """
    chosen_version = graphene.String(
        description="Version of the package chosen in the device"
    )
    name = graphene.String(
        description="Name of the package"
    )
    install_type = graphene.String(
        description="Software installation type (e.g. DVD media install, APT install, ...)"
    )

    class Meta:
        """
        Meta subclass for the device versions software
        """
        description = "Device installed software data."


class DeviceInfos(graphene.ObjectType):
    """
    Graphql query output for query ``fetch_device_info``
    """
    cores = graphene.Int(
        description="Device processor cores"
    )
    memory = graphene.BigInt(
        description="Device volatile memory"
    )
    name = graphene.String(
        description="Device device name"
    )
    processor = graphene.String(
        description="Device processor name"
    )
    snapshots = graphene.List(
        SnapshotHeader,
        description="Every device snapshot set inside the server"
    )

    class Meta:
        """
        Meta subclass for the device information graphql data object.
        """
        name = "DeviceInfos"
        description = "Device informations data stored inside the backup server."


class DeviceInfoType(graphene.ObjectType):
    """
    Query object representing the query asking for the device informations
    """
    device_id = graphene.BigInt(
        description="ID of the device object stored in the database."
    )

    def resolve_device_infos(self, _, device_id) -> DeviceInfos:
        """ Description
        :type info:
        :param info:

        :type device_id: str
        :param device_id: ID of the device

        :rtype: DeviceInfos
        """
        try:
            device = Device.objects.get(id=device_id)
            raw_snapshots = list(Snapshot.objects.filter(related_device=device))
            snapshots = [
                SnapshotHeader(
                    key=snapshot.id,
                    date=snapshot.save_date.strftime("%Y-%m-%d"),
                    operating_system=snapshot.operating_system
                )
                for snapshot in list(Snapshot.objects.filter(related_device=device))
            ]

            versions_data = []
            for snapshot in raw_snapshots:
                for found_version in list(snapshot.versions.all()):
                    versions_data.append(
                        DeviceSoftwareVersion(
                            chosen_version=found_version.chosen_version,
                            name=found_version.package.name,
                            install_type=found_version.package.type
                        ))

            return DeviceInfos(
                cores=device.cores,
                memory=device.memory,
                name=device.name,
                processor=device.processor,
                snapshots=snapshots
            )

        except ObjectDoesNotExist as _:
            return None
