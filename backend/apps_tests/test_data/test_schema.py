from graphene_django.utils.testing import GraphQLTestCase

from data.models import Device, Package, Save, ChosenVersion
from apps_tests.test_data.utils import (
    create_test_chosen_version,
    create_test_device,
    create_test_package
)


class SchemaQueryTest(GraphQLTestCase):
    """Schema test class from
    """

    databases = '__all__'
    GRAPHQL_URL = 'http://0.0.0.0:8000/api/v1/data/graphql/'

    def tearDown(self) -> None:
        """After each test function
        which flush database
        """
        Save.objects.all().delete()
        ChosenVersion.objects.all().delete()
        Package.objects.all().delete()
        Device.objects.all().delete()

    def test_resolve_all_devices(self):
        """
        Check if all packages can be queried with the query "all_packages"
        """
        # Given
        name = "Mon objet!"
        test_object = create_test_device(
            name=name
        )

        # Acts
        response = self.query(
            '''
            query testQuery{
                allDevices{
                    id
                }
            }
            '''
        )

        op_result = response.json()['data']['allDevices']

        # Expected results
        results_counts = 1

        # Asserts
        self.assertEqual(len(op_result), results_counts)
        self.assertEqual(op_result[0]['id'], str(test_object.id))

    def test_resolve_all_packages(self):
        """
        Check if all packages can be queried with the query "all_packages"
        """
        # Given
        name = "My package"
        package_type = "Type"
        pre_install_lines = ""
        _ = create_test_package(
            name,
            package_type,
            pre_install_lines
        )

        # Acts
        response = self.query(
            '''
            query testQuery{
                allPackages{
                    id,
                    name,
                    type,
                    preInstallLines
                }
            }
            '''
        )

        op_result = response.json()['data']['allPackages']

        # Expected results
        results_counts = 1

        # Asserts
        self.assertEqual(len(op_result), results_counts)
        self.assertEqual(op_result[0]['id'], '1')
        self.assertEqual(op_result[0]['name'], name)
        self.assertEqual(op_result[0]['type'], package_type)
        self.assertEqual(op_result[0]['preInstallLines'], pre_install_lines)

    def test_resolve_all_packages_by_type_and_device(self):
        """
        Check if all packages can be queried with the query "all_packages_by_type_and_device"
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
        test_save = Save.objects.create(
            related_device=test_device,
            save_date=save_date
        )
        test_save.versions.add(first_test_chosen_version)
        test_save.versions.add(second_test_chosen_version)

        # Acts
        response = self.query(
            '''
            query testQuery($deviceID: String!, $packageType: String!){
                allPackagesByTypeAndDevice(packageType:$packageType,deviceId:$deviceID){
                    id,
                    name,
                    type,
                    preInstallLines
                }
            }
            ''',
            variables={
                'packageType': package_type,
                'deviceID': str(device_id)
            }
        )

        op_result = response.json()['data']['allPackagesByTypeAndDevice']

        # Expected results
        results_counts = 2

        # Asserts
        self.assertEqual(len(op_result), results_counts)
