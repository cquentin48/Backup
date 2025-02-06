from graphene_django.utils.testing import GraphQLTestCase

from data.models import Device, Package, Snapshot, ChosenVersion
from apps_tests.test_data.utils import (
    create_test_chosen_version,
    create_test_device,
    create_test_package
)


class SnapshotSchemaQueryTest(GraphQLTestCase):
    """Schema test class from
    """

    databases = '__all__'
    GRAPHQL_URL = 'http://0.0.0.0:8000/api/v1/data/graphql/'

    def tearDown(self) -> None:
        """After each test function
        which flush database
        """
        Snapshot.objects.all().delete()
        ChosenVersion.objects.all().delete()
        Package.objects.all().delete()
        Device.objects.all().delete()

    def test_resolve_snapshot_infos(self):
        """
        Check if the GRAPHQL query "snapshotInfos" can be resolved in normal conditions
        """
        # Given
        device_name = "Mon objet!"
        test_device = create_test_device(name=device_name)

        package_name = "My package!"
        package_type = "package type"
        pre_install_lines = ""
        
        chosen_versions_numbers = [
            {
                "chosen_version":"1.0"
            },
            {
                "chosen_version":"1.0"
            }
        ]

        test_package = create_test_package(
            package_type=package_type,
            name=package_name,
            pre_install_lines=pre_install_lines
        )

        save_date = "2020-01-01"
        test_save = Snapshot.objects.create(
            related_device=test_device,
            save_date=save_date
        )

        for raw_chosen_version in chosen_versions_numbers :
            new_version = create_test_chosen_version(
                chosen_version=raw_chosen_version['chosen_version'],
                package=test_package
            )
            test_save.versions.add(new_version)

        # Acts
        response = self.query(
            '''
            query getSaveInfos($snapshotID:String!){
                snapshotInfos(snapshotId: $snapshotID) {
                    versions{
                        softwareVersion,
                        name,
                        softwareInstallType
                    },
                    repositories{
                        sourcesLines,
                        name
                    }
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
        for index, version in enumerate(op_result['versions']):
            self.assertEqual(version['softwareVersion'], chosen_versions_numbers[index]['chosen_version'])
            self.assertEqual(version['name'], 'My package!')
            self.assertEqual(version['softwareInstallType'], 'package type')
        self.assertEqual(len(op_result['repositories']), 0)

    def test_resolve_snapshot_infos_unkown_snapshot(self):
        """
        Check if the GRAPHQL query "DeviceInfos" can be resolved in unusual conditions : the snapshot is not set
        """
        # Given

        snapshot_id = 1

        # Acts
        response = self.query(
            '''
            query getSaveInfos($snapshotID:String!){
                snapshotInfos(snapshotId: $snapshotID) {
                    versions{
                        softwareVersion,
                        name,
                        softwareInstallType
                    },
                    repositories{
                        sourcesLines,
                        name
                    }
                }
            }
            ''',
            variables={
                'snapshotID': str(snapshot_id)
            }
        )

        op_result = response.json()['data']['snapshotInfos']

        # Asserts
        self.assertEqual(op_result, None)
