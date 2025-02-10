import graphene

from .device import DeviceInfos, DeviceInfoType
from .snapshot import SnapshotData, SnapshotQuery

class Query(graphene.ObjectType):
    """
    Query class used in the graphql
    """

    device_infos = graphene.Field(
        DeviceInfos,
        device_id=graphene.String(
            description="ID of the device stored in the database."
        ),
        description="Fetch device informations alongside a list of every saves. "+
        "Base of the device id given in the parameter."
    )
    """
    Device infos query graphql class object
    """

    snapshot_infos = graphene.Field(
        SnapshotData,
        snapshot_id=graphene.String(
            description="ID of the snapshot stored in the database."
        ),
        description="Fetch specific device snapshot from the database."
    )
    """
    Snapshot infos query graphql class object
    """

    def resolve_device_infos(self, info, device_id) -> DeviceInfos:
        """ Description

        :type device_id: str
        :param device_id: ID of the device
        
        :rtype: DeviceInfos
        """
        return DeviceInfoType.resolve_device_infos(self, info, device_id)

    def resolve_snapshot_infos(self, info, snapshot_id:str) -> SnapshotData:
        """ From a snapshot index in the database, retrieve every used libraries 
        alongside the repositories.
    
        :type snapshot_id: str
        :param snapshot_id: Database snapshot index
    
        :rtype: SnapshotData
        """
        return SnapshotQuery.resolve_snapshot(self, info, snapshot_id)


schema = graphene.Schema(query=Query)
