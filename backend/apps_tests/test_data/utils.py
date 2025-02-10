from data.models import ChosenVersion, Device, Package


def create_test_package(name: str, package_type: str, pre_install_lines: str) -> Package:
    """ Description
    :type name: str
    :param name: Name of the package

    :type package_type: str
    :param package_type: Package type (e.g. apt, snap)

    :type pre_install_lines: str
    :param pre_install_lines: Lines to execute before installing the package

    :returns: Package
    """
    return Package.objects.create(
        name=name, type=package_type, pre_install_lines=pre_install_lines
    )

def create_test_chosen_version(package: Package, chosen_version: str) -> ChosenVersion:
    """ Creates a package chosen version for later unit test

    :type package: Package
    :param package: Related package

    :type chosen_version: str
    :param chosen_version: Chosen version (e.g 1.0)

    :rtype: ChosenVersion
    """
    return ChosenVersion.objects.create(
        package=package,
        chosen_version=chosen_version
    )



def create_test_device(name: str) -> Device:
    """ Creates a new device. It will be used for unit test

    :type name: str
    :param name: Name of the device

    :rtype: Device
    """
    return Device.objects.create(name=name, cores=6, memory=32, operating_system="My OS!", processor="My processor!")
