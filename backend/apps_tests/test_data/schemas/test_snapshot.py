from graphene_django.utils.testing import GraphQLTestCase

from data.models import Snapshot
from apps_tests.test_data.utils import (
    create_test_chosen_version,
    create_test_device,
    create_test_package
)

from .utils import tear_down_objects


class SnapshotSchemaQueryTest(GraphQLTestCase):
    """Schema test class from
    """

    databases = '__all__'
    GRAPHQL_URL = 'http://0.0.0.0:8000/api/v1/data/graphql/'

    def tearDown(self) -> None:
        """After each test function
        which flush database
        """
        tear_down_objects()

    def test_resolve_snapshot_infos(self):
        """
        Check if the GRAPHQL query "snapshotInfos" can be resolved in normal conditions
        """
        # Given
        test_device = create_test_device(name="Mon objet!")
        
        operating_system = "My OS!"

        chosen_version= "1.0"

        test_package = create_test_package(
            package_type="package type",
            name="My package!",
            pre_install_lines=""
        )

        save_date = "2020-01-01"
        test_save = Snapshot.objects.create(
            related_device=test_device,
            save_date=save_date,
            operating_system=operating_system
        )

        for _ in range(0,2):
            new_version = create_test_chosen_version(
                chosen_version=chosen_version,
                package=test_package
            )
            test_save.versions.add(new_version)

        # Acts
        response = self.query(
            '''
            query getSaveInfos($snapshotID:BigInt!){
                snapshotInfos(snapshotId: $snapshotID) {
                    versions{
                        name,
                        installType,
                        chosenVersion
                    },
                    repositories{
                        sourcesLines,
                        name
                    },
                    operatingSystem
                }
            }
            ''',
            variables={
                'snapshotID': str(test_save.id)
            }
        )

        op_result = response.json()['data']['snapshotInfos']

        # Asserts
        self.assertEqual(len(op_result['versions']), 2)
        for _, version in enumerate(op_result['versions']):
            self.assertEqual(
                version['chosenVersion'], "1.0")
            self.assertEqual(version['name'], 'My package!')
            self.assertEqual(version['installType'], 'package type')
        self.assertEqual(len(op_result['repositories']), 0)

    def test_resolve_snapshot_infos_unknown_snapshot(self):
        """
        Check if the GRAPHQL query "DeviceInfos" can be resolved in unusual conditions :
        the snapshot is not set
        """
        # Given

        snapshot_id = 1

        # Acts
        response = self.query(
            '''
            query getSaveInfos($snapshotID:BigInt!){
                snapshotInfos(snapshotId: $snapshotID) {
                    versions{
                        name,
                        installType
                    },
                    repositories{
                        sourcesLines,
                        name
                    },
                    operatingSystem
                }
            }
            ''',
            variables={
                'snapshotID': snapshot_id
            }
        )

        op_result = response.json()['data']['snapshotInfos']

        # Asserts
        self.assertEqual(op_result, None)
