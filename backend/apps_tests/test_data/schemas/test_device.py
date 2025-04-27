from graphene_django.utils.testing import GraphQLTestCase

from data.models import Snapshot
from apps_tests.test_data.utils import (
    create_test_chosen_version,
    create_test_device,
    create_test_package
)

from .utils import tear_down_objects


class DeviceSchemaQueryTest(GraphQLTestCase):
    """Schema test class from
    """

    databases = '__all__'
    GRAPHQL_URL = 'http://0.0.0.0:8000/api/v1/data/graphql/'

    def tearDown(self) -> None:
        """After each test function
        which flush database
        """
        tear_down_objects()

    def test_resolve_device_infos(self):
        """
        Check if the GRAPHQL query "DeviceInfos" can be resolved in normal conditions
        """
        # Given
        device_name = "Mon objet!"
        test_device = create_test_device(name=device_name)

        device_id = test_device.id

        package_name = "My package!"
        package_type = "package type"
        pre_install_lines = ""

        test_package = create_test_package(
            package_type=package_type,
            name=package_name,
            pre_install_lines=pre_install_lines
        )

        first_test_chosen_version = create_test_chosen_version(
            chosen_version="1.0",
            package=test_package
        )

        second_test_chosen_version = create_test_chosen_version(
            chosen_version="2.0",
            package=test_package
        )

        save_date = "2020-01-01"
        test_save = Snapshot.objects.create(
            related_device=test_device,
            save_date=save_date
        )
        test_save.versions.add(first_test_chosen_version)
        test_save.versions.add(second_test_chosen_version)

        # Acts
        response = self.query(
            '''
            query getDeviceInfos($deviceID:BigInt!){
                deviceInfos(deviceId:$deviceID){
                    cores,
                    memory,
                    name,
                    processor,
                    snapshots{
                        key,
                        date
                    }
                }
            }
            ''',
            variables={
                'deviceID': str(device_id)
            }
        )

        op_result = response.json()['data']['deviceInfos']

        # Asserts
        self.assertEqual(op_result['cores'], 6)
        self.assertEqual(op_result['memory'], 32)
        self.assertEqual(op_result['processor'], "My processor!")
        self.assertEqual(len(op_result['snapshots']), 1)
        self.assertEqual(op_result['snapshots'][0]['key'], '1')
        self.assertEqual(op_result['snapshots'][0]['date'], '2020-01-01')

    def test_resolve_device_infos_unkown_device(self):
        """
        Check if the GRAPHQL query "DeviceInfos" can be resolved in unusual conditions :
        the device is not set
        """
        # Given

        device_id = 1

        # Acts
        response = self.query(
            '''
            query getDeviceInfos($deviceID:BigInt!){
                deviceInfos(deviceId:$deviceID){
                    cores,
                    memory,
                    name,
                    processor,
                    snapshots{
                        key,
                        date
                    }
                }
            }
            ''',
            variables={
                'deviceID': str(device_id)
            }
        )

        op_result = response.json()['data']['deviceInfos']

        # Asserts
        self.assertEqual(op_result, None)
