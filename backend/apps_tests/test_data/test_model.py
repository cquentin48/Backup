from django.utils import timezone

from django.test import SimpleTestCase
from data.models import (ChosenVersion, Command, CommandHistory,
                         Device, Package, Repository, Snapshot, Shell)

from apps_tests.test_data.utils import create_test_package, create_test_device


class TestChosenVersion(SimpleTestCase):
    """Template model test class
    """
    databases = '__all__'

    def tearDown(self):
        ChosenVersion.objects.all().delete()
        Package.objects.all().delete()

    def test_str(self):
        """
        Check if the device string function behaves normally
        (should display the name and operating system in the function).
        """
        # Given
        chosen_version_number = "1.0"
        package = create_test_package(
            name="My package!",
            pre_install_lines="",
            package_type="package"
        )
        test_object = ChosenVersion.objects.create(
            chosen_version=chosen_version_number,
            package=package
        )

        # Acts
        expected_result = f"{package.name} - {chosen_version_number}"
        op_result = str(test_object)

        # Asserts
        self.assertEqual(op_result, expected_result)


class TestDevice(SimpleTestCase):
    """Template model test class
    """
    databases = '__all__'

    def tearDown(self):
        Device.objects.all().delete()

    def test_str(self):
        """
        Check if the device string function behaves normally
        (should display the name and operating system in the function).
        """
        # Given
        name = "Mon objet!"
        test_object = create_test_device(
            name=name
        )

        # Acts
        expected_result = f"{name}"
        op_result = str(test_object)

        # Asserts
        self.assertEqual(op_result, expected_result)


class TestPackage(SimpleTestCase):
    """
    Backup package unit test class
    """
    databases = '__all__'

    def tearDown(self):
        Package.objects.all().delete()
        return super().tearDown()

    def test_str(self):
        """
        Check if the associated string method displays the correct output
        """
        # Given
        name = "My package!"
        package_type = "package type"
        pre_install_lines = ""

        package = Package.objects.create(
            name=name,
            type=package_type,
            pre_install_lines=pre_install_lines
        )

        # Acts
        expected_op_result = name
        op_result = str(package)

        # Asserts
        self.assertEqual(op_result, expected_op_result)


class TestRepository(SimpleTestCase):
    """
    Backup repository model unit test class
    """

    databases = '__all__'

    def tearDown(self):
        Repository.objects.all().delete()
        Package.objects.all().delete()

    def test_str(self):
        """
        Check if the associated string method displays the correct output
        """
        # Given
        name = "My package!"
        sources_lines = ""

        package = Repository.objects.create(
            name=name,
            sources_lines=sources_lines
        )

        # Acts
        expected_op_result = f"{package.id} - {name}"
        op_result = str(package)

        # Asserts
        self.assertEqual(op_result, expected_op_result)


class TestSave(SimpleTestCase):
    """
    Backup save model unit test class
    """
    databases = '__all__'

    def tearDown(self) -> None:
        Snapshot.objects.all().delete()
        Device.objects.all().delete()

    def test_str(self):
        """
        Check if the associated string method displays the correct output
        """
        # Given
        device = create_test_device(
            name="Mon objet!"
        )
        save_date = timezone.now()
        test_object = Snapshot.objects.create(
            related_device=device,
            save_date=save_date
        )

        # Acts
        expected_result = f"{str(device)} : {str(save_date)}"
        op_result = str(test_object)

        # Asserts
        self.assertEqual(op_result, expected_result)


class TestShell(SimpleTestCase):
    """
    Shell unit test case
    """
    databases = '__all__'

    def test__str__(self):
        """
        Check if the __str__ function displays what it is supposed to.
        """
        # Given
        sh_type = "shell"

        created_object = Shell.objects.create(
            sh_type=sh_type,
        )
        cmd = Command.objects.create(
            prefix="cmd",
            arguments="none",
            related_shell=created_object
        )
        cmd_history = CommandHistory.objects.create(
            command=cmd,
            timestamp=timezone.now(),
            related_shell=created_object
        )

        created_object.configuration = cmd
        created_object.history = cmd_history

        # Acts
        expected_result = "shell - 1 line | 1 line"
        op_result = str(created_object)

        # Asserts
        self.assertEqual(op_result, expected_result)
