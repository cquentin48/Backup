import graphene
from django.core.exceptions import ObjectDoesNotExist

from ..models import Snapshot


class RepositoryData(graphene.ObjectType):
    """
    GraphQL representation sub-class for the query ``fetch_snapshot``.
    """
    sources_lines = graphene.String(
        description="Repository instructions to add it to the device."
    )

    name = graphene.String(
        description="Name of the repository source."
    )

    class Meta:
        """
        Meta subclass for the device repository data
        """
        description = "Device software source (e.g. repository)."


class DeviceSoftwareVersion(graphene.ObjectType):
    """
    Sub-graphql query output class for query ``fetch_snapshot``
    Only software version informations here.
    """

    chosen_version = graphene.String(
        description="Version of the software chosen in the device"
    )
    """
    Software version installed on the device
    """

    name = graphene.String(
        description="Name of the software"
    )
    """
    Software name
    """

    install_type = graphene.String(
        description="Software installation type (e.g. marketplace install, " +
        "Package managment install, ...)"
    )
    """
    Software installation type (e.g. marketplace install, Package managment install, ...)
    """

    class Meta:
        """
        Meta subclass for the device versions software
        """
        description = "Device installed software data."


class SnapshotData(graphene.ObjectType):
    """
    GraphQL response object class for the query ``resolve_snapshot``
    """

    versions = graphene.List(
        DeviceSoftwareVersion,
        description="Every software versions installed on the device"
    )
    """
    Every software version installed on the device
    """

    repositories = graphene.List(
        RepositoryData,
        description="Every repositories linked to the snapshot"
    )

    operating_system = graphene.String(
        description="Operating system of the device at the time where the snapshot was created"
    )


class SnapshotQuery(graphene.ObjectType):
    """
    Graphql query managment class for the query "snapshotInfo".
    """

    snapshot_id = graphene.BigInt(
        description="Save key in the database"
    )
    """
    Id of the snapshot stored in the database
    """

    def resolve_snapshot(self, _, snapshot_id: str) -> SnapshotData:
        """ Fetch snapshot data from the database. Returns the result as a ``SaveData`` object
        :type snapshot_id:str
        :param snapshot_id: ID of the snapshot in the database

        :rtype: SnapshotData
        """
        try:
            snapshot = Snapshot.objects.get(id=snapshot_id)
            versions = []
            for found_version in list(snapshot.versions.all()):
                versions.append(
                    DeviceSoftwareVersion(
                        chosen_version=found_version.chosen_version,
                        name=found_version.package.name,
                        install_type=found_version.package.type
                    ))
            return SnapshotData(
                versions=versions,
                repositories=[],
                operating_system=snapshot.operating_system
            )
        except ObjectDoesNotExist as _:
            return None
